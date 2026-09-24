import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { generateOfficialInvoiceHtml, OfficialInvoiceDocument } from '@/lib/official-invoicing';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ id }, { invoiceNumber: id }],
      },
      include: {
        user: true,
        subscription: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 });
    }

    // Sécurité : ADMIN, propriétaire de la facture ou Chargé d'Affaires assigné
    if (user.role !== 'ADMIN' && invoice.userId !== user.id) {
      const isAssignedSalesRep = await prisma.user.findFirst({
        where: {
          id: invoice.userId,
          assignedSalesRepId: user.id,
        },
      });

      if (!isAssignedSalesRep) {
        return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
      }
    }

    // Récupération des paramètres émetteur de l'entreprise
    const settings = await prisma.systemSettings.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    const taxType = settingsMap.company_tax_type || 'MICRO_ENTERPRISE';
    const isMicro = taxType === 'MICRO_ENTERPRISE';

    const doc: OfficialInvoiceDocument = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      createdAt: invoice.createdAt,
      status: invoice.status,
      totalHt: invoice.totalHt,
      totalVat: invoice.totalVat,
      totalTtc: invoice.totalTtc,
      vatRate: invoice.vatRate,
      isVatExempt: invoice.isVatExempt,
      legalNotice: invoice.legalNotice || undefined,
      seller: {
        companyName: settingsMap.company_name || 'WoxxApp',
        legalForm: settingsMap.company_legal_form || (isMicro ? 'Micro-Entreprise' : 'SAS'),
        capital: settingsMap.company_capital || undefined,
        siren: settingsMap.company_siren || (settingsMap.company_siret ? settingsMap.company_siret.slice(0, 9) : '—'),
        siret: settingsMap.company_siret || '—',
        rcsCity: settingsMap.company_rcs_city || 'Paris',
        nafCode: settingsMap.company_naf_code || '6201Z',
        vatNumber: settingsMap.company_vat_number || undefined,
        address: settingsMap.company_address || '123 Avenue des Champs-Élysées',
        zip: settingsMap.company_zip || '75008',
        city: settingsMap.company_city || 'Paris',
        country: settingsMap.company_country || 'France',
        email: settingsMap.company_email || 'contact@woxxapp.de',
        phone: settingsMap.company_phone || undefined,
        isAutoEntrepreneur: isMicro,
        legalNotice: settingsMap.company_legal_notice,
      },
      buyer: {
        fullName: invoice.user?.fullName || invoice.user?.companyName || 'Client WoxxApp',
        companyName: invoice.user?.companyName || undefined,
        email: invoice.user?.email || '',
        phoneNumber: invoice.user?.phoneNumber || undefined,
      },
      items: [
        {
          description: invoice.legalNotice || `Abonnement SaaS WoxxApp (${invoice.subscription?.billingCycle === 'yearly' ? 'Annuel' : 'Mensuel'}) & Activation Modules`,
          quantity: 1,
          unitPriceHt: invoice.totalHt,
          totalHt: invoice.totalHt,
          vatRate: invoice.vatRate,
        },
      ],
    };

    const html = generateOfficialInvoiceHtml(doc);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${invoice.invoiceNumber}.html"`,
      },
    });
  } catch (error: any) {
    console.error('Erreur GET /api/invoices/[id]:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
