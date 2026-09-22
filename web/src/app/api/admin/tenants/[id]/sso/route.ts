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

    // Si l'opérateur est un CHARGE_DAFFAIRE, il ne peut accéder qu'aux boutiques de son portefeuille
    if (operator.role === 'CHARGE_DAFFAIRE') {
      if (tenant.user.assignedSalesRepId !== operator.id) {
        return NextResponse.json(
          { detail: 'Accès non autorisé : cette boutique n’est pas assignée à votre portefeuille.' },
          { status: 403 }
        );
      }
    }

    const requestedRole = operator.role === 'ADMIN' ? 'ADMIN' : 'MANAGER';
    const ssoData = await StoreManagerClient.generateSsoToken(
      tenant.subdomain,
      requestedRole,
      operator.email,
      operator.email
    );

    if (!ssoData) {
      return NextResponse.json(
        { detail: 'Impossible de générer le jeton SSO auprès du Store Manager' },
        { status: 500 }
      );
    }

    // Détection de l'environnement (Local KinD vs Cloud)
    const hostHeader = req.headers.get('host') || '';
    const isLocal = hostHeader.includes('127.0.0.1') || hostHeader.includes('localhost') || hostHeader.includes('nip.io');
    const effectiveSsoUrl = isLocal ? ssoData.local_sso_url : ssoData.cloud_sso_url;

    return NextResponse.json({
      success: true,
      ssoUrl: effectiveSsoUrl,
      localSsoUrl: ssoData.local_sso_url,
      cloudSsoUrl: ssoData.cloud_sso_url,
      token: ssoData.token,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
