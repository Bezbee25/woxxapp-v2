import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const RESERVED_SUBDOMAINS = [
  'admin', 'app', 'api', 'auth', 'storeship', 'woxx', 'mail', 'smtp',
  'billing', 'dashboard', 'status', 'demo', 'staging', 'prod', 'internal',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get('subdomain') || '';
    
    // Normalisation : minuscules, suppression des caractères spéciaux
    const subdomain = raw.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    if (!subdomain || subdomain.length < 3) {
      return NextResponse.json({
        available: false,
        subdomain,
        reason: 'Le sous-domaine doit contenir au moins 3 caractères (lettres, chiffres, tirets).',
      });
    }

    if (RESERVED_SUBDOMAINS.includes(subdomain)) {
      return NextResponse.json({
        available: false,
        subdomain,
        reason: 'Ce sous-domaine est réservé par le système Woxx.',
      });
    }

    const existing = await prisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({
        available: false,
        subdomain,
        reason: 'Ce sous-domaine est déjà attribué.',
      });
    }

    return NextResponse.json({
      available: true,
      subdomain,
      fqdn: `${subdomain}.woxxapp.de`,
      previewUrl: `https://${subdomain}.woxxapp.de`,
    });
  } catch (error: any) {
    console.error('Erreur check-subdomain:', error);
    return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 });
  }
}
