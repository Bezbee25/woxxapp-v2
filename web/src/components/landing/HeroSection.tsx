'use client';

import React from 'react';
import { Sparkles, ArrowRight, Play, Lock, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';
import { SectionMediaBackground } from './SectionMediaBackground';
import { useAuth } from '@/lib/auth-context';

export function HeroSection() {
  const { openAuthModal } = useAuth();

  return (
    <section className="relative w-full py-20 sm:py-28 border-b-2 border-slate-900 overflow-hidden">
      <SectionMediaBackground
        src="/images/hero-bg.webm"
        alt="Commerçant artisan et technologie moderne"
        gradient="from-amber-50/75 via-white/50 to-[#FFFDF9]/90"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-slate-900 shadow-brutal-sm text-slate-950 text-xs font-black mb-8">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>La technologie moderne au service des artisans & commerçants</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08] mb-8 drop-shadow-sm">
          Votre commerce en ligne,<br />
          <span className="relative inline-block mt-2">
            <span className="bg-amber-300 text-slate-950 px-4 py-1 border-2 border-slate-900 shadow-brutal rounded-2xl rotate-[-1deg] inline-block">
              prêt en 10 minutes.
            </span>
          </span>
        </h1>

        <p className="text-lg sm:text-2xl text-slate-900 leading-relaxed font-semibold max-w-3xl mx-auto mb-12">
          Artisans, créateurs, restaurateurs, coiffeurs : obtenez un site vitrine ultra-rapide avec Click & Collect par défaut, et activez la vente en ligne ou le transport à la carte.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <button
            onClick={() => openAuthModal('register')}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-base sm:text-lg font-black px-8 py-4 rounded-2xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition active:translate-x-0 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Lancer ma boutique</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#showroom"
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 text-base sm:text-lg font-bold px-8 py-4 rounded-2xl border-2 border-slate-900 shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-900" />
            <span>Explorer les démos réelles</span>
          </a>
        </div>

        {/* Badges de réassurance clairs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t-2 border-slate-300/80">
          <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs text-left">
            <p className="text-xs font-black text-amber-700 flex items-center gap-1.5"><Lock className="w-4 h-4" /> Engagement 1 an</p>
            <p className="text-[11px] text-slate-600 font-medium">Formule annuelle sérénité</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs text-left">
            <p className="text-xs font-black text-emerald-700 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> SSL inclus</p>
            <p className="text-[11px] text-slate-600 font-medium">Paiement HTTPS sécurisé</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs text-left">
            <p className="text-xs font-black text-blue-700 flex items-center gap-1.5"><Zap className="w-4 h-4" /> K8s en 15s</p>
            <p className="text-[11px] text-slate-600 font-medium">Déploiement automatique</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs text-left">
            <p className="text-xs font-black text-purple-700 flex items-center gap-1.5"><HeartHandshake className="w-4 h-4" /> Sans engagement tiers</p>
            <p className="text-[11px] text-slate-600 font-medium">Données 100% vôtres</p>
          </div>
        </div>
      </div>
    </section>
  );
}
