import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { sendClientAssignedToSalesRepEmail } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const { salesRepId } = body;

    if (!salesRepId) {
      return NextResponse.json({ error: 'Identifiant du chargé d’affaires requis' }, { status: 400 });
    }

    // Vérifier que le commercial existe et est actif
    const salesRep = await prisma.user.findUnique({
      where: { id: salesRepId },
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
    });

    if (!salesRep || !['CHARGE_DAFFAIRE', 'ADMIN'].includes(salesRep.role)) {
      return NextResponse.json({ error: 'Chargé d’affaires introuvable ou inactif' }, { status: 404 });
    }

    // Récupérer les infos du client pour le mail
    const clientUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        tenants: {
          select: { commerceName: true, subdomain: true },
        },
      },
    });

    // Mettre à jour l'assignation du client
    await prisma.user.update({
      where: { id: user.id },
      data: { assignedSalesRepId: salesRep.id },
    });

    // Envoi de l'email au Chargé d'Affaires
    if (salesRep.email) {
      const primaryTenant = clientUser?.tenants?.[0];
      const clientCompany = primaryTenant
        ? `${primaryTenant.commerceName} (${primaryTenant.subdomain}.woxxapp.de)`
        : clientUser?.fullName || undefined;

      sendClientAssignedToSalesRepEmail({
        salesRepEmail: salesRep.email,
        salesRepName: salesRep.fullName || undefined,
        clientName: clientUser?.fullName || clientUser?.email || 'Commerçant',
        clientEmail: clientUser?.email || user.email,
        clientCompany,
      }).catch((err) => console.error('Erreur notification email CA:', err));
    }

    return NextResponse.json({
      success: true,
      message: `Vous êtes désormais accompagné par ${salesRep.fullName || salesRep.email}`,
      salesRep,
    });
  } catch (error: any) {
    console.error('Erreur POST /api/account/sales-rep/choose:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l’affectation du conseiller' },
      { status: error.status || 500 }
    );
  }
}
