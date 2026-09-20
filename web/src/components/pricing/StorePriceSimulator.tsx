'use client';

import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Globe, ShieldCheck, ArrowRight, Tag, Loader2, AlertCircle } from 'lucide-react';

interface ModuleItem {
  code: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  isCore?: boolean;
}

export function StorePriceSimulator() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTemplate, setSelectedTemplate] = useState<'artisan' | 'boutique_pro'>('artisan');
  const [selectedModules, setSelectedModules] = useState<string[]>(['woxxpay', 'woxxship', 'communiti']);
  const [subdomainInput, setSubdomainInput] = useState('');
  const [subdomainStatus, setSubdomainStatus] = useState<{
    checking: boolean;
    available?: boolean;
    reason?: string;
    fqdn?: string;
  }>({ checking: false });
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState('');

  const [modulesList, setModulesList] = useState<ModuleItem[]>([
    {
      code: 'communiti',
      name: 'Espace Communauté & Avis Vérifiés',
      description: 'Fil d’actualité, avis clients vérifiés et échanges sous vos créations.',
      priceMonthly: 14.90,
      priceYearly: 149.00,
    },
    {
      code: 'woxxpay',
      name: 'Paiement Sécurisé CB & Stripe',
      description: 'Paiement en ligne sécurisé, virements marchands automatisés.',
      priceMonthly: 19.90,
      priceYearly: 199.00,
      isCore: true,
    },
    {
      code: 'woxxship',
      name: 'Expéditions & Étiquettes SendCloud',
      description: 'Calcul des frais de port et génération d’étiquettes en 1 clic.',
      priceMonthly: 12.90,
      priceYearly: 129.00,
      isCore: true,
    },
    {
      code: 'click_and_collect',
      name: 'Retrait à l’Atelier (Click & Collect)',
      description: 'Créneaux de retrait sur place pour vos clients locaux.',
      priceMonthly: 9.90,
      priceYearly: 99.00,
    },
    {
      code: 'loyalty',
      name: 'Programme Fidélité & Cagnotte',
      description: 'Récompenses et points pour fidéliser vos acheteurs réguliers.',
      priceMonthly: 9.90,
      priceYearly: 99.00,
    },
  ]);

  // Vérification de la disponibilité du sous-domaine avec debounce
  useEffect(() => {
    if (!subdomainInput || subdomainInput.length < 3) {
      setSubdomainStatus({ checking: false });
      return;
    }

    const timer = setTimeout(async () => {
      setSubdomainStatus({ checking: true });
      try {
        const res = await fetch(`/api/tenants/check-subdomain?subdomain=${encodeURIComponent(subdomainInput)}`);
        const data = await res.json();
        setSubdomainStatus({
          checking: false,
          available: data.available,
          reason: data.reason,
          fqdn: data.fqdn,
        });
      } catch {
        setSubdomainStatus({ checking: false, available: false, reason: 'Erreur réseau' });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [subdomainInput]);

  const toggleModule = (code: string) => {
    if (selectedModules.includes(code)) {
      setSelectedModules(selectedModules.filter((m) => m !== code));
    } else {
      setSelectedModules([...selectedModules, code]);
    }
  };

  const applyPromo = () => {
    setPromoError('');
    if (!promoCode.trim()) return;

    if (promoCode.toUpperCase() === 'WOXX2026' || promoCode.toUpperCase() === 'SALES10') {
      setDiscountPercent(15);
    } else {
      setPromoError('Code promotionnel invalide ou expiré');
    }
  };

  // Calcul du prix de base
  const basePrice = selectedTemplate === 'artisan' 
    ? (billingCycle === 'monthly' ? 29.00 : 290.00) 
    : (billingCycle === 'monthly' ? 49.00 : 490.00);

  // Calcul du prix des modules
  const modulesTotal = modulesList
    .filter((m) => selectedModules.includes(m.code))
    .reduce((sum, m) => sum + (billingCycle === 'monthly' ? m.priceMonthly : m.priceYearly), 0);

  const subtotal = basePrice + modulesTotal;
  const discountAmount = (subtotal * discountPercent) / 100;
  const totalHt = Math.max(0, subtotal - discountAmount);
  const totalTtc = totalHt * 1.20; // TVA 20%

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Simulateur d'Offre Transparent & Sur-Mesure</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 font-medium">
          Composez votre boutique en quelques clics
        </h2>
        <p className="text-stone-600 text-sm max-w-xl mx-auto font-sans leading-relaxed">
          Choisissez vos options selon votre activité artisanale. Aucun frais caché, activez ou suspendez vos modules à tout moment.
        </p>

        {/* Sélecteur de cycle de facturation */}
        <div className="inline-flex items-center p-1 rounded-xl bg-stone-200/70 border border-stone-300/50 mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              billingCycle === 'monthly' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Facturation Mensuelle
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Annuel</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Colonne gauche : Options & Modules */}
        <div className="lg:col-span-2 space-y-8">
          {/* Étape 1 : Choix du modèle */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-serif font-medium text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 text-xs flex items-center justify-center font-sans">1</span>
              <span>Modèle de Boutique</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedTemplate('artisan')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTemplate === 'artisan' ? 'border-amber-700 bg-amber-50/40' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-serif font-medium text-stone-900 text-sm">Formule Atelier Artisanal</span>
                  <span className="text-xs font-semibold text-stone-900">
                    {billingCycle === 'monthly' ? '29 €/mois' : '290 €/an'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-sans">
                  Idéal pour créateurs, céramistes, maroquiniers et petites séries.
                </p>
              </div>

              <div
                onClick={() => setSelectedTemplate('boutique_pro')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTemplate === 'boutique_pro' ? 'border-amber-700 bg-amber-50/40' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-serif font-medium text-stone-900 text-sm">Formule Boutique Pro</span>
                  <span className="text-xs font-semibold text-stone-900">
                    {billingCycle === 'monthly' ? '49 €/mois' : '490 €/an'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-sans">
                  Volume élevé, variantes avancées, multi-stocks et restauration.
                </p>
              </div>
            </div>
          </div>

          {/* Étape 2 : Vérification du sous-domaine *.woxxapp.de */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-serif font-medium text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 text-xs flex items-center justify-center font-sans">2</span>
              <span>Votre adresse Web instantanée</span>
            </h3>

            <div className="space-y-2">
              <div className="flex rounded-xl border border-stone-200 overflow-hidden focus-within:border-amber-700 transition-colors">
                <input
                  type="text"
                  value={subdomainInput}
                  onChange={(e) => setSubdomainInput(e.target.value)}
                  placeholder="mon-atelier"
                  className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none text-stone-900 font-sans"
                />
                <span className="px-4 py-2.5 bg-stone-100 text-stone-600 text-xs font-medium border-l border-stone-200 flex items-center">
                  .woxxapp.de
                </span>
              </div>

              {subdomainStatus.checking && (
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Vérification de la disponibilité...</span>
                </div>
              )}

              {subdomainStatus.available === true && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Super ! <strong>{subdomainStatus.fqdn}</strong> est libre et prêt à être déployé.</span>
                </div>
              )}

              {subdomainStatus.available === false && (
                <div className="flex items-center gap-2 text-xs text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{subdomainStatus.reason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Étape 3 : Sélection des modules additionnels */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-serif font-medium text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 text-xs flex items-center justify-center font-sans">3</span>
              <span>Modules & Options au choix</span>
            </h3>

            <div className="space-y-3">
              {modulesList.map((mod) => {
                const isChecked = selectedModules.includes(mod.code);
                const price = billingCycle === 'monthly' ? `${mod.priceMonthly.toFixed(2)} €/m` : `${mod.priceYearly.toFixed(2)} €/an`;

                return (
                  <div
                    key={mod.code}
                    onClick={() => toggleModule(mod.code)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked ? 'border-amber-700/80 bg-amber-50/30' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-amber-800 border-amber-800 text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-stone-900 text-sm font-sans">{mod.name}</span>
                          {mod.isCore && (
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
                              Recommandé
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 font-sans">{mod.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-stone-900 shrink-0 font-sans ml-4">
                      +{price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne droite : Récapitulatif & Panier */}
        <div className="bg-stone-900 text-stone-50 rounded-2xl p-6 shadow-lg space-y-6 sticky top-8">
          <div className="border-b border-stone-800 pb-4">
            <h4 className="font-serif font-medium text-lg text-white">Récapitulatif de votre commande</h4>
            <p className="text-xs text-stone-400 mt-1 font-sans">
              Déploiement K8s automatisé après validation
            </p>
          </div>

          <div className="space-y-3 text-xs font-sans text-stone-300">
            <div className="flex justify-between">
              <span>Boutique ({selectedTemplate === 'artisan' ? 'Atelier' : 'Pro'})</span>
              <span className="text-white font-medium">{basePrice.toFixed(2)} €</span>
            </div>

            {selectedModules.map((code) => {
              const mod = modulesList.find((m) => m.code === code);
              if (!mod) return null;
              const price = billingCycle === 'monthly' ? mod.priceMonthly : mod.priceYearly;
              return (
                <div key={code} className="flex justify-between pl-2 border-l border-stone-800">
                  <span className="truncate pr-2">{mod.name}</span>
                  <span className="text-white font-medium shrink-0">+{price.toFixed(2)} €</span>
                </div>
              );
            })}

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-400 pt-2 border-t border-stone-800 font-medium">
                <span>Remise appliquée (-{discountPercent}%)</span>
                <span>-{discountAmount.toFixed(2)} €</span>
              </div>
            )}
          </div>

          {/* Saisie code promo */}
          <div className="pt-2 border-t border-stone-800 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Code réduction"
                className="w-full px-3 py-1.5 rounded-lg bg-stone-800 text-xs text-white placeholder:text-stone-500 border border-stone-700 focus:outline-none"
              />
              <button
                onClick={applyPromo}
                className="px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-xs font-medium text-white transition-colors"
              >
                Appliquer
              </button>
            </div>
            {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}
          </div>

          {/* Totaux */}
          <div className="border-t border-stone-800 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-stone-300">
              <span>Total HT</span>
              <span className="font-semibold text-white">{totalHt.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-medium text-white">
              <span>Total TTC (TVA 20%)</span>
              <span className="text-amber-400 font-bold">{totalTtc.toFixed(2)} €</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!subdomainInput || !subdomainStatus.available) {
                alert('Veuillez renseigner un sous-domaine valide et disponible.');
                return;
              }
              alert(`Commande validée pour ${subdomainStatus.fqdn} ! Lancement du provisioning...`);
            }}
            className="w-full py-3.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-98"
          >
            <span>Commander & Déployer la Boutique</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paiement sécurisé WoxxPay • Hébergement K8s inclus</span>
          </div>
        </div>
      </div>
    </div>
  );
}
