import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { StoreManagerClient } from '@/lib/store-manager-client';
import { sendQuotePaidToSalesRepEmail } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { method = 'WOXXPAY_TRANSFER', confirmReceived = false } = body;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        client: true,
        salesRep: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ detail: 'Devis introuvable.' }, { status: 404 });
    }

    if (user.role === 'CHARGE_DAFFAIRE' && quote.salesRepId !== user.id) {
      return NextResponse.json(
        { detail: 'Accès non autorisé à ce devis.' },
        { status: 403 }
      );
    }

    const commissions = {
      platformCommissionRate: 20.0,
      platformCommissionAmount: Math.round(quote.totalTtc * 0.20 * 100) / 100,
      salesRepPayoutAmount: Math.round(quote.totalTtc * 0.80 * 100) / 100,
    };

    const bankIban = quote.salesRep?.bankIban || 'FR76 3000 4012 3456 7890 1234 567';
    const bankBic = quote.salesRep?.bankBic || 'BNPAFRPP';
    const paymentReference = `WOXX-${quote.quoteNumber}`;

    // Si on confirme la réception du virement ou du paiement CB
    if (confirmReceived) {
      const now = new Date();

      // 1. Mettre à jour le devis en PAID avec commissions
      const updatedQuote = await prisma.quote.update({
        where: { id: quote.id },
        data: {
          status: 'PAID',
          paymentMethod: method as any,
          woxxpayPaymentId: `WXP-${Date.now()}`,
          platformCommissionRate: commissions.platformCommissionRate,
          platformCommissionAmount: commissions.platformCommissionAmount,
          salesRepPayoutAmount: commissions.salesRepPayoutAmount,
          stripeTransferId: quote.salesRep?.stripeAccountId ? `tr_stripe_${Date.now()}` : null,
          paidAt: now,
          acceptedAt: quote.acceptedAt || now,
        },
      });

      // 2. Générer automatiquement une Facture acquittée (Invoice)
      const invoiceNumber = `FAC-${quote.quoteNumber.replace('DEV-', '')}`;
      await prisma.invoice.upsert({
        where: { invoiceNumber },
        update: {
          status: 'PAID',
          totalHt: quote.totalHt,
          totalVat: quote.totalVat,
          totalTtc: quote.totalTtc,
        },
        create: {
          invoiceNumber,
          userId: quote.clientId,
          totalHt: quote.totalHt,
          totalVat: quote.totalVat,
          totalTtc: quote.totalTtc,
          vatRate: 20.0,
          status: 'PAID',
          legalNotice: `Facture acquittée pour devis ${quote.quoteNumber} via WoxxPay (${method}).`,
        },
      });

      // 3. Notification par email au Chargé d'Affaires avec rappel du délai d'exécution
      if (quote.salesRep?.email) {
        sendQuotePaidToSalesRepEmail({
          salesRepEmail: quote.salesRep.email,
          salesRepName: quote.salesRep.fullName || undefined,
          clientName: quote.client?.fullName || undefined,
          clientEmail: quote.client?.email || 'client@woxxapp.de',
          quoteNumber: quote.quoteNumber,
          quoteTitle: quote.title,
          totalTtc: quote.totalTtc,
          paymentMethod: method,
        }).catch((err) => console.error('Erreur email notif CA:', err));
      }

      // 4. Si une boutique liée était en attente (PENDING), la provisionner et l'activer
      if (quote.tenantId) {
        const tenant = await prisma.tenant.findUnique({
          where: { id: quote.tenantId },
        });

        if (tenant && tenant.status !== 'ACTIVE') {
          const modules: string[] = JSON.parse(tenant.modules || '[]');
          await StoreManagerClient.provisionStore({
            storeId: tenant.id,
            subdomain: tenant.subdomain,
            storeKey: tenant.tenantApiKey,
            storeName: tenant.commerceName,
            modules,
            customDomain: tenant.customDomain || undefined,
          });

          await prisma.tenant.update({
            where: { id: tenant.id },
            data: {
              status: 'ACTIVE',
              k8sStatus: 'ACTIVE',
            },
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Paiement du devis ${quote.quoteNumber} validé avec succès par WoxxPay.`,
        quote: {
          ...updatedQuote,
          items: JSON.parse(updatedQuote.items || '[]'),
        },
      });
    }

    // Sinon, générer et renvoyer les coordonnées bancaires de virement
    const updatedQuote = await prisma.quote.update({
      where: { id: quote.id },
      data: {
        paymentMethod: method as any,
        status: quote.status === 'DRAFT' ? 'SENT' : quote.status,
        bankDetails: JSON.stringify({
          iban: bankIban,
          bic: bankBic,
          beneficiary: 'WoxxApp SAS (WoxxPay)',
          amount: quote.totalTtc,
          reference: paymentReference,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      paymentMethod: method,
      transferDetails: {
        iban: bankIban,
        bic: bankBic,
        beneficiary: 'WoxxApp SAS (WoxxPay Services)',
        amount: quote.totalTtc,
        reference: paymentReference,
        qrCodePayload: `BCD\n001\n1\nSCT\n${bankBic}\nWoxxApp SAS\n${bankIban.replace(/\s/g, '')}\nEUR${quote.totalTtc.toFixed(2)}\n\n\n${paymentReference}`,
      },
      quote: {
        ...updatedQuote,
        items: JSON.parse(updatedQuote.items || '[]'),
      },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
