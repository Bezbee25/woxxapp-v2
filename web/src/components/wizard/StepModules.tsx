'use client';

import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2, Info, Layers, Tag } from 'lucide-react';
import { WizardFormData, ModuleDefinition } from './wizardTypes';
import { MODULES_CATALOG } from './wizardConstants';
import { ModulePricingItem, TaxSettings, calculateModulesOrder } from '@/lib/modules-catalog';

interface StepModulesProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  pricingMap?: Record<string, ModulePricingItem>;
  taxSettings?: TaxSettings;
}

export function StepModules({
  formData,
  updateFormData,
  onNext,
  onPrev,
  pricingMap,
  taxSettings,
}: StepModulesProps) {
  const isYearly = formData.billingCycle === 'yearly';

  const getModulePrice = (mod: ModuleDefinition) => {
    const dyn = pricingMap?.[mod.code];
    const monthly = dyn && typeof dyn.priceMonthly === 'number' ? dyn.priceMonthly : mod.monthlyPrice;
    const yearly = dyn && typeof dyn.priceYearly === 'number' ? dyn.priceYearly : mod.yearlyPrice;
    return {
      monthly,
      yearly,
      activePrice: isYearly ? yearly : monthly,
      monthlyEquivalent: isYearly ? (yearly / 12).toFixed(1) : null,
    };
  };

  const toggleModule = (mod: ModuleDefinition) => {
    if (mod.isBase) return; // Le socle site_web ne peut être désactivé

    const isCurrentlySelected = formData.selectedModules.includes(mod.code);

    if (isCurrentlySelected) {
      // Retirer le module et les modules dépendants
      const toRemove = [mod.code];
      if (mod.code === 'ecommerce') {
        // Retirer aussi les modules qui nécessitent ecommerce
        MODULES_CATALOG.forEach((m) => {
          if (m.requiredModule === 'ecommerce') {
            toRemove.push(m.code);
          }
        });
      }
      updateFormData({
        selectedModules: formData.selectedModules.filter((c) => !toRemove.includes(c)),
      });
    } else {
      // Ajouter le module + son prérequis éventuel
      const toAdd = [mod.code];
      if (mod.requiredModule && !formData.selectedModules.includes(mod.requiredModule)) {
        toAdd.push(mod.requiredModule);
      }
      updateFormData({
        selectedModules: Array.from(new Set([...formData.selectedModules, ...toAdd])),
      });
    }
  };

  // Calcul du total avec les règles fiscales (ex: Franchise TVA ou SAS 20%)
  const allSelectedCodes = Array.from(new Set(['site_web', ...formData.selectedModules]));
  const orderCalc = calculateModulesOrder(
    allSelectedCodes,
    formData.billingCycle,
    pricingMap,
    taxSettings
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1">
          <Layers className="w-4 h-4 text-amber-600" />
          <span>Étape 3 sur 4 • Modules applicatifs & Tarifs transparents</span>
        </div>
        <p className="text-xs text-amber-800 font-medium">
          Activez uniquement les fonctionnalités nécessaires à votre activité. Tout est sans engagement et modifiable à tout moment depuis votre tableau de bord.
        </p>
      </div>

      {/* Toggle Facturation Mensuel / Annuel */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-900 rounded-2xl border-2 border-slate-900 shadow-brutal-sm">
          <button
            type="button"
            onClick={() => updateFormData({ billingCycle: 'monthly' })}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
              !isYearly
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Facturation Mensuelle
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ billingCycle: 'yearly' })}
            className={`px-5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              isYearly
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Facturation Annuelle</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white uppercase tracking-wider">
              2 mois offerts 🎉
            </span>
          </button>
        </div>
      </div>

      {/* Grille des modules */}
      <div className="grid sm:grid-cols-2 gap-3.5">
        {MODULES_CATALOG.map((mod) => {
          const isSelected = mod.isBase || formData.selectedModules.includes(mod.code);
          const { activePrice, monthlyEquivalent } = getModulePrice(mod);

          return (
            <div
              key={mod.code}
              onClick={() => toggleModule(mod)}
              className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-slate-900 bg-amber-50/50 shadow-brutal-xs ring-1 ring-amber-400'
                  : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 border border-slate-200">
                      {mod.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        {mod.stepName}
                      </span>
                      <h4 className="font-black text-xs text-slate-900 leading-snug">
                        {mod.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-slate-950">
                      {activePrice.toFixed(0)} €
                      <span className="text-[11px] font-bold text-slate-500">
                        {isYearly ? ' /an' : ' /mois'}
                      </span>
                    </div>
                    {monthlyEquivalent && (
                      <span className="text-[10px] font-bold text-emerald-600 block">
                        soit {monthlyEquivalent} €/mois
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium mb-3">
                  {mod.description}
                </p>

                {/* Badges de fonctionnalités */}
                <div className="space-y-1 pt-2 border-t border-slate-200/60">
                  {mod.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 flex items-center justify-between">
                {mod.isBase ? (
                  <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    Socle inclus d&apos;office
                  </span>
                ) : mod.requiredModule && !formData.selectedModules.includes(mod.requiredModule) ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Active aussi E-Commerce
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400">
                    {isSelected ? 'Cliquer pour retirer' : 'Cliquer pour activer'}
                  </span>
                )}

                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-amber-400'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthèse des tarifs en direct */}
      <div className="p-4 rounded-2xl bg-slate-950 text-white border-2 border-slate-900 shadow-brutal-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
            Récapitulatif de la sélection ({isYearly ? 'Annuel' : 'Mensuel'})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">
              {orderCalc.totalTtc.toFixed(2)} € <span className="text-xs text-slate-300 font-bold">TTC</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({orderCalc.totalHt.toFixed(2)} € HT {orderCalc.isVatExempt ? '• Exonéré TVA' : `+ ${orderCalc.totalVat.toFixed(2)} € TVA`})
            </span>
          </div>
          {orderCalc.isVatExempt && (
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              {orderCalc.legalNotice}
            </span>
          )}
        </div>

        <div className="text-right text-xs font-bold text-slate-300">
          <span className="block">
            {orderCalc.items.length} modules facturés
          </span>
          <span className="text-emerald-400 font-black text-[11px]">
            {isYearly ? 'Engagement annuel • Facturation unique' : 'Sans engagement • Résiliable à tout moment'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 font-bold text-xs text-slate-700 flex items-center gap-2 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au thème</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-2xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 font-black text-sm text-slate-950 flex items-center gap-2 transition-all shadow-brutal-xs hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Continuer vers le récapitulatif</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
