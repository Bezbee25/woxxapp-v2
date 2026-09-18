import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { TenantStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (statusParam && ['PENDING', 'ACTIVE', 'SUSPENDED'].includes(statusParam.toUpperCase())) {
      where.status = statusParam.toUpperCase() as TenantStatus;
    }
    if (search) {
      where.OR = [
        { commerceName: { contains: search, mode: 'insensitive' } },
        { subdomain: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            assignedSalesRep: {
              select: { id: true, email: true, fullName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      tenants.map(t => ({
        ...t,
        modules: JSON.parse(t.modules || '[]'),
      }))
    );
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
