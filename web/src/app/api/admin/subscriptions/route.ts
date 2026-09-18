import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);

    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: { id: true, email: true, fullName: true },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const invoices = await prisma.invoice.findMany({
      include: {
        user: {
          select: { id: true, email: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenueTtc = invoices
      .filter(i => i.status === 'PAID')
      .reduce((acc, curr) => acc + curr.totalTtc, 0);

    const totalRevenueHt = invoices
      .filter(i => i.status === 'PAID')
      .reduce((acc, curr) => acc + curr.totalHt, 0);

    return NextResponse.json({
      subscriptions,
      invoices,
      stats: {
        totalRevenueTtc,
        totalRevenueHt,
        activeSubscriptionsCount: subscriptions.filter(s => s.status === 'active').length,
        totalInvoicesCount: invoices.length,
      },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
