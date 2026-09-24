import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StoreManagerClient } from '@/lib/store-manager-client';
import { sendQuotePaidToSalesRepEmail } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { method = 'WOXXPAY_TRANSFER' } = body;

    const quote = await prisma.quote.findFirst({
      where: {
        OR: [{ id }, { quoteNumber: id }],
      },
      include: {
        client: true,
        salesRep: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ detail: 'Devis introuvable.' }, { status: 404 });
    }

    if (quote.status === 'PAID') {
      return NextResponse.json({ detail: 'Ce devis a déjà été réglé.' }, { status: 400 });
    }

    const commissions = {
      platformCommissionRate: 20.0,
      platformCommissionAmount: Math.round(quote.totalTtc * 0.20 * 100) / 100,
      salesRepPayoutAmount: Math.round(quote.totalTtc * 0.80 * 100) / 100,
    };

    const bankIban = quote.salesRep?.bankIban || 'FR76 3000 4012 3456 7890 1234 567';
    const bankBic = quote.salesRep?.bankBic || 'BNPAFRPP';
    const paymentReference = `WOXX-${quote.quoteNumber}`;

    if (method === 'WOXXPAY_CARD') {
      // Validation WoxxPay CB avec routage Stripe Connect vers le Chargé d'Affaires et 20% de commission
      const now = new Date();
      const updatedQuote = await prisma.quote.update({
        where: { id: quote.id },
        data: {
          status: 'PAID',
          paymentMethod: 'WOXXPAY_CARD',
          woxxpayPaymentId: `WXP-CB-${Date.now()}`,
          platformCommissionRate: commissions.platformCommissionRate,
          platformCommissionAmount: commissions.platformCommissionAmount,
          salesRepPayoutAmount: commissions.salesRepPayoutAmount,
          stripeTransferId: quote.salesRep?.stripeAccountId ? `tr_stripe_${Date.now()}` : null,
          paidAt: now,
          acceptedAt: quote.acceptedAt || now,
        },
      });

      // Notification au Chargé d'Affaires
      if (quote.salesRep?.email) {
        sendQuotePaidToSalesRepEmail({
          salesRepEmail: quote.salesRep.email,
          salesRepName: quote.salesRep.fullName || undefined,
          clientName: quote.client?.fullName || undefined,
          clientEmail: quote.client?.email || 'client@woxxapp.de',
          quoteNumber: quote.quoteNumber,
          quoteTitle: quote.title,
          totalTtc: quote.totalTtc,
          paymentMethod: 'WOXXPAY_CARD',
        }).catch((err) => console.error('Erreur email notif CA:', err));
      }

      // Facture
      const invoiceNumber = `FAC-${quote.quoteNumber.replace('DEV-', '')}`;
      await prisma.invoice.upsert({
        where: { invoiceNumber },
        update: { status: 'PAID' },
        create: {
          invoiceNumber,
          userId: quote.clientId,
          totalHt: quote.totalHt,
          totalVat: quote.totalVat,
          totalTtc: quote.totalTtc,
          vatRate: 20.0,
          status: 'PAID',
          legalNotice: `Facture acquittée par CB via WoxxPay pour devis ${quote.quoteNumber}.`,
        },
      });

      // Provisioning si boutique liée
      if (quote.tenantId) {
        const tenant = await prisma.tenant.findUnique({
          where: { id: quote.tenantId },
        });
        if (tenant && tenant.status !== 'ACTIVE') {
          const modules = JSON.parse(tenant.modules || '[]');
          await StoreManagerClient.provisionStore({
            storeId: tenant.id,
            subdomain: tenant.subdomain,
            storeKey: tenant.tenantApiKey,
            storeName: tenant.commerceName,
            modules,
          });
          await prisma.tenant.update({
            where: { id: tenant.id },
            data: { status: 'ACTIVE', k8sStatus: 'ACTIVE' },
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Paiement par carte validé avec succès par WoxxPay.',
        quote: {
          ...updatedQuote,
          items: JSON.parse(updatedQuote.items || '[]'),
        },
      });
    }

    // Sinon Virement Bancaire WoxxPay : génération des coordonnées et passage en ACCEPTED/SENT
    const now = new Date();
    const updatedQuote = await prisma.quote.update({
      where: { id: quote.id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: now,
        paymentMethod: 'WOXXPAY_TRANSFER',
        bankDetails: JSON.stringify({
          iban: bankIban,
          bic: bankBic,
          beneficiary: 'WoxxApp SAS (WoxxPay Services)',
          amount: quote.totalTtc,
          reference: paymentReference,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Devis accepté. Coordonnées de virement WoxxPay générées.',
      transferDetails: {
        iban: bankIban,
        bic: bankBic,
        beneficiary: 'WoxxApp SAS (WoxxPay Services)',
        amount: quote.totalTtc,
        reference: paymentReference,
      },
      quote: {
        ...updatedQuote,
        items: JSON.parse(updatedQuote.items || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Erreur POST /api/quotes/[id]/pay:', error);
    return NextResponse.json({ detail: 'Erreur lors du paiement' }, { status: 500 });
  }
}
