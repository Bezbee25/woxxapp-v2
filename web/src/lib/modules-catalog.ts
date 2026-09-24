import { Globe, ShoppingBag, Truck, BarChart3, Bell } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export interface ModulePricingItem {
  code: string;
  label: string;
  desc: string;
  category: string;
  priceMonthly: number;
  priceYearly: number;
  isCoreWithEcommerce?: boolean;
}

export const DEFAULT_PRICING_CATALOG: Record<string, ModulePricingItem> = {
  site_web: {
    code: 'site_web',
    label: 'Site Web & Vitrine Pro',
    desc: 'Socle obligatoire : Présentation, catalogue produits, galerie et référencement SEO.',
    category: 'Socle de Base',
    priceMonthly: 15.0,
    priceYearly: 150.0,
  },
  ecommerce: {
    code: 'ecommerce',
    label: 'Boutique E-commerce & Stocks',
    desc: 'Panier d’achat, variantes (tailles/couleurs), gestion de stocks et commandes en ligne.',
    category: 'Vente en Ligne',
    priceMonthly: 35.0,
    priceYearly: 300.0,
  },
  accounting: {
    code: 'accounting',
    label: 'Facturation Légale & TVA',
    desc: 'Factures conformes Art. L123-22, avoirs, mentions légales et exports comptables.',
    category: 'Comptabilité',
    priceMonthly: 0.0,
    priceYearly: 0.0,
    isCoreWithEcommerce: true,
  },
  woxxpay: {
    code: 'woxxpay',
    label: 'Paiements WoxxPay / CB Stripe',
    desc: 'Encaissement sécurisé par carte bancaire, virement SEPA, chèque et espèces.',
    category: 'Paiements',
    priceMonthly: 0.0,
    priceYearly: 0.0,
    isCoreWithEcommerce: true,
  },
  woxxship: {
    code: 'woxxship',
    label: 'Livraisons & Transport WoxxShip',
    desc: 'Génération d’étiquettes Colissimo, Mondial Relay, Chronopost et suivi colis.',
    category: 'Logistique',
    priceMonthly: 35.0,
    priceYearly: 300.0,
  },
  click_and_collect: {
    code: 'click_and_collect',
    label: 'Click & Collect / Commande à Table',
    desc: 'Retrait en boutique sur créneau horaire dédié et commande à table/comptoir avec KDS cuisine.',
    category: 'Logistique & Restauration',
    priceMonthly: 30.0,
    priceYearly: 300.0,
  },
  reservations: {
    code: 'reservations',
    label: 'Réservations & Prise de RDV',
    desc: 'Planning universel de rendez-vous (santé, beauté, bien-être) et réservation de tables.',
    category: 'Services & RDV',
    priceMonthly: 25.0,
    priceYearly: 250.0,
  },
  analytics: {
    code: 'analytics',
    label: 'Statistiques & CA Avancés',
    desc: 'Tableaux de bord d’analyse du chiffre d’affaires, panier moyen et top ventes.',
    category: 'Pilotage',
    priceMonthly: 30.0,
    priceYearly: 300.0,
  },
  notifications: {
    code: 'notifications',
    label: 'Alertes Telegram & Email',
    desc: 'Notification instantanée sur smartphone de chaque commande via Bot Telegram.',
    category: 'Communication',
    priceMonthly: 10.0,
    priceYearly: 100.0,
  },
  loyalty_coupons: {
    code: 'loyalty_coupons',
    label: 'Fidélité & Codes Promo',
    desc: 'Cartes cadeaux, avoirs clients, remises panier et codes promotionnels.',
    category: 'Marketing',
    priceMonthly: 10.0,
    priceYearly: 100.0,
  },
};

export interface TaxSettings {
  taxType: 'MICRO_ENTERPRISE' | 'SAS_SARL_WITH_VAT';
  vatRate: number;
  isVatExempt: boolean;
  legalNotice: string;
  companyName: string;
}

export interface ModuleStepDefinition {
  stepNumber: number;
  stepTitle: string;
  stepDesc: string;
  icon: any;
  badge?: string;
  modules: {
    code: string;
    label: string;
    desc: string;
    isCoreWithEcommerce?: boolean;
  }[];
}

export const MODULE_PROGRESSION_STEPS: ModuleStepDefinition[] = [
  {
    stepNumber: 1,
    stepTitle: 'Site Vitrine & Catalogue',
    stepDesc: 'Socle obligatoire pour présenter vos produits et recevoir des contacts/devis.',
    icon: Globe,
    badge: 'Socle de Base',
    modules: [
      {
        code: 'site_web',
        label: 'Site Web & Catalogue Vitrine',
        desc: 'Pages d’accueil, catalogue produits, galerie, formulaire de contact et SEO.'
      }
    ]
  },
  {
    stepNumber: 2,
    stepTitle: 'Vente E-Commerce & Encaissement Légal',
    stepDesc: 'Tunnel de commande, panier d’achat, paiement sécurisé et facturation conforme obligatoire.',
    icon: ShoppingBag,
    badge: 'Essentiel Vente',
    modules: [
      {
        code: 'ecommerce',
        label: 'Boutique E-commerce & Stocks',
        desc: 'Panier d’achat, variantes (tailles/couleurs), gestion de stocks et commandes.'
      },
      {
        code: 'accounting',
        label: 'Facturation Légale & TVA',
        desc: 'Génération de factures conformes, avoirs, mentions légales et exports comptables.',
        isCoreWithEcommerce: true
      },
      {
        code: 'woxxpay',
        label: 'Paiements WoxxPay / CB Stripe',
        desc: 'Encaissement sécurisé par carte bancaire, virement, chèque et espèces.',
        isCoreWithEcommerce: true
      }
    ]
  },
  {
    stepNumber: 3,
    stepTitle: 'Logistique & Expéditions',
    stepDesc: 'Modes de mise à disposition des commandes (livraison ou retrait en boutique).',
    icon: Truck,
    modules: [
      {
        code: 'woxxship',
        label: 'Livraisons WoxxShip',
        desc: 'Impression d’étiquettes de transport (Colissimo, Mondial Relay) et suivi colis.'
      },
      {
        code: 'click_and_collect',
        label: 'Click & Collect / Table',
        desc: 'Retrait en boutique sur créneau horaire dédié et commande à table/comptoir.'
      },
      {
        code: 'reservations',
        label: 'Prise de Rendez-Vous & Tables',
        desc: 'Gestion universelle des rendez-vous (santé, dentiste, médecin, massage, esthétique) et réservations de tables/cabines.'
      }
    ]
  },
  {
    stepNumber: 4,
    stepTitle: 'Pilotage & Analyse des Ventes',
    stepDesc: 'Indicateurs de performance commerciale, panier moyen et suivi de rentabilité.',
    icon: BarChart3,
    modules: [
      {
        code: 'analytics',
        label: 'Statistiques & CA Avancés',
        desc: 'Tableaux de bord d’analyse du chiffre d’affaires, panier moyen et top ventes.'
      }
    ]
  },
  {
    stepNumber: 5,
    stepTitle: 'Notifications & Fidélisation',
    stepDesc: 'Alertes en direct et fidélisation de votre clientèle.',
    icon: Bell,
    modules: [
      {
        code: 'notifications',
        label: 'Alertes Telegram & Email',
        desc: 'Notification instantanée sur smartphone de chaque commande via Bot Telegram.'
      },
      {
        code: 'loyalty_coupons',
        label: 'Fidélité & Codes Promo',
        desc: 'Cartes cadeaux, avoirs clients, remises panier et codes promotionnels.'
      }
    ]
  }
];

export async function getSystemPricingAndTaxSettings(): Promise<{
  pricingMap: Record<string, ModulePricingItem>;
  taxSettings: TaxSettings;
}> {
  try {
    const settings = await prisma.systemSettings.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    // Extraction des prix configurés
    const pricingMap: Record<string, ModulePricingItem> = { ...DEFAULT_PRICING_CATALOG };
    if (settingsMap.module_pricing_catalog) {
      try {
        const rawCatalog = JSON.parse(settingsMap.module_pricing_catalog);
        if (Array.isArray(rawCatalog)) {
          for (const item of rawCatalog) {
            if (item.code) {
              pricingMap[item.code] = {
                code: item.code,
                label: item.name || DEFAULT_PRICING_CATALOG[item.code]?.label || item.code,
                desc: item.desc || DEFAULT_PRICING_CATALOG[item.code]?.desc || '',
                category: item.category || DEFAULT_PRICING_CATALOG[item.code]?.category || 'general',
                priceMonthly: typeof item.priceMonthly === 'number' ? item.priceMonthly : 0,
                priceYearly: typeof item.priceYearly === 'number' ? item.priceYearly : 0,
                isCoreWithEcommerce: DEFAULT_PRICING_CATALOG[item.code]?.isCoreWithEcommerce,
              };
            }
          }
        }
      } catch (err) {
        console.error('Erreur parsing module_pricing_catalog:', err);
      }
    }

    // Extraction de la fiscalité (Micro-entreprise vs TVA)
    const taxType = (settingsMap.company_tax_type as any) || 'MICRO_ENTERPRISE';
    const isMicro = taxType === 'MICRO_ENTERPRISE';
    const vatRate = isMicro ? 0.0 : parseFloat(settingsMap.company_vat_rate || '20.0') || 20.0;
    const legalNotice = isMicro
      ? settingsMap.company_legal_notice || 'Franchise en base de TVA, art. 293 B du CGI'
      : settingsMap.company_legal_notice || 'TVA acquittée sur les débits';

    const taxSettings: TaxSettings = {
      taxType,
      vatRate,
      isVatExempt: isMicro,
      legalNotice,
      companyName: settingsMap.company_name || 'WoxxApp SAS',
    };

    return { pricingMap, taxSettings };
  } catch {
    return {
      pricingMap: DEFAULT_PRICING_CATALOG,
      taxSettings: {
        taxType: 'MICRO_ENTERPRISE',
        vatRate: 0.0,
        isVatExempt: true,
        legalNotice: 'Franchise en base de TVA, art. 293 B du CGI',
        companyName: 'WoxxApp SAS',
      },
    };
  }
}

export function calculateModulesOrder(
  selectedModules: string[],
  billingCycle: 'monthly' | 'yearly' = 'monthly',
  pricingMap: Record<string, ModulePricingItem> = DEFAULT_PRICING_CATALOG,
  taxSettings?: TaxSettings
) {
  let totalHt = 0;
  const items: Array<{ code: string; label: string; priceHt: number }> = [];

  const uniqueModules = Array.from(new Set(selectedModules));

  for (const modCode of uniqueModules) {
    const item = pricingMap[modCode] || DEFAULT_PRICING_CATALOG[modCode];
    if (item) {
      const price = billingCycle === 'yearly' ? item.priceYearly : item.priceMonthly;
      if (price > 0) {
        totalHt += price;
        items.push({
          code: item.code,
          label: item.label,
          priceHt: price,
        });
      }
    }
  }

  const isVatExempt = taxSettings ? taxSettings.isVatExempt : true;
  const vatRate = isVatExempt ? 0.0 : taxSettings?.vatRate || 0.0;
  const totalVat = isVatExempt ? 0.0 : Math.round(totalHt * (vatRate / 100) * 100) / 100;
  const totalTtc = isVatExempt ? Math.round(totalHt * 100) / 100 : Math.round((totalHt + totalVat) * 100) / 100;

  return {
    billingCycle,
    items,
    totalHt: Math.round(totalHt * 100) / 100,
    vatRate,
    isVatExempt,
    legalNotice: taxSettings?.legalNotice || (isVatExempt ? 'Franchise en base de TVA, art. 293 B du CGI' : 'TVA 20%'),
    totalVat,
    totalTtc,
  };
}
