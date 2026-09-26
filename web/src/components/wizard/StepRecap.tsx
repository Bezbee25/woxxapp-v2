'use client';

import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  Store,
  Globe,
  Palette,
  CheckCircle2,
  ShieldCheck,
  Rocket,
  CreditCard,
  Zap,
} from 'lucide-react';
import { WizardFormData } from './wizardTypes';
import { THEME_PRESETS, MODULES_CATALOG } from './wizardConstants';

interface StepRecapProps {
  formData: WizardFormData;
  onDeploy: () => void;
  onPrev: () => void;
  loading: boolean;
}

export function StepRecap({ formData, onDeploy, onPrev, loading }: StepRecapProps) {
  const isYearly = formData.billingCycle === 'yearly';
  const selectedTheme =
    THEME_PRESETS.find((t) => t.id === formData.themeId) || THEME_PRESETS[0];

  const activeModules = MODULES_CATALOG.filter(
    (m) => m.isBase || formData.selectedModules.includes(m.code)
  );

  const totalHT = activeModules.reduce(
    (sum, m) => sum + (isYearly ? m.yearlyPrice : m.monthlyPrice),
    0
  );
  const totalTVA = totalHT * 0.2;
  const totalTTC = totalHT + totalTVA;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Étape 4 sur 4 • Récapitulatif & Lancement</span>
        </div>
        <p className="text-xs text-amber-800 font-medium">
          Vérifiez les paramètres de votre boutique avant son déploiement automatique sur le cluster Kubernetes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Colonne Gauche : Identité & Thème */}
        <div className="space-y-4">
          {/* Identité */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-brutal-xs">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-slate-700" />
              <span>Votre Commerce & Adresse</span>
            </h3>

            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Nom commercial</span>
                <span className="text-sm font-black text-slate-950">
                  {formData.commerceName}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Adresse web (HTTPS)</span>
                <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 inline-block">
                  https://{formData.subdomain}.woxxapp.de
                </span>
              </div>

              {formData.customDomain && (
                <div>
                  <span className="text-[11px] text-slate-500 font-bold block">Domaine personnalisé</span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {formData.customDomain}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thème choisi */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-brutal-xs">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-700" />
              <span>Thème Graphique</span>
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-xl bg-slate-100 border border-slate-200">
                {selectedTheme.icon}
              </span>
              <div>
                <h4 className="font-black text-sm text-slate-950">
                  {selectedTheme.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedTheme.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400">Palette :</span>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: selectedTheme.colors.bg }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: selectedTheme.colors.secondary }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: selectedTheme.colors.accent }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Modules & Facturation */}
        <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-brutal-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Modules Activés ({activeModules.length})</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeModules.map((m) => {
                const price = isYearly ? m.yearlyPrice : m.monthlyPrice;
                return (
                  <div
                    key={m.code}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{m.icon}</span>
                      <span className="font-bold text-slate-900">{m.name}</span>
                    </div>
                    <span className="font-black text-slate-950">
                      {price.toFixed(0)} € {isYearly ? '/an' : '/mois'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total & Règlement */}
          <div className="mt-4 pt-4 border-t-2 border-slate-900 space-y-2">
            <div className="flex justify-between text-xs text-slate-600 font-bold">
              <span>Total HT ({isYearly ? 'Annuel' : 'Mensuel'}) :</span>
              <span>{totalHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 font-bold">
              <span>TVA (20%) :</span>
              <span>{totalTVA.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 pt-1 border-t border-slate-200">
              <span>Total à régler :</span>
              <span className="text-amber-600 text-lg">
                {totalTTC.toFixed(2)} € <span className="text-xs font-bold text-slate-500">TTC</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Déploiement immédiat & 14 jours d&apos;essai inclus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Bouton Déploiement */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className="px-5 py-2.5 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 font-bold text-xs text-slate-700 flex items-center gap-2 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modifier les modules</span>
        </button>

        <button
          type="button"
          onClick={onDeploy}
          disabled={loading}
          className="px-8 py-3.5 rounded-2xl border-2 border-slate-900 bg-emerald-400 hover:bg-emerald-300 font-black text-sm text-slate-950 flex items-center gap-2.5 transition-all shadow-brutal hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <Rocket className="w-5 h-5 text-slate-950" />
          <span>{loading ? 'Déploiement en cours...' : 'Confirmer et Déployer ma boutique 🚀'}</span>
        </button>
      </div>
    </div>
  );
}
