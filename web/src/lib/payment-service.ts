import crypto from 'crypto';
import { prisma } from './prisma';

export interface CommissionBreakdown {
  totalTtc: number;
  platformCommissionRate: number; // 20.0%
  platformCommissionAmount: number; // Ex: 200.00 € sur 1000 €
  salesRepPayoutAmount: number; // Ex: 800.00 € sur 1000 €
}

/**
 * Calcule la répartition financière d'un devis :
 * - 20% pour la plateforme (Toi / WoxxApp SAS)
 * - 80% pour le Chargé d'Affaires
 */
export function computeQuoteCommissions(
  totalTtc: number,
  customRate?: number | null
): CommissionBreakdown {
  const platformCommissionRate = typeof customRate === 'number' && customRate >= 0 ? customRate : 20.0;
  const platformCommissionAmount = Math.round(totalTtc * (platformCommissionRate / 100) * 100) / 100;
  const salesRepPayoutAmount = Math.round((totalTtc - platformCommissionAmount) * 100) / 100;

  return {
    totalTtc,
    platformCommissionRate,
    platformCommissionAmount,
    salesRepPayoutAmount,
  };
}

/**
 * Crée ou simule une session de paiement WoxxPay / Stripe pour un devis :
 * - Si devis avec Chargé d'Affaires : Route le paiement vers son compte Stripe Connect (80%) avec 20% d'application_fee plateforme.
 * - Si achat de module / boutique direct : 100% encaissé sur le compte plateforme.
 */
export async function createQuoteWoxxPaySession(params: {
  quoteId: string;
  quoteNumber: string;
  title: string;
  totalTtc: number;
  clientEmail: string;
  clientName?: string;
  salesRepId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const salesRep = await prisma.user.findUnique({
    where: { id: params.salesRepId },
    select: {
      id: true,
      email: true,
      fullName: true,
      stripeAccountId: true,
      stripeConnectStatus: true,
      bankIban: true,
      bankBic: true,
      bankAccountHolder: true,
    },
  });

  const commissions = computeQuoteCommissions(params.totalTtc, 20.0);

  // Enregistrement des montants calculés sur le devis
  await prisma.quote.update({
    where: { id: params.quoteId },
    data: {
      platformCommissionRate: commissions.platformCommissionRate,
      platformCommissionAmount: commissions.platformCommissionAmount,
      salesRepPayoutAmount: commissions.salesRepPayoutAmount,
    },
  });

  const isConnectedAccount = !!salesRep?.stripeAccountId && salesRep.stripeConnectStatus === 'CONNECTED';

  return {
    success: true,
    paymentUrl: `${params.successUrl}&payment_session=wxp_${Date.now()}`,
    commissions,
    stripeDestination: isConnectedAccount ? salesRep.stripeAccountId : 'woxx_platform_escrow',
    salesRepName: salesRep?.fullName || salesRep?.email,
    salesRepIban: salesRep?.bankIban,
  };
}
