'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Save, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

const MODULES_INFO = [
  { slug: 'vitrine', name: 'Site Vitrine & Présentation', desc: 'Pages d’accueil, à propos, contact, galerie et formulaire.' },
  { slug: 'ecommerce', name: 'Boutique E-commerce & Catalogue', desc: 'Gestion de produits, panier d’achat, déclinaisons et commandes.' },
  { slug: 'payment', name: 'Passerelle WoxxPay / Stripe', desc: 'Paiement sécurisé par CB pour les commandes de la boutique.' },
  { slug: 'shipping', name: 'Gestion des Livraisons & Frais de Port', desc: 'Calcul des frais de port par zone et expéditions.' },
  { slug: 'booking', name: 'Réservations & Rendez-vous', desc: 'Calendrier interactif pour artisans, coiffeurs et praticiens.' },
  { slug: 'food_delivery', name: 'Click & Collect / Restauration', desc: 'Commandes en ligne express avec heure de retrait.' },
  { slug: 'custom_domain', name: 'Nom de Domaine Personnalisé', desc: 'Raccordement de son propre domaine .fr / .com avec SSL automatique.' },
];

export function ModulesTab() {
  const [priceMonthly, setPriceMonthly] = useState('15');
  const [priceYearly, setPriceYearly] = useState('150');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    apiRequest<Record<string, string>>('/admin/settings')
      .then((settings) => {
        if (settings) {
          if (settings.plan_price_monthly) setPriceMonthly(settings.plan_price_monthly);
          if (settings.plan_price_yearly) setPriceYearly(settings.plan_price_yearly);
        }
      })
      .catch((err) => console.error('Erreur chargement settings modules:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          plan_price_monthly: priceMonthly,
          plan_price_yearly: priceYearly,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur enregistrement tarifs');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold">Chargement des modules...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <Layers className="w-6 h-6 text-amber-500" /> Modules Applicatifs & Grille Tarifaire
        </h2>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Définissez les prix de base des abonnements WoxxApp V2 et visualisez les modules disponibles.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tarification de l'abonnement SaaS */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-4 shadow-brutal">
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">
            1. Tarifs de l'Abonnement SaaS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Formule Mensuelle (€ HT / mois)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={priceMonthly}
                onChange={(e) => setPriceMonthly(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-bold text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
              <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">Prix recommandé : 15.00 € HT</span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Formule Annuelle (€ HT / an)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={priceYearly}
                onChange={(e) => setPriceYearly(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-bold text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
              <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">Prix recommandé : 150.00 € HT (2 mois offerts)</span>
            </div>
          </div>
        </div>

        {/* Modules du Catalogue */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-4 shadow-brutal">
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">
            2. Catalogue des Modules Disponibles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODULES_INFO.map((m) => (
              <div
                key={m.slug}
                className="p-4 bg-slate-50 border-2 border-slate-900 rounded-2xl flex items-start justify-between gap-4 shadow-brutal-xs hover:bg-amber-50/30 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-black text-sm text-slate-950">{m.name}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-200 text-slate-950 border border-slate-900">
                      {m.slug}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-brutal">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tarifs enregistrés avec succès !
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 transition active:shadow-none disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer les Tarifs'}
          </button>
        </div>
      </form>
    </div>
  );
}
