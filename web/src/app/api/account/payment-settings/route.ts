import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        stripeAccountId: true,
        stripeConnectStatus: true,
        woxxpayLiveMode: true,
        tenants: {
          select: {
            id: true,
            commerceName: true,
            subdomain: true,
            status: true,
            k8sStatus: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      stripeAccountId: currentUser.stripeAccountId || '',
      stripeConnectStatus: currentUser.stripeConnectStatus || 'NOT_CONNECTED',
      woxxpayLiveMode: !!currentUser.woxxpayLiveMode,
      tenants: currentUser.tenants || [],
    });
  } catch (error: any) {
    console.error('Erreur GET /api/account/payment-settings:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const { stripeAccountId, stripeConnectStatus, woxxpayLiveMode } = body;

    const updateData: any = {};
    if (stripeAccountId !== undefined) {
      updateData.stripeAccountId = stripeAccountId ? String(stripeAccountId).trim() : null;
    }
    if (stripeConnectStatus !== undefined) {
      updateData.stripeConnectStatus = stripeConnectStatus;
    }
    if (woxxpayLiveMode !== undefined) {
      updateData.woxxpayLiveMode = Boolean(woxxpayLiveMode);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        stripeAccountId: true,
        stripeConnectStatus: true,
        woxxpayLiveMode: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Paramètres Stripe mis à jour avec succès.',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Erreur POST /api/account/payment-settings:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}
