import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { TenantStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (statusParam && ['PENDING', 'ACTIVE', 'SUSPENDED'].includes(statusParam.toUpperCase())) {
      where.status = statusParam.toUpperCase() as TenantStatus;
    }
    if (search) {
      where.OR = [
        { commerceName: { contains: search, mode: 'insensitive' } },
        { subdomain: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            assignedSalesRep: {
              select: { id: true, email: true, fullName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      tenants.map(t => ({
        ...t,
        modules: JSON.parse(t.modules || '[]'),
      }))
    );
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Seul le rôle ADMIN a le droit de créer des boutiques gratuitement
    const user = await requireRole(['ADMIN'], req);

    const body = await req.json();
    const { commerceName, subdomain, email, fullName, modules = [], customDomain, imageTag } = body;

    if (!commerceName || !subdomain || !email) {
      return NextResponse.json(
        { detail: 'Les champs commerceName, subdomain et email sont obligatoires.' },
        { status: 400 }
      );
    }

    const cleanSubdomain = subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Vérifier unicité du sous-domaine
    const existing = await prisma.tenant.findUnique({
      where: { subdomain: cleanSubdomain },
    });
    if (existing) {
      return NextResponse.json(
        { detail: `Le sous-domaine '${cleanSubdomain}' est déjà utilisé.` },
        { status: 409 }
      );
    }

    // Trouver ou créer l'utilisateur client
    let targetUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          email: email.trim().toLowerCase(),
          fullName: fullName?.trim() || commerceName,
          role: 'CLIENT',
        },
      });
    }

    // Récupérer la version d'image globale par défaut si non spécifiée
    let effectiveImage = imageTag;
    if (!effectiveImage) {
      const defaultSetting = await prisma.systemSettings.findUnique({
        where: { key: 'boutique_default_image_tag' },
      });
      effectiveImage = defaultSetting?.value || 'ghcr.io/bezbee25/boutique-global:latest';
    }

    // Créer le tenant
    const tenant = await prisma.tenant.create({
      data: {
        userId: targetUser.id,
        email: targetUser.email,
        commerceName: commerceName.trim(),
        subdomain: cleanSubdomain,
        customDomain: customDomain?.trim().toLowerCase() || null,
        status: 'ACTIVE',
        modules: JSON.stringify(modules),
        imageTag: effectiveImage,
        k8sNamespace: `tenant-${cleanSubdomain}`,
        k8sStatus: 'PROVISIONING',
      },
    });

    // Déclencher le provisionnement Kubernetes via Store Manager
    const { StoreManagerClient } = await import('@/lib/store-manager-client');
    const provisionResult = await StoreManagerClient.provisionStore({
      storeId: tenant.id,
      subdomain: cleanSubdomain,
      storeKey: tenant.tenantApiKey,
      storeName: tenant.commerceName,
      modules,
      customDomain: tenant.customDomain || undefined,
      image: effectiveImage,
    });

    // Mettre à jour l'état du déploiement
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        k8sStatus: provisionResult.success ? 'ACTIVE' : 'FAILED',
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({
      ...updatedTenant,
      modules: JSON.parse(updatedTenant.modules || '[]'),
      provisionResult,
    }, { status: 201 });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
