import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
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
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    // Récupérer les paramètres fiscaux et d'entreprise spécifiques au chargé d'affaires
    const taxSettingKey = `salesrep_${user.id}_tax_settings`;
    const taxSetting = await prisma.systemSettings.findUnique({
      where: { key: taxSettingKey },
    });

    let parsedTax: any = {
      taxType: 'MICRO_ENTERPRISE',
      vatRate: '20.0',
      legalNotice: 'Franchise en base de TVA, art. 293 B du CGI',
      siret: '',
      vatNumber: '',
      companyAddress: '',
      companyEmail: currentUser.email,
    };

    if (taxSetting?.value) {
      try {
        parsedTax = { ...parsedTax, ...JSON.parse(taxSetting.value) };
      } catch (e) {
        console.error('Erreur parsing tax settings CA:', e);
      }
    }

    return NextResponse.json({
      ...currentUser,
      ...parsedTax,
      companyName: parsedTax.companyName || currentUser.companyName || '',
    });
  } catch (error: any) {
    console.error('Erreur GET sales-rep/profile:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération du profil' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);
    const body = await req.json();

    const {
      fullName,
      companyName,
      avatarUrl,
      phoneNumber,
      whatsappNumber,
      calendlyUrl,
      bio,
      taxType = 'MICRO_ENTERPRISE',
      vatRate = '20.0',
      legalNotice = 'Franchise en base de TVA, art. 293 B du CGI',
      siret = '',
      vatNumber = '',
      companyAddress = '',
      companyEmail = '',
    } = body;

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName ? String(fullName).trim() : null;
    if (companyName !== undefined) updateData.companyName = companyName ? String(companyName).trim() : null;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl ? String(avatarUrl).trim() : null;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber ? String(phoneNumber).trim() : null;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber ? String(whatsappNumber).trim() : null;
    if (calendlyUrl !== undefined) updateData.calendlyUrl = calendlyUrl ? String(calendlyUrl).trim() : null;
    if (bio !== undefined) updateData.bio = bio ? String(bio).trim() : null;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
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
    });

    // Enregistrer les paramètres fiscaux et entreprise du chargé d'affaires
    const taxSettingKey = `salesrep_${user.id}_tax_settings`;
    const taxPayload = {
      taxType,
      vatRate,
      legalNotice,
      siret,
      vatNumber,
      companyAddress,
      companyEmail: companyEmail || updatedUser.email,
      companyName: companyName || updatedUser.companyName || '',
    };

    await prisma.systemSettings.upsert({
      where: { key: taxSettingKey },
      update: { value: JSON.stringify(taxPayload) },
      create: { key: taxSettingKey, value: JSON.stringify(taxPayload) },
    });

    return NextResponse.json({
      success: true,
      message: 'Profil et paramètres fiscaux mis à jour avec succès',
      user: {
        ...updatedUser,
        ...taxPayload,
      },
    });
  } catch (error: any) {
    console.error('Erreur POST sales-rep/profile:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour du profil' },
      { status: error.status || 500 }
    );
  }
}

