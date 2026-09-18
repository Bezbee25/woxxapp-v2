import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_LEGAL_POLICIES } from '@/lib/policies-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = slug.toLowerCase().trim();
    const key = `policy_${cleanSlug}`;

    const defaultPolicy = DEFAULT_LEGAL_POLICIES[cleanSlug];

    let setting = await prisma.systemSettings.findUnique({
      where: { key },
    });

    // Si le setting n'existe pas ou s'il fait moins de 100 caractères (ancienne version de test), on synchronise avec la politique par défaut
    if ((!setting || setting.value.length < 100) && defaultPolicy) {
      setting = await prisma.systemSettings.upsert({
        where: { key },
        update: { value: defaultPolicy.content },
        create: { key, value: defaultPolicy.content },
      });
    }

    if (!setting && !defaultPolicy) {
      return NextResponse.json(
        { detail: 'Document légal introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      slug: cleanSlug,
      title: defaultPolicy?.title || 'Document Légal',
      content: setting?.value || defaultPolicy?.content || '',
      updatedAt: setting?.updatedAt || new Date().toISOString(),
    });
  } catch (error: any) {
    // Si la DB est inaccessible temporairement, on renvoie toujours le document par défaut
    const { slug } = await params;
    const cleanSlug = slug.toLowerCase().trim();
    const defaultPolicy = DEFAULT_LEGAL_POLICIES[cleanSlug];

    if (defaultPolicy) {
      return NextResponse.json({
        slug: cleanSlug,
        title: defaultPolicy.title,
        content: defaultPolicy.content,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { detail: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
