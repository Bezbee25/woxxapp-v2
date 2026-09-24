import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { sendQuoteToClientEmail } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

interface QuoteItemInput {
  description: string;
  quantity: number;
  unitPriceHt: number;
  vatRate?: number;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);

    const where: any = {};
    if (user.role === 'CHARGE_DAFFAIRE') {
      where.salesRepId = user.id;
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    if (statusParam && ['DRAFT', 'SENT', 'ACCEPTED', 'PAID', 'REJECTED'].includes(statusParam.toUpperCase())) {
      where.status = statusParam.toUpperCase();
    }
    if (clientId) {
      where.clientId = clientId;
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            email: true,
            fullName: true,
            tenants: {
              select: { id: true, commerceName: true, subdomain: true, status: true },
            },
          },
        },
        salesRep: {
          select: { id: true, email: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      quotes.map((q) => ({
        ...q,
        items: JSON.parse(q.items || '[]'),
      }))
    );
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);
    const body = await req.json();
    const {
      clientId,
      title,
      description,
      tenantId,
      items = [],
      validityDays = 30,
      status = 'DRAFT',
    } = body;

    if (!clientId || !title || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { detail: 'Le client, le titre et au moins une ligne d’article sont obligatoires.' },
        { status: 400 }
      );
    }

    // Vérifier que le client existe
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ detail: 'Client introuvable.' }, { status: 404 });
    }

    // Calcul des montants HT, TVA et TTC
    let totalHt = 0;
    let totalVat = 0;

    const formattedItems = items.map((item: QuoteItemInput) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitHt = Math.max(0, Number(item.unitPriceHt) || 0);
      const vatRate = item.vatRate !== undefined ? Number(item.vatRate) : 20.0;
      const lineHt = qty * unitHt;
      const lineVat = lineHt * (vatRate / 100);
      const lineTtc = lineHt + lineVat;

      totalHt += lineHt;
      totalVat += lineVat;

      return {
        description: item.description || 'Prestation / Module',
        quantity: qty,
        unitPriceHt: unitHt,
        vatRate,
        totalHt: Number(lineHt.toFixed(2)),
        totalTtc: Number(lineTtc.toFixed(2)),
      };
    });

    const totalTtc = totalHt + totalVat;

    // Numéro séquentiel de devis
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const quoteCount = await prisma.quote.count();
    const quoteNumber = `DEV-${yearMonth}-${String(quoteCount + 1).padStart(4, '0')}`;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Number(validityDays || 30));

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        title: title.trim(),
        description: description?.trim() || null,
        salesRepId: user.id,
        clientId: client.id,
        tenantId: tenantId || null,
        items: JSON.stringify(formattedItems),
        totalHt: Number(totalHt.toFixed(2)),
        totalVat: Number(totalVat.toFixed(2)),
        totalTtc: Number(totalTtc.toFixed(2)),
        status: status === 'SENT' ? 'SENT' : 'DRAFT',
        validUntil,
      },
      include: {
        client: {
          select: { id: true, email: true, fullName: true },
        },
        salesRep: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });

    // Envoi de l'email au client avec le lien de paiement direct
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    const paymentUrl = `${proto}://${host}/quotes/${quote.id}`;

    if (quote.status === 'SENT') {
      sendQuoteToClientEmail({
        clientEmail: client.email,
        clientName: client.fullName || undefined,
        salesRepName: user.fullName || user.email,
        salesRepEmail: user.email,
        quoteNumber: quote.quoteNumber,
        quoteTitle: quote.title,
        totalTtc: quote.totalTtc,
        validUntil: quote.validUntil,
        paymentUrl,
      }).catch((err) => console.error('Erreur envoi email devis:', err));
    }

    return NextResponse.json(
      {
        ...quote,
        items: JSON.parse(quote.items || '[]'),
      },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
