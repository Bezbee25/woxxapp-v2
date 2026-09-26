'use client';

import React, { useState } from 'react';
import { ThemePreset } from './wizardTypes';
import { ShoppingBag, Star, CheckCircle, Smartphone, Monitor, ArrowRight, Phone, ShieldCheck } from 'lucide-react';

interface ThemePreviewCardProps {
  theme: ThemePreset;
  commerceName: string;
  subdomain: string;
}

export function ThemePreviewCard({ theme, commerceName, subdomain }: ThemePreviewCardProps) {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const displayName = commerceName.trim() || 'Mon Commerce';
  const displayDomain = subdomain ? `${subdomain}.woxxapp.de` : 'boutique.woxxapp.de';

  return (
    <div className="w-full bg-slate-900 border-2 border-slate-900 rounded-3xl overflow-hidden shadow-brutal-lg">
      {/* Barre de contrôle du simulateur */}
      <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="hidden sm:inline-block text-slate-400 font-mono text-[11px] ml-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 truncate max-w-xs">
            https://{displayDomain}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setDeviceView('desktop')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              deviceView === 'desktop'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ordinateur</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView('mobile')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              deviceView === 'mobile'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Zone d'affichage du site simulé */}
      <div className="p-3 sm:p-6 bg-slate-800/50 flex justify-center items-center min-h-[420px] transition-all duration-300">
        <div
          className={`w-full transition-all duration-300 rounded-2xl overflow-hidden border shadow-2xl ${
            deviceView === 'mobile' ? 'max-w-[340px]' : 'max-w-4xl'
          }`}
          style={{
            backgroundColor: theme.colors.bg,
            color: theme.colors.text,
            borderColor: theme.colors.secondary,
          }}
        >
          {/* Header & Navigation */}
          <header
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{
              backgroundColor: theme.colors.secondary,
              borderColor: 'rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{theme.icon}</span>
              <span className="font-black text-sm tracking-tight truncate max-w-[160px]">
                {displayName}
              </span>
            </div>

            {deviceView === 'desktop' ? (
              <div className="flex items-center gap-5 text-xs font-semibold opacity-90">
                <span className="hover:opacity-100 cursor-pointer">Accueil</span>
                <span className="hover:opacity-100 cursor-pointer">Catalogue</span>
                <span className="hover:opacity-100 cursor-pointer">Contact</span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm"
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: '#000000',
                  }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Panier (0)</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.accent, color: '#000000' }}
                >
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
            )}
          </header>

          {/* Hero Section */}
          <div
            className="px-5 py-8 sm:py-10 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${theme.colors.secondary} 0%, ${theme.colors.bg} 100%)`,
            }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-3 shadow-sm border border-black/5"
                 style={{ backgroundColor: theme.colors.accent, color: '#000000' }}>
              <Star className="w-3 h-3 fill-current" />
              {theme.name}
            </div>
            
            <h1 className="text-lg sm:text-2xl font-black mb-2 tracking-tight max-w-xl mx-auto leading-tight">
              Bienvenue chez {displayName}
            </h1>
            
            <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto mb-5 font-medium">
              {theme.sampleTagline}
            </p>

            <div className="flex justify-center gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                style={{
                  backgroundColor: theme.colors.accent,
                  color: '#000000',
                }}
              >
                <span>Découvrir nos produits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grille d'exemples de produits */}
          <div className="px-4 py-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider opacity-75">
                Produits Vedettes
              </h3>
              <span className="text-[11px] font-bold underline opacity-60">Voir tout</span>
            </div>

            <div className={`grid gap-3 ${deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-4'}`}>
              {theme.sampleProducts.map((prod, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border transition-all duration-200"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    borderColor: 'rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="relative h-28 sm:h-32 w-full bg-slate-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: theme.colors.accent, color: '#000000' }}
                    >
                      {prod.category}
                    </span>
                  </div>

                  <div className="p-3">
                    <h4 className="font-bold text-xs truncate mb-1">{prod.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-sm">
                        {prod.price.toFixed(2)} €
                      </span>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                        style={{
                          backgroundColor: theme.colors.accent,
                          color: '#000000',
                        }}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer & Réassurance */}
          <footer
            className="px-4 py-3 text-[11px] font-bold border-t flex flex-wrap items-center justify-between gap-2 opacity-75"
            style={{
              backgroundColor: theme.colors.secondary,
              borderColor: 'rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Paiements sécurisés WoxxPay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Prêt pour Kubernetes</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
