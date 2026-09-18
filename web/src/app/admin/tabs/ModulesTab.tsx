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
    return <div className="p-8 text-slate-400">Chargement des modules...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0D121F] p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> Modules Applicatifs & Grille Tarifaire
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Définissez les prix de base des abonnements WoxxApp V2 et visualisez les modules disponibles.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tarification de l'abonnement SaaS */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm uppercase font-bold text-cyan-400 tracking-wider">
            1. Tarifs de l'Abonnement SaaS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Formule Mensuelle (€ HT / mois)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={priceMonthly}
                onChange={(e) => setPriceMonthly(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Prix recommandé : 15.00 € HT</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Formule Annuelle (€ HT / an)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={priceYearly}
                onChange={(e) => setPriceYearly(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Prix recommandé : 150.00 € HT (2 mois offerts)</span>
            </div>
          </div>
        </div>

        {/* Modules du Catalogue */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm uppercase font-bold text-cyan-400 tracking-wider">
            2. Catalogue des Modules Disponibles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODULES_INFO.map((m) => (
              <div
                key={m.slug}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white">{m.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {m.slug}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between bg-[#0D121F] p-4 rounded-2xl border border-slate-800">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Tarifs enregistrés avec succès !
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer les Tarifs'}
          </button>
        </div>
      </form>
    </div>
  );
}
