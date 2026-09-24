import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { StoreManagerClient } from '@/lib/store-manager-client';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ detail: 'Non authentifié' }, { status: 401 });
    }

    const { tenantId } = await params;

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [{ id: tenantId }, { subdomain: tenantId }],
      },
    });

    if (!tenant) {
      return NextResponse.json({ detail: 'Boutique introuvable' }, { status: 404 });
    }

    // Vérifier les droits du client
    if (user.role !== 'ADMIN' && tenant.userId !== user.id) {
      return NextResponse.json(
        { detail: 'Accès non autorisé à cette boutique' },
        { status: 403 }
      );
    }

    const requestedRole = user.role === 'ADMIN' ? 'ADMIN' : 'MANAGER';
    const ssoData = await StoreManagerClient.generateSsoToken(
      tenant.subdomain,
      requestedRole,
      user.email,
      user.fullName || user.email
    );

    if (!ssoData) {
      return NextResponse.json(
        { detail: 'Impossible de générer le jeton SSO auprès du Store Manager' },
        { status: 500 }
      );
    }

    const hostHeader = req.headers.get('host') || '';
    const isLocal =
      hostHeader.includes('127.0.0.1') ||
      hostHeader.includes('localhost') ||
      hostHeader.includes('nip.io');
    const effectiveSsoUrl = isLocal ? ssoData.local_sso_url : ssoData.cloud_sso_url;

    return NextResponse.json({
      success: true,
      ssoUrl: effectiveSsoUrl,
      localSsoUrl: ssoData.local_sso_url,
      cloudSsoUrl: ssoData.cloud_sso_url,
      token: ssoData.token,
    });
  } catch (error: any) {
    console.error('Erreur SSO client:', error);
    return NextResponse.json(
      { detail: error.message || 'Erreur lors de la génération SSO' },
      { status: 500 }
    );
  }
}
