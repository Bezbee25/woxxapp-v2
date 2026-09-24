import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    let where: any = {};

    if (user.role === 'CLIENT') {
      where.userId = user.id;
    } else if (user.role === 'CHARGE_DAFFAIRE') {
      // Le chargé d'affaires voit les factures de ses clients assignés
      const assignedClients = await prisma.user.findMany({
        where: { assignedSalesRepId: user.id },
        select: { id: true },
      });
      const clientIds = assignedClients.map((c) => c.id);
      where.userId = { in: clientIds };
    }
    // Pour ADMIN, where est vide (toutes les factures)

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, fullName: true, companyName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenueTtc = invoices
      .filter((i) => i.status === 'PAID')
      .reduce((acc, curr) => acc + curr.totalTtc, 0);

    const totalRevenueHt = invoices
      .filter((i) => i.status === 'PAID')
      .reduce((acc, curr) => acc + curr.totalHt, 0);

    return NextResponse.json({
      invoices,
      stats: {
        totalRevenueTtc,
        totalRevenueHt,
        totalInvoicesCount: invoices.length,
      },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
