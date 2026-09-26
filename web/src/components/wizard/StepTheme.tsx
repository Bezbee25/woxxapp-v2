'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Palette, Search } from 'lucide-react';
import { WizardFormData, ThemePreset } from './wizardTypes';
import { THEME_PRESETS } from './wizardConstants';
import { ThemePreviewCard } from './ThemePreviewCard';

interface StepThemeProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

type CategoryFilter = 'all' | 'food' | 'fashion' | 'beauty' | 'craft' | 'services';

export function StepTheme({ formData, updateFormData, onNext, onPrev }: StepThemeProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentTheme =
    THEME_PRESETS.find((t) => t.id === formData.themeId) || THEME_PRESETS[0];

  const categories = [
    { id: 'all', label: 'Tous', count: THEME_PRESETS.length, icon: '✨' },
    { id: 'food', label: 'Restauration & Food', count: THEME_PRESETS.filter((t) => t.category === 'food').length, icon: '🍽️' },
    { id: 'fashion', label: 'Mode & Luxe', count: THEME_PRESETS.filter((t) => t.category === 'fashion').length, icon: '👗' },
    { id: 'beauty', label: 'Beauté & Soins', count: THEME_PRESETS.filter((t) => t.category === 'beauty').length, icon: '🌿' },
    { id: 'craft', label: 'Maison & Artisanat', count: THEME_PRESETS.filter((t) => t.category === 'craft').length, icon: '🏡' },
    { id: 'services', label: 'Services & RDV', count: THEME_PRESETS.filter((t) => t.category === 'services').length, icon: '📅' },
  ];

  const filteredThemes = useMemo(() => {
    return THEME_PRESETS.filter((theme) => {
      const matchCat = selectedCategory === 'all' || theme.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1">
          <Palette className="w-4 h-4 text-amber-600" />
          <span>Étape 2 sur 4 • Type d&apos;activité & Modèle graphique</span>
        </div>
        <p className="text-xs text-amber-800 font-medium">
          Choisissez l&apos;univers esthétique le plus adapté à votre activité parmi nos 18 modèles métiers. Toutes les couleurs, typographies et produits d&apos;exemples sont personnalisables à tout moment.
        </p>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isCatActive
                      ? 'bg-slate-900 text-amber-400 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isCatActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Grille des thèmes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1">
          {filteredThemes.map((t) => {
            const isSelected = formData.themeId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => updateFormData({ themeId: t.id })}
                className={`cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-amber-50/70 shadow-brutal-xs ring-2 ring-amber-400 scale-[1.01]'
                    : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 truncate">
                      {t.badge}
                    </span>
                  </div>
                  <h4 className="font-black text-xs text-slate-900 leading-snug mb-1 truncate">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2">
                    {t.description}
                  </p>
                </div>

                {/* Palette */}
                <div className="flex items-center gap-1 mt-2.5 pt-1.5 border-t border-slate-100">
                  <div className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: t.colors.bg }} />
                  <div className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: t.colors.secondary }} />
                  <div className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: t.colors.accent }} />
                  <span className="text-[9px] font-mono text-slate-400 ml-auto truncate">{t.colors.accent}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Démo interactive en direct en dessous */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Démo interactive du modèle sélectionné :</span>
          </label>
          <span className="text-[11px] font-bold text-slate-600 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
            {currentTheme.icon} <strong>{currentTheme.name}</strong>
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
          <span>Continuer vers les modules ({currentTheme.name})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
