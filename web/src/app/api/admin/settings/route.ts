import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);

    const settings = await prisma.systemSettings.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json(settingsMap);
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);
    const body = await req.json(); // Record<string, string>

    const updates = Object.entries(body).map(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      return prisma.systemSettings.upsert({
        where: { key },
        update: { value: stringValue },
        create: { key, value: stringValue },
      });
    });

    await prisma.$transaction(updates);

    // Synchronisation en direct de la grille tarifaire avec le Store Manager
    if (body.module_pricing_catalog) {
      try {
        const { StoreManagerClient } = await import('@/lib/store-manager-client');
        const catalog = typeof body.module_pricing_catalog === 'string'
          ? JSON.parse(body.module_pricing_catalog)
          : body.module_pricing_catalog;
        if (Array.isArray(catalog)) {
          await StoreManagerClient.syncPricingCatalog(catalog);
        }
      } catch (syncErr) {
        console.error('Erreur synchronisation grille tarifaire Store Manager:', syncErr);
      }
    }

    return NextResponse.json({ message: 'Paramètres mis à jour avec succès' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
