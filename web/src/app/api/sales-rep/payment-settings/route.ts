import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function maskSecret(secret?: string | null): string {
  if (!secret) return '';
  if (secret.length <= 8) return '••••••••';
  return `${secret.slice(0, 7)}••••••••${secret.slice(-4)}`;
}

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
        stripePublishableKey: true,
        stripeSecretKey: true,
        stripeWebhookSecret: true,
        stripeConnectStatus: true,
        bankIban: true,
        bankBic: true,
        bankAccountHolder: true,
        defaultCommissionRate: true,
        woxxpayLiveMode: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      stripeAccountId: currentUser.stripeAccountId || '',
      stripePublishableKey: currentUser.stripePublishableKey || '',
      hasStripeSecretKey: !!currentUser.stripeSecretKey,
      maskedStripeSecretKey: maskSecret(currentUser.stripeSecretKey),
      hasStripeWebhookSecret: !!currentUser.stripeWebhookSecret,
      maskedStripeWebhookSecret: maskSecret(currentUser.stripeWebhookSecret),
      stripeConnectStatus: currentUser.stripeConnectStatus || 'NOT_CONNECTED',
      bankIban: currentUser.bankIban || '',
      bankBic: currentUser.bankBic || '',
      bankAccountHolder: currentUser.bankAccountHolder || '',
      defaultCommissionRate: currentUser.defaultCommissionRate ?? 10.0,
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
      stripePublishableKey,
      stripeSecretKey,
      stripeWebhookSecret,
      stripeConnectStatus,
      bankIban,
      bankBic,
      bankAccountHolder,
      defaultCommissionRate,
      woxxpayLiveMode,
    } = body;

    const updateData: any = {};

    if (stripeAccountId !== undefined) updateData.stripeAccountId = stripeAccountId ? String(stripeAccountId).trim() : null;
    if (stripePublishableKey !== undefined) updateData.stripePublishableKey = stripePublishableKey ? String(stripePublishableKey).trim() : null;
    
    // N'écraser la clé secrète que si une nouvelle valeur réelle est fournie (non masquée)
    if (stripeSecretKey && !stripeSecretKey.includes('••••')) {
      updateData.stripeSecretKey = String(stripeSecretKey).trim();
    } else if (stripeSecretKey === '') {
      updateData.stripeSecretKey = null;
    }

    if (stripeWebhookSecret && !stripeWebhookSecret.includes('••••')) {
      updateData.stripeWebhookSecret = String(stripeWebhookSecret).trim();
    } else if (stripeWebhookSecret === '') {
      updateData.stripeWebhookSecret = null;
    }

    if (stripeConnectStatus !== undefined) updateData.stripeConnectStatus = stripeConnectStatus;
    if (bankIban !== undefined) updateData.bankIban = bankIban ? String(bankIban).trim() : null;
    if (bankBic !== undefined) updateData.bankBic = bankBic ? String(bankBic).trim() : null;
    if (bankAccountHolder !== undefined) updateData.bankAccountHolder = bankAccountHolder ? String(bankAccountHolder).trim() : null;
    if (defaultCommissionRate !== undefined) updateData.defaultCommissionRate = Number(defaultCommissionRate) || 0;
    if (woxxpayLiveMode !== undefined) updateData.woxxpayLiveMode = Boolean(woxxpayLiveMode);

    // Si des clés valides sont renseignées, passer le statut Connect à CONNECTED si non renseigné
    if (updateData.stripePublishableKey && (updateData.stripeSecretKey || body.hasExistingSecret)) {
      if (!updateData.stripeConnectStatus || updateData.stripeConnectStatus === 'NOT_CONNECTED') {
        updateData.stripeConnectStatus = 'CONNECTED';
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Paramètres Stripe & WoxxPay mis à jour avec succès',
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
