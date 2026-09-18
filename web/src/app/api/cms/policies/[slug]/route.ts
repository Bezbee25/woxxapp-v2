import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runSeed } from '@/lib/seed';

const POLICY_TITLES: Record<string, string> = {
  cgu: "Conditions Générales d'Utilisation",
  cgv: 'Conditions Générales de Vente',
  legal: 'Mentions Légales',
  gdpr: 'Politique de Protection des Données (RGPD)',
  cookies: 'Politique de Gestion des Cookies',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = slug.toLowerCase().trim();
    const key = `policy_${cleanSlug}`;

    let setting = await prisma.systemSettings.findUnique({
      where: { key },
    });

    if (!setting) {
      await runSeed();
      setting = await prisma.systemSettings.findUnique({
        where: { key },
      });
    }

    if (!setting) {
      return NextResponse.json(
        { detail: 'Document légal introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      slug: cleanSlug,
      title: POLICY_TITLES[cleanSlug] || 'Document Légal',
      content: setting.value,
      updatedAt: setting.updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
