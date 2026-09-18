import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole, sanitizeUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);

    // Si c'est un Chargé d'Affaires, on filtre sur ses clients assignés
    const where: any = {
      role: 'CLIENT',
    };

    if (user.role === 'CHARGE_DAFFAIRE') {
      where.assignedSalesRepId = user.id;
    }

    const clients = await prisma.user.findMany({
      where,
      include: {
        tenants: true,
        subscriptions: true,
        invoices: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      clients.map(c => ({
        ...sanitizeUser(c),
        tenants: c.tenants.map(t => ({
          ...t,
          modules: JSON.parse(t.modules || '[]'),
        })),
        subscriptions: c.subscriptions,
        invoices: c.invoices,
      }))
    );
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
