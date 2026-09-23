import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StoreManagerClient } from '@/lib/store-manager-client';
import { requireRole } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    // Seul un ADMIN ou un flux système validé peut modifier les modules d'une boutique
    await requireRole(['ADMIN'], req);

    const { tenantId } = await params;
    const body = await req.json();
    const { modules } = body;

    if (!Array.isArray(modules)) {
      return NextResponse.json({ error: 'modules doit être un tableau de chaînes' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });
    }

    // 1. Mise à jour dans la base WoxxAPP
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        modules: JSON.stringify(modules),
      },
    });

    // 2. Synchronisation avec l'API Pivot K8s
    await StoreManagerClient.updateModules(tenant.id, modules);

    return NextResponse.json({
      success: true,
      modules,
      tenant: updatedTenant,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status });
  }
}
