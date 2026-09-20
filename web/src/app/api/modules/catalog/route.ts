import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_MODULES = [
  {
    code: 'communiti',
    name: 'Module Communauté & Retours Clients',
    description: 'Fil d’actualité atelier, espace d’échanges, avis clients vérifiés et interactions.',
    category: 'community',
    priceMonthly: 14.90,
    priceYearly: 149.00,
    costPriceMonthly: 2.00,
    isCore: false,
    isActive: true,
  },
  {
    code: 'woxxpay',
    name: 'Paiement Sécurisé WoxxPay / Stripe',
    description: 'Tunnel de paiement CB intégré, Stripe Connect, gestion des remboursements.',
    category: 'payment',
    priceMonthly: 19.90,
    priceYearly: 199.00,
    costPriceMonthly: 3.00,
    isCore: true,
    isActive: true,
  },
  {
    code: 'woxxship',
    name: 'Expéditions & Étiquettes WoxxShip (SendCloud)',
    description: 'Calcul temps réel des frais de port et génération automatisée d’étiquettes de transport.',
    category: 'shipping',
    priceMonthly: 12.90,
    priceYearly: 129.00,
    costPriceMonthly: 2.50,
    isCore: true,
    isActive: true,
  },
  {
    code: 'click_and_collect',
    name: 'Retrait à l’Atelier (Click & Collect)',
    description: 'Prise de rendez-vous et choix de créneaux horaires pour le retrait sur place.',
    category: 'logistics',
    priceMonthly: 9.90,
    priceYearly: 99.00,
    costPriceMonthly: 0.50,
    isCore: false,
    isActive: true,
  },
  {
    code: 'loyalty',
    name: 'Programme Fidélité & Cagnotte',
    description: 'Attribution de points et avoirs marchands sur les achats répétés.',
    category: 'marketing',
    priceMonthly: 9.90,
    priceYearly: 99.00,
    costPriceMonthly: 1.00,
    isCore: false,
    isActive: true,
  },
];

export async function GET() {
  try {
    let modules = await prisma.moduleCatalog.findMany({
      orderBy: { priceMonthly: 'asc' },
    });

    // Auto-seed si la table est vide
    if (modules.length === 0) {
      for (const mod of DEFAULT_MODULES) {
        await prisma.moduleCatalog.create({
          data: mod,
        });
      }
      modules = await prisma.moduleCatalog.findMany({
        orderBy: { priceMonthly: 'asc' },
      });
    }

    return NextResponse.json(modules);
  } catch (error: any) {
    console.error('Erreur API ModuleCatalog:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du catalogue' }, { status: 500 });
  }
}
