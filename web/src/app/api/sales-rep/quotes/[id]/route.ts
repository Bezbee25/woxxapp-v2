import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);
    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id },
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

    return NextResponse.json({
      ...quote,
      items: JSON.parse(quote.items || '[]'),
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);
    const { id } = await params;
    const body = await req.json();
    const { title, description, status, items, paymentMethod } = body;

    const existing = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ detail: 'Devis introuvable.' }, { status: 404 });
    }

    if (user.role === 'CHARGE_DAFFAIRE' && existing.salesRepId !== user.id) {
      return NextResponse.json(
        { detail: 'Accès non autorisé à ce devis.' },
        { status: 403 }
      );
    }

    const data: any = {};
    if (title) data.title = title.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (status) data.status = status;
    if (paymentMethod) data.paymentMethod = paymentMethod;

    if (Array.isArray(items)) {
      let totalHt = 0;
      let totalVat = 0;

      const formattedItems = items.map((item: any) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const unitHt = Math.max(0, Number(item.unitPriceHt) || 0);
        const vatRate = item.vatRate !== undefined ? Number(item.vatRate) : 20.0;
        const lineHt = qty * unitHt;
        const lineVat = lineHt * (vatRate / 100);
        const lineTtc = lineHt + lineVat;

        totalHt += lineHt;
        totalVat += lineVat;

        return {
          description: item.description || 'Article',
          quantity: qty,
          unitPriceHt: unitHt,
          vatRate,
          totalHt: Number(lineHt.toFixed(2)),
          totalTtc: Number(lineTtc.toFixed(2)),
        };
      });

      data.items = JSON.stringify(formattedItems);
      data.totalHt = Number(totalHt.toFixed(2));
      data.totalVat = Number(totalVat.toFixed(2));
      data.totalTtc = Number((totalHt + totalVat).toFixed(2));
    }

    if (status === 'ACCEPTED' && !existing.acceptedAt) {
      data.acceptedAt = new Date();
    }
    if (status === 'PAID' && !existing.paidAt) {
      data.paidAt = new Date();
    }

    const updated = await prisma.quote.update({
      where: { id },
      data,
      include: {
        client: {
          select: { id: true, email: true, fullName: true },
        },
        salesRep: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });

    return NextResponse.json({
      ...updated,
      items: JSON.parse(updated.items || '[]'),
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);
    const { id } = await params;

    const existing = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ detail: 'Devis introuvable.' }, { status: 404 });
    }

    if (user.role === 'CHARGE_DAFFAIRE' && existing.salesRepId !== user.id) {
      return NextResponse.json(
        { detail: 'Accès non autorisé à ce devis.' },
        { status: 403 }
      );
    }

    await prisma.quote.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Devis supprimé avec succès.' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
