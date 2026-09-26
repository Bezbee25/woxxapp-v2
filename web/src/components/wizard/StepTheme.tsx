'use client';

import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Palette } from 'lucide-react';
import { WizardFormData } from './wizardTypes';
import { THEME_PRESETS } from './wizardConstants';
import { ThemePreviewCard } from './ThemePreviewCard';

interface StepThemeProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepTheme({ formData, updateFormData, onNext, onPrev }: StepThemeProps) {
  const currentTheme =
    THEME_PRESETS.find((t) => t.id === formData.themeId) || THEME_PRESETS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1">
          <Palette className="w-4 h-4 text-amber-600" />
          <span>Étape 2 sur 4 • Type de site & Thème visuel</span>
        </div>
        <p className="text-xs text-amber-800 font-medium">
          Choisissez l&apos;univers esthétique le plus adapté à votre activité. Vous pourrez personnaliser toutes les couleurs, photos et textes à tout moment.
        </p>
      </div>

      {/* Grille de sélection des thèmes */}
      <div>
        <label className="block text-xs font-black text-slate-900 mb-2 uppercase tracking-wider">
          Choisissez votre modèle de départ :
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEME_PRESETS.map((t) => {
            const isSelected = formData.themeId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => updateFormData({ themeId: t.id })}
                className={`cursor-pointer relative p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-amber-50/60 shadow-brutal-sm ring-2 ring-amber-400'
                    : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {t.badge}
                    </span>
                  </div>
                  <h4 className="font-black text-xs text-slate-900 leading-snug mb-1">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                    {t.description}
                  </p>
                </div>

                {/* Palette de couleurs */}
                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-200/60">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                    style={{ backgroundColor: t.colors.bg }}
                    title="Fond principal"
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                    style={{ backgroundColor: t.colors.secondary }}
                    title="Fond secondaire"
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                    style={{ backgroundColor: t.colors.accent }}
                    title="Accent"
                  />
                  <span className="text-[10px] font-bold text-slate-400 ml-auto">
                    {t.colors.accent}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Démo interactive en direct en dessous */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Aperçu de démonstration en direct :</span>
          </label>
          <span className="text-[11px] font-bold text-slate-500">
            Thème actif : <strong>{currentTheme.name}</strong>
          </span>
        </div>

        <ThemePreviewCard
          theme={currentTheme}
          commerceName={formData.commerceName}
          subdomain={formData.subdomain}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 font-bold text-xs text-slate-700 flex items-center gap-2 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-2xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 font-black text-sm text-slate-950 flex items-center gap-2 transition-all shadow-brutal-xs hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Continuer vers les modules & tarifs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
