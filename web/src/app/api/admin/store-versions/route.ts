import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export interface BoutiqueImageVersion {
  id: string;
  tag: string;
  name: string;
  description: string;
  architecture: string;
  isRecommended?: boolean;
  releaseDate: string;
  tenantCount?: number;
}

const DEFAULT_CURATED_VERSIONS: BoutiqueImageVersion[] = [
  {
    id: 'v-2026-09-reservations',
    tag: 'ghcr.io/bezbee25/boutique-global:sha-745d530-arm64',
    name: 'v2026.09 - Thèmes Santé/Massage/Bistrot + Réservations & Tables',
    description: 'Module Réservations agnostique (RDV santé, cabines spa, tables de restaurant) & 4 nouveaux thèmes métiers.',
    architecture: 'ARM64 (KinD & Prod)',
    isRecommended: true,
    releaseDate: '2026-09-22',
  },
  {
    id: 'v-2026-09-passwords',
    tag: 'ghcr.io/bezbee25/boutique-global:sha-567e299-arm64',
    name: 'v2026.09 - Sécurité SSO 1-Clic & Gestion Passwords Centralisée',
    description: 'Endpoints internes pour réinitialisation mot de passe admin/gérant et jetons SSO éphémères anti-rejeu.',
    architecture: 'ARM64',
    isRecommended: false,
    releaseDate: '2026-09-21',
  },
  {
    id: 'v-2026-09-invoicing',
    tag: 'ghcr.io/bezbee25/boutique-global:20260921-194600-arm64',
    name: 'v2026.09 - Facturation Conforme & Avoirs',
    description: 'Génération de factures PDF, avoirs, traçabilité et exports comptables.',
    architecture: 'ARM64',
    isRecommended: false,
    releaseDate: '2026-09-21',
  },
  {
    id: 'v-2026-09-latest',
    tag: 'ghcr.io/bezbee25/boutique-global:latest',
    name: 'Canal Rolling (:latest)',
    description: 'Pointe dynamiquement vers le dernier commit compilé sur la branche main.',
    architecture: 'Multi-arch',
    isRecommended: false,
    releaseDate: '2026-09-22',
  },
];

async function getStoredVersions(): Promise<BoutiqueImageVersion[]> {
  try {
    const setting = await prisma.systemSettings.findUnique({
      where: { key: 'boutique_registered_images' },
    });
    if (setting && setting.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erreur lecture boutique_registered_images:', e);
  }
  return DEFAULT_CURATED_VERSIONS;
}

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN', 'CHARGE_DAFFAIRE'], req);

    // 1. Obtenir les versions enregistrées
    const versions = await getStoredVersions();

    // 2. Obtenir le tag par défaut
    const defaultSetting = await prisma.systemSettings.findUnique({
      where: { key: 'boutique_default_image_tag' },
    });
    const defaultTag = defaultSetting?.value || 'ghcr.io/bezbee25/boutique-global:sha-745d530-arm64';

    // 3. Calculer l'utilisation réelle par les tenants
    const tenants = await prisma.tenant.findMany({
      select: { imageTag: true },
    });

    const countsByTag: Record<string, number> = {};
    for (const t of tenants) {
      const tag = t.imageTag || defaultTag;
      countsByTag[tag] = (countsByTag[tag] || 0) + 1;
    }

    const versionsWithCounts = versions.map((v) => ({
      ...v,
      isDefault: v.tag === defaultTag,
      tenantCount: countsByTag[v.tag] || 0,
    }));

    return NextResponse.json({
      defaultTag,
      versions: versionsWithCounts,
      totalTenants: tenants.length,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);
    const body = await req.json();
    const { action, tag, name, description, architecture, isRecommended, isDefault } = body;

    let versions = await getStoredVersions();

    if (action === 'ADD_OR_UPDATE') {
      if (!tag || !tag.trim()) {
        return NextResponse.json({ detail: "Le tag d'image est obligatoire." }, { status: 400 });
      }

      const cleanTag = tag.trim();
      const existingIndex = versions.findIndex((v) => v.tag === cleanTag);

      const newVersionObj: BoutiqueImageVersion = {
        id: existingIndex >= 0 ? versions[existingIndex].id : `v-${Date.now()}`,
        tag: cleanTag,
        name: name?.trim() || cleanTag.split(':')[1] || cleanTag,
        description: description?.trim() || 'Version boutique personnalisée',
        architecture: architecture?.trim() || 'ARM64 / Linux',
        isRecommended: !!isRecommended,
        releaseDate: new Date().toISOString().slice(0, 10),
      };

      if (existingIndex >= 0) {
        versions[existingIndex] = { ...versions[existingIndex], ...newVersionObj };
      } else {
        versions.unshift(newVersionObj);
      }

      await prisma.systemSettings.upsert({
        where: { key: 'boutique_registered_images' },
        update: { value: JSON.stringify(versions) },
        create: { key: 'boutique_registered_images', value: JSON.stringify(versions) },
      });

      if (isDefault) {
        await prisma.systemSettings.upsert({
          where: { key: 'boutique_default_image_tag' },
          update: { value: cleanTag },
          create: { key: 'boutique_default_image_tag', value: cleanTag },
        });
      }

      return NextResponse.json({ success: true, version: newVersionObj });
    }

    if (action === 'SET_DEFAULT') {
      if (!tag || !tag.trim()) {
        return NextResponse.json({ detail: "Le tag d'image est obligatoire." }, { status: 400 });
      }

      await prisma.systemSettings.upsert({
        where: { key: 'boutique_default_image_tag' },
        update: { value: tag.trim() },
        create: { key: 'boutique_default_image_tag', value: tag.trim() },
      });

      return NextResponse.json({ success: true, defaultTag: tag.trim() });
    }

    if (action === 'UPGRADE_ALL') {
      if (!tag || !tag.trim()) {
        return NextResponse.json({ detail: "Le tag cible est obligatoire." }, { status: 400 });
      }

      const targetTag = tag.trim();
      const tenants = await prisma.tenant.findMany();
      const { StoreManagerClient } = await import('@/lib/store-manager-client');

      let updatedCount = 0;
      for (const tenant of tenants) {
        try {
          await prisma.tenant.update({
            where: { id: tenant.id },
            data: { imageTag: targetTag },
          });

          await StoreManagerClient.provisionStore({
            storeId: tenant.id,
            subdomain: tenant.subdomain,
            storeKey: tenant.tenantApiKey,
            storeName: tenant.commerceName,
            modules: JSON.parse(tenant.modules || '[]'),
            customDomain: tenant.customDomain || undefined,
            image: targetTag,
          });
          updatedCount++;
        } catch (err) {
          console.error(`Erreur mise à jour tenant ${tenant.subdomain}:`, err);
        }
      }

      return NextResponse.json({
        success: true,
        message: `${updatedCount} boutique(s) mise(s) à jour vers ${targetTag}.`,
        updatedCount,
      });
    }

    return NextResponse.json({ detail: 'Action inconnue' }, { status: 400 });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get('tag');

    if (!tag) {
      return NextResponse.json({ detail: 'Paramètre tag obligatoire.' }, { status: 400 });
    }

    let versions = await getStoredVersions();
    versions = versions.filter((v) => v.tag !== tag);

    await prisma.systemSettings.upsert({
      where: { key: 'boutique_registered_images' },
      update: { value: JSON.stringify(versions) },
      create: { key: 'boutique_registered_images', value: JSON.stringify(versions) },
    });

    return NextResponse.json({ success: true, message: 'Version supprimée du catalogue' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
