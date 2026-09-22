import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { StoreManagerClient } from '@/lib/store-manager-client';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const operator = await requireRole(['ADMIN', 'CHARGE_DAFFAIRE'], req);
    const { id } = await params;
    const body = await req.json();
    const {
      adminEmail,
      adminPassword,
      managerEmail,
      managerPassword,
      resetTotp = false,
      assignedSalesRepId,
    } = body;

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id },
          { subdomain: id },
        ],
      },
      include: {
        user: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ detail: 'Boutique introuvable' }, { status: 404 });
    }

    // Contrôle d'accès pour les Chargés d'Affaires
    if (operator.role === 'CHARGE_DAFFAIRE') {
      if (tenant.user.assignedSalesRepId !== operator.id) {
        return NextResponse.json(
          { detail: 'Accès non autorisé : cette boutique n’est pas assignée à votre portefeuille.' },
          { status: 403 }
        );
      }
      // Un chargé d'affaires ne peut pas modifier le compte ADMIN, seulement le compte GÉRANT
      if (adminPassword || adminEmail) {
        return NextResponse.json(
          { detail: 'Un chargé d’affaires ne peut modifier que le compte gérant du commerçant.' },
          { status: 403 }
        );
      }
    }

    // 1. Mise à jour de l'affectation Chargé d'Affaires dans PostgreSQL
    if (assignedSalesRepId !== undefined && operator.role === 'ADMIN') {
      await prisma.user.update({
        where: { id: tenant.userId },
        data: {
          assignedSalesRepId: assignedSalesRepId || null,
        },
      });
    }

    // 2. Synchronisation des identifiants vers la boutique via Store Manager
    const syncResult = await StoreManagerClient.updateStoreCredentials(tenant.subdomain, {
      adminEmail,
      adminPassword,
      managerEmail: managerEmail || tenant.email,
      managerPassword,
      resetTotp,
    });

    return NextResponse.json({
      success: syncResult.success,
      message: syncResult.message || 'Mise à jour des identifiants effectuée',
      syncResult,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
