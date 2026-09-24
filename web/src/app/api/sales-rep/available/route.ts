import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const salesReps = await prisma.user.findMany({
      where: {
        role: { in: ['CHARGE_DAFFAIRE', 'ADMIN'] },
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        companyName: true,
        avatarUrl: true,
        phoneNumber: true,
        whatsappNumber: true,
        calendlyUrl: true,
        bio: true,
        role: true,
      },
      orderBy: { fullName: 'asc' },
    });

    return NextResponse.json(salesReps);
  } catch (error: any) {
    console.error('Erreur GET /api/sales-rep/available:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération des conseillers' },
      { status: error.status || 500 }
    );
  }
}
