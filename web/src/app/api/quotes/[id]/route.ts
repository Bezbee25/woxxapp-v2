import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

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

    return NextResponse.json({
      ...quote,
      items: JSON.parse(quote.items || '[]'),
      bankDetails: quote.bankDetails ? JSON.parse(quote.bankDetails) : null,
    });
  } catch (error: any) {
    console.error('Erreur GET /api/quotes/[id]:', error);
    return NextResponse.json({ detail: 'Erreur serveur.' }, { status: 500 });
  }
}
