import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        stripeAccountId: true,
        stripeConnectStatus: true,
        defaultCommissionRate: true,
        woxxpayLiveMode: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      stripeAccountId: currentUser.stripeAccountId || '',
      stripeConnectStatus: currentUser.stripeConnectStatus || 'NOT_CONNECTED',
      defaultCommissionRate: currentUser.defaultCommissionRate ?? 20.0,
      woxxpayLiveMode: !!currentUser.woxxpayLiveMode,
    });
  } catch (error: any) {
    console.error('Erreur GET payment-settings:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération des paramètres de paiement' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);
    const body = await req.json();

    const {
      stripeAccountId,
      stripeConnectStatus,
      defaultCommissionRate,
      woxxpayLiveMode,
    } = body;

    const updateData: any = {};

    if (stripeAccountId !== undefined) updateData.stripeAccountId = stripeAccountId ? String(stripeAccountId).trim() : null;
    if (stripeConnectStatus !== undefined) updateData.stripeConnectStatus = stripeConnectStatus;
    if (defaultCommissionRate !== undefined) updateData.defaultCommissionRate = Number(defaultCommissionRate) || 20.0;
    if (woxxpayLiveMode !== undefined) updateData.woxxpayLiveMode = Boolean(woxxpayLiveMode);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Paramètres Stripe Connect mis à jour avec succès',
      stripeConnectStatus: updatedUser.stripeConnectStatus,
    });
  } catch (error: any) {
    console.error('Erreur POST payment-settings:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l’enregistrement des paramètres' },
      { status: error.status || 500 }
    );
  }
}

