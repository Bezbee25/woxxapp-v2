import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StoreManagerClient } from '@/lib/store-manager-client';
import { getAuthenticatedUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function handleUpdateModules(
  req: NextRequest,
  params: Promise<{ tenantId: string }>
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { tenantId } = await params;
    const body = await req.json();
    const { modules } = body;

    if (!Array.isArray(modules)) {
      return NextResponse.json(
        { error: 'modules doit être un tableau de chaînes' },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [{ id: tenantId }, { subdomain: tenantId }],
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && tenant.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé à cette boutique' },
        { status: 403 }
      );
    }

    // 1. Mise à jour dans la base WoxxApp
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        modules: JSON.stringify(modules),
      },
    });

    // 2. Synchronisation avec l'API Pivot K8s (Store Manager)
    await StoreManagerClient.updateModules(tenant.id, modules);

    return NextResponse.json({
      success: true,
      modules,
      tenant: updatedTenant,
    });
  } catch (error: any) {
    console.error('Erreur mise à jour modules:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  return handleUpdateModules(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  return handleUpdateModules(req, params);
}
