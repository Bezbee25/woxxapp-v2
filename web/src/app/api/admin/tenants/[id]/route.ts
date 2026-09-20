import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { TenantStatus } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['ADMIN'], req);
    const { id } = await params;
    const body = await req.json();
    const { status, customCommissionPercent, modules, customDomain, imageTag, redeploy } = body;

    const data: any = {};
    if (status && ['PENDING', 'ACTIVE', 'SUSPENDED'].includes(status)) {
      data.status = status as TenantStatus;
    }
    if (customCommissionPercent !== undefined) {
      data.customCommissionPercent = customCommissionPercent === null ? null : Number(customCommissionPercent);
    }
    if (modules !== undefined) {
      data.modules = Array.isArray(modules) ? JSON.stringify(modules) : modules;
    }
    if (customDomain !== undefined) {
      data.customDomain = customDomain ? customDomain.trim().toLowerCase() : null;
    }
    if (imageTag !== undefined) {
      data.imageTag = imageTag.trim();
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data,
    });

    // Si les modules sont modifiés ou qu'un redéploiement / changement d'image est demandé
    const parsedModules = JSON.parse(updated.modules || '[]');
    const { StoreManagerClient } = await import('@/lib/store-manager-client');

    if (modules !== undefined) {
      await StoreManagerClient.updateModules(updated.subdomain || updated.id, parsedModules);
    }

    if (redeploy || imageTag !== undefined) {
      await StoreManagerClient.provisionStore({
        storeId: updated.id,
        subdomain: updated.subdomain,
        storeKey: updated.tenantApiKey,
        storeName: updated.commerceName,
        modules: parsedModules,
        customDomain: updated.customDomain || undefined,
        image: updated.imageTag || undefined,
      });
    }

    return NextResponse.json({
      ...updated,
      modules: parsedModules,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['ADMIN'], req);
    const { id } = await params;

    await prisma.tenant.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Tenant supprimé avec succès' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
