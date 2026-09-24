import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { StoreManagerClient } from '@/lib/store-manager-client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ detail: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer les boutiques appartenant à cet utilisateur (ou toutes si ADMIN)
    const where = user.role === 'ADMIN' ? {} : { userId: user.id };

    const tenants = await prisma.tenant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formattedTenants = tenants.map((t) => ({
      ...t,
      modules: JSON.parse(t.modules || '[]'),
    }));

    return NextResponse.json(formattedTenants);
  } catch (error: any) {
    console.error('Erreur GET /api/tenants:', error);
    return NextResponse.json(
      { detail: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ detail: 'Non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const { commerceName, subdomain, modules = [], customDomain } = body;

    if (!commerceName || !subdomain) {
      return NextResponse.json(
        { detail: 'Le nom du commerce et le sous-domaine sont requis.' },
        { status: 400 }
      );
    }

    const cleanSubdomain = subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    if (cleanSubdomain.length < 3) {
      return NextResponse.json(
        { detail: 'Le sous-domaine doit contenir au moins 3 caractères.' },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du sous-domaine
    const existing = await prisma.tenant.findUnique({
      where: { subdomain: cleanSubdomain },
    });

    if (existing) {
      return NextResponse.json(
        { detail: `Le sous-domaine '${cleanSubdomain}' est déjà utilisé.` },
        { status: 409 }
      );
    }

    // Récupérer l'image par défaut
    const defaultSetting = await prisma.systemSettings.findUnique({
      where: { key: 'boutique_default_image_tag' },
    });
    const effectiveImage = defaultSetting?.value || 'ghcr.io/bezbee25/boutique-global:latest';

    // Créer la boutique associée à l'utilisateur connecté
    const tenant = await prisma.tenant.create({
      data: {
        userId: user.id,
        email: user.email,
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

    // Déclencher le déploiement Kubernetes via Store Manager
    const provisionResult = await StoreManagerClient.provisionStore({
      storeId: tenant.id,
      subdomain: cleanSubdomain,
      storeKey: tenant.tenantApiKey,
      storeName: tenant.commerceName,
      modules,
      customDomain: tenant.customDomain || undefined,
      image: effectiveImage,
    });

    // Mettre à jour l'état k8s en base
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        k8sStatus: provisionResult.success ? 'ACTIVE' : 'FAILED',
      },
    });

    return NextResponse.json(
      {
        ...updatedTenant,
        modules: JSON.parse(updatedTenant.modules || '[]'),
        provisionResult,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur POST /api/tenants:', error);
    return NextResponse.json(
      { detail: error.message || 'Erreur lors de la création de la boutique' },
      { status: 500 }
    );
  }
}
