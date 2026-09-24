'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Save, CheckCircle2, ShieldCheck, Sparkles, ShoppingBag, Truck, Utensils, FileText, Gift, BarChart3, Bell, Globe } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export interface ModulePricingItem {
  code: string;
  name: string;
  desc: string;
  category: 'vitrine' | 'ecommerce' | 'logistique' | 'restauration' | 'finance' | 'marketing' | 'analytics' | 'notifications';
  priceMonthly: number;
  priceYearly: number;
  costPriceMonthly: number;
  isActive: boolean;
  isCore: boolean;
}

export const DEFAULT_MODULE_CATALOG: ModulePricingItem[] = [
  {
    code: 'site_web',
    name: '1. Site Web Classique (Vitrine & Catalogue)',
    desc: 'Catalogue produits, fiches de présentation, contact, devis, CMS & SEO.',
    category: 'vitrine',
    priceMonthly: 15.0,
    priceYearly: 150.0,
    costPriceMonthly: 2.0,
    isActive: true,
    isCore: true,
  },
  {
    code: 'ecommerce',
    name: '2. Pack Boutique E-commerce & Vente en Ligne',
    desc: 'Panier, variantes, stocks, commandes + Facturation légale et Paiement CB inclus de base.',
    category: 'ecommerce',
    priceMonthly: 15.0,
    priceYearly: 150.0,
    costPriceMonthly: 3.0,
    isActive: true,
    isCore: false,
  },
  {
    code: 'accounting',
    name: '2a. Facturation Légale & TVA (Inclus E-com)',
    desc: 'Factures certifiées conformes, avoirs, TVA et exports comptables obligatoires.',
    category: 'finance',
    priceMonthly: 0.0,
    priceYearly: 0.0,
    costPriceMonthly: 0.0,
    isActive: true,
    isCore: false,
  },
  {
    code: 'woxxpay',
    name: '2b. Paiements WoxxPay / CB Stripe (Inclus E-com)',
    desc: 'Encaissement sécurisé par CB, espèces, chèque et virement bancaire.',
    category: 'finance',
    priceMonthly: 0.0,
    priceYearly: 0.0,
    costPriceMonthly: 0.0,
    isActive: true,
    isCore: false,
  },
  {
    code: 'woxxship',
    name: '3a. Transport & Expéditions WoxxShip',
    desc: 'Étiquettes transporteurs (Colissimo, Mondial Relay, Chronopost) et suivi colis.',
    category: 'logistique',
    priceMonthly: 10.0,
    priceYearly: 100.0,
    costPriceMonthly: 1.5,
    isActive: true,
    isCore: false,
  },
  {
    code: 'click_and_collect',
    name: '3b. Click & Collect / Retrait en Magasin',
    desc: 'Retrait sur créneau horaire dédié et commande à table / comptoir.',
    category: 'restauration',
    priceMonthly: 10.0,
    priceYearly: 100.0,
    costPriceMonthly: 1.5,
    isActive: true,
    isCore: false,
  },
  {
    code: 'reservations',
    name: '3c. Réservations & Prise de Rendez-Vous',
    desc: 'Planning universel de rendez-vous (santé, dentiste, esthétique) et réservation de tables.',
    category: 'restauration',
    priceMonthly: 10.0,
    priceYearly: 100.0,
    costPriceMonthly: 1.5,
    isActive: true,
    isCore: false,
  },
  {
    code: 'analytics',
    name: '4. Analyse des Ventes & Suivi de Stocks',
    desc: 'Statistiques approfondies du chiffre d’affaires, panier moyen, alertes rupture et top ventes.',
    category: 'analytics',
    priceMonthly: 10.0,
    priceYearly: 100.0,
    costPriceMonthly: 1.0,
    isActive: true,
    isCore: false,
  },
  {
    code: 'notifications',
    name: '5a. Alertes Instantanées Telegram & Email',
    desc: 'Notification immédiate de chaque nouvelle commande sur votre smartphone via Bot Telegram.',
    category: 'notifications',
    priceMonthly: 5.0,
    priceYearly: 50.0,
    costPriceMonthly: 0.5,
    isActive: true,
    isCore: false,
  },
  {
    code: 'loyalty_coupons',
    name: '5b. Fidélité, Cartes Cadeaux & Codes Promo',
    desc: 'Cartes cadeaux, avoirs clients, remises panier et codes promotionnels.',
    category: 'marketing',
    priceMonthly: 5.0,
    priceYearly: 50.0,
    costPriceMonthly: 0.5,
    isActive: true,
    isCore: false,
  },
];

export function ModulesTab() {
  const [catalog, setCatalog] = useState<ModulePricingItem[]>(DEFAULT_MODULE_CATALOG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    apiRequest<Record<string, string>>('/admin/settings')
      .then((settings) => {
        if (settings?.module_pricing_catalog) {
          try {
            const parsed = JSON.parse(settings.module_pricing_catalog);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCatalog(parsed);
            }
          } catch {
            // Utiliser le catalogue par défaut
          }
        }
      })
      .catch((err) => console.error('Erreur chargement settings modules:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateItem = (index: number, field: keyof ModulePricingItem, value: any) => {
    setCatalog((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          module_pricing_catalog: JSON.stringify(catalog),
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur enregistrement tarifs modules');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold">Chargement des modules...</div>;
  }

  // Calculs formules clés
  const siteWeb = catalog.find((m) => m.code === 'site_web');
  const ecommerce = catalog.find((m) => m.code === 'ecommerce');
  const baseShowcasePrice = siteWeb ? siteWeb.priceMonthly : 15;
  const baseShowcaseYearly = siteWeb ? siteWeb.priceYearly : 150;
  const fullShopPrice = baseShowcasePrice + (ecommerce ? ecommerce.priceMonthly : 15);
  const fullShopYearly = baseShowcaseYearly + (ecommerce ? ecommerce.priceYearly : 150);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <Layers className="w-6 h-6 text-amber-500" /> Grille Tarifaire & Modules Applicatifs
        </h2>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Définissez les prix de chaque module unitaire. Le commerçant compose son forfait ou choisit une formule recommandée.
        </p>
      </div>

      {/* Résumé des Formules Clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-brutal flex items-start gap-4">
          <div className="p-3 bg-blue-100 border-2 border-slate-900 rounded-2xl shadow-brutal-xs text-blue-700 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-950">Formule Site Web (Vitrine Seule)</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-black text-[10px] border border-slate-900">
                Base
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Site de présentation, pages CMS, contact, devis, galerie & SEO sans e-commerce.
            </p>
            <div className="mt-2 text-sm font-black text-slate-950">
              {baseShowcasePrice} € HT / mois <span className="text-xs text-slate-500 font-bold">({baseShowcaseYearly} € HT / an)</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-brutal flex items-start gap-4">
          <div className="p-3 bg-amber-100 border-2 border-slate-900 rounded-2xl shadow-brutal-xs text-amber-700 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-950">Pack Boutique E-commerce</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-200 text-slate-950 font-black text-[10px] border border-slate-900">
                Populaire
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Site Web + Catalogue Produits + Panier + Paiements WoxxPay / CB sécurisés.
            </p>
            <div className="mt-2 text-sm font-black text-slate-950">
              {fullShopPrice} € HT / mois <span className="text-xs text-slate-500 font-bold">({fullShopYearly} € HT / an)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau de Tarification par Module */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-brutal">
          <div className="p-5 bg-slate-50 border-b-2 border-slate-900 flex items-center justify-between">
            <h3 className="text-xs uppercase font-black text-slate-700 tracking-wider">
              Catalogue & Tarification des Modules à la Carte
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              {catalog.length} modules disponibles
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-white text-slate-700 uppercase font-black border-b-2 border-slate-900">
                <tr>
                  <th className="px-5 py-3.5">Module & Description</th>
                  <th className="px-5 py-3.5">Code Technique</th>
                  <th className="px-5 py-3.5 w-36">Prix Mensuel (€ HT)</th>
                  <th className="px-5 py-3.5 w-36">Prix Annuel (€ HT)</th>
                  <th className="px-5 py-3.5 w-32">Coût Revient (€)</th>
                  <th className="px-5 py-3.5 text-center w-24">Actif</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-bold text-slate-900">
                {catalog.map((m, idx) => (
                  <tr key={m.code} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-black text-slate-950 text-sm flex items-center gap-2">
                        {m.name}
                        {m.isCore && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-[9px] font-black border border-blue-300 uppercase">
                            Socle
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{m.desc}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-mono font-bold text-slate-800 border border-slate-300">
                        {m.code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={m.priceMonthly}
                          onChange={(e) => handleUpdateItem(idx, 'priceMonthly', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2.5 py-1.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-950 focus:outline-none focus:bg-white"
                        />
                        <span className="text-[11px] font-bold text-slate-600">/ mois</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={m.priceYearly}
                          onChange={(e) => handleUpdateItem(idx, 'priceYearly', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2.5 py-1.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-950 focus:outline-none focus:bg-white"
                        />
                        <span className="text-[11px] font-bold text-slate-600">/ an</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={m.costPriceMonthly}
                        onChange={(e) => handleUpdateItem(idx, 'costPriceMonthly', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:bg-white"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={m.isActive}
                        disabled={m.isCore}
                        onChange={(e) => handleUpdateItem(idx, 'isActive', e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer & Enregistrement */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-brutal">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Grille tarifaire enregistrée avec succès !
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 transition active:shadow-none disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer la Grille Tarifaire'}
          </button>
        </div>
      </form>
    </div>
  );
}

