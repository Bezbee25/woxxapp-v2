import { Globe, ShoppingBag, Truck, BarChart3, Bell } from 'lucide-react';

export interface ModulePricingItem {
  code: string;
  label: string;
  desc: string;
  category: string;
  priceMonthly: number;
  priceYearly: number;
  isCoreWithEcommerce?: boolean;
}

export const MODULES_PRICING_CATALOG: Record<string, ModulePricingItem> = {
  site_web: {
    code: 'site_web',
    label: 'Site Web & Vitrine Pro',
    desc: 'Socle obligatoire : Présentation, catalogue produits, galerie et référencement SEO.',
    category: 'Socle de Base',
    priceMonthly: 0,
    priceYearly: 0,
  },
  ecommerce: {
    code: 'ecommerce',
    label: 'Boutique E-commerce & Stocks',
    desc: 'Panier d’achat, variantes (tailles/couleurs), gestion de stocks et commandes en ligne.',
    category: 'Vente en Ligne',
    priceMonthly: 29.0,
    priceYearly: 290.0,
  },
  accounting: {
    code: 'accounting',
    label: 'Facturation Légale & TVA',
    desc: 'Factures conformes Art. L123-22, avoirs, mentions légales et exports comptables.',
    category: 'Comptabilité',
    priceMonthly: 0.0, // Inclus d'office avec ecommerce
    priceYearly: 0.0,
    isCoreWithEcommerce: true,
  },
  woxxpay: {
    code: 'woxxpay',
    label: 'Paiements WoxxPay / CB Stripe',
    desc: 'Encaissement sécurisé par carte bancaire, virement SEPA, chèque et espèces.',
    category: 'Paiements',
    priceMonthly: 0.0, // Inclus d'office avec ecommerce
    priceYearly: 0.0,
    isCoreWithEcommerce: true,
  },
  woxxship: {
    code: 'woxxship',
    label: 'Livraisons & Transport WoxxShip',
    desc: 'Génération d’étiquettes Colissimo, Mondial Relay, Chronopost et suivi colis.',
    category: 'Logistique',
    priceMonthly: 15.0,
    priceYearly: 150.0,
  },
  click_and_collect: {
    code: 'click_and_collect',
    label: 'Click & Collect / Commande à Table',
    desc: 'Retrait en boutique sur créneau horaire dédié et commande à table/comptoir avec KDS cuisine.',
    category: 'Logistique & Restauration',
    priceMonthly: 10.0,
    priceYearly: 100.0,
  },
  reservations: {
    code: 'reservations',
    label: 'Réservations & Prise de RDV',
    desc: 'Planning universel de rendez-vous (santé, beauté, bien-être) et réservation de tables.',
    category: 'Services & RDV',
    priceMonthly: 19.0,
    priceYearly: 190.0,
  },
  analytics: {
    code: 'analytics',
    label: 'Statistiques & CA Avancés',
    desc: 'Tableaux de bord d’analyse du chiffre d’affaires, panier moyen et top ventes.',
    category: 'Pilotage',
    priceMonthly: 9.0,
    priceYearly: 90.0,
  },
  notifications: {
    code: 'notifications',
    label: 'Alertes Telegram & Email',
    desc: 'Notification instantanée sur smartphone de chaque commande via Bot Telegram.',
    category: 'Communication',
    priceMonthly: 5.0,
    priceYearly: 50.0,
  },
  loyalty_coupons: {
    code: 'loyalty_coupons',
    label: 'Fidélité & Codes Promo',
    desc: 'Cartes cadeaux, avoirs clients, remises panier et codes promotionnels.',
    category: 'Marketing',
    priceMonthly: 9.0,
    priceYearly: 90.0,
  },
};

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

export function calculateModulesOrder(
  selectedModules: string[],
  billingCycle: 'monthly' | 'yearly' = 'monthly'
) {
  let totalHt = 0;
  const items: Array<{ code: string; label: string; priceHt: number }> = [];

  const uniqueModules = Array.from(new Set(selectedModules));

  for (const modCode of uniqueModules) {
    const item = MODULES_PRICING_CATALOG[modCode];
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

  const vatRate = 20.0;
  const totalVat = Math.round(totalHt * 0.20 * 100) / 100;
  const totalTtc = Math.round((totalHt + totalVat) * 100) / 100;

  return {
    billingCycle,
    items,
    totalHt: Math.round(totalHt * 100) / 100,
    vatRate,
    totalVat,
    totalTtc,
  };
}
