import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quote = await prisma.quote.findFirst({
      where: {
        OR: [{ id }, { quoteNumber: id }],
      },
      include: {
        client: {
          select: { id: true, email: true, fullName: true },
        },
        salesRep: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
            companyName: true,
            phoneNumber: true,
            whatsappNumber: true,
            calendlyUrl: true,
            bio: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ detail: 'Devis introuvable.' }, { status: 404 });
    }

    // Récupérer les paramètres fiscaux du chargé d'affaires
    let taxSettings: any = null;
    if (quote.salesRepId) {
      const taxKey = `salesrep_${quote.salesRepId}_tax_settings`;
      const s = await prisma.systemSettings.findUnique({ where: { key: taxKey } });
      if (s?.value) {
        try {
          taxSettings = JSON.parse(s.value);
        } catch (e) {
          console.error('Erreur parsing tax settings devis:', e);
        }
      }
    }

    return NextResponse.json({
      ...quote,
      items: JSON.parse(quote.items || '[]'),
      bankDetails: quote.bankDetails ? JSON.parse(quote.bankDetails) : null,
      salesRep: {
        ...quote.salesRep,
        companyName: taxSettings?.companyName || quote.salesRep?.companyName || 'Conseiller WoxxApp',
        siret: taxSettings?.siret || '',
        vatNumber: taxSettings?.vatNumber || '',
        companyAddress: taxSettings?.companyAddress || '',
        companyEmail: taxSettings?.companyEmail || quote.salesRep?.email || '',
        taxType: taxSettings?.taxType || 'MICRO_ENTERPRISE',
        legalNotice: taxSettings?.legalNotice || 'Franchise en base de TVA, art. 293 B du CGI',
        vatRate: taxSettings?.vatRate || '20.0',
      },
    });
  } catch (error: any) {
    console.error('Erreur GET /api/quotes/[id]:', error);
    return NextResponse.json({ detail: 'Erreur serveur.' }, { status: 500 });
  }
}

