import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        assignedSalesRep: {
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
          },
        },
      },
    });

    return NextResponse.json({
      salesRep: currentUser?.assignedSalesRep || null,
    });
  } catch (error: any) {
    console.error('Erreur GET /api/account/sales-rep:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}
