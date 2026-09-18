'use client';

import React from 'react';
import { HeartHandshake, Check, ExternalLink } from 'lucide-react';
import { SectionMediaBackground } from './SectionMediaBackground';

export function ElisePartnerSection() {
  return (
    <section id="elise-moi" className="relative py-24 border-b-2 border-slate-900 overflow-hidden">
      <SectionMediaBackground
        src="/images/three_woman.webm"
        alt="Studio et accompagnement d'affaires Élise & Moi"
        gradient="from-rose-50/85 via-white/60 to-amber-50/80"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-md border-2 border-slate-900 rounded-3xl p-8 sm:p-12 shadow-brutal-lg relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black">
                <HeartHandshake className="w-4 h-4" />
                <span>Accompagnement & Setup Clé en Main</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Vous n'avez pas le temps de créer votre site ?<br />
                <span className="text-rose-600">Élise & Moi s'occupe de tout pour vous.</span>
              </h3>

              <p className="text-slate-600 text-base leading-relaxed font-medium">
                Confiez la mise en place de votre boutique à notre chargée d'affaires et Office Manager partenaire{' '}
                <strong className="text-slate-900 font-bold">Élise & Moi</strong> (
                <a
                  href="https://elise-et-moi.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-rose-600 hover:text-rose-700"
                >
                  elise-et-moi.fr
                </a>
                ). Une assistance humaine sur mesure, sur simple devis.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Mise en page & Design du thème à vos couleurs</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Saisie complète de vos articles & photos</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Onboarding Stripe & Validation bancaire</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Configuration de votre nom de domaine propre</span>
                </div>
              </div>
            </div>

            {/* CARTE PARTENAIRE */}
            <div className="lg:col-span-4 bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 text-center space-y-4 shadow-brutal-sm">
              <div className="w-full aspect-[16/9] rounded-xl bg-white border-2 border-slate-900 mx-auto shadow-brutal-xs overflow-hidden">
                <img
                  src="/images/elise-card.webp"
                  alt="Bannière Élise & Moi"
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div>
                <h4 className="font-black text-xl text-slate-900">Élise & Moi</h4>
                <p className="text-xs text-slate-500 font-medium">Chargée d'affaires & Gestion externalisée</p>
              </div>
              <a
                href="https://elise-et-moi.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm py-3 px-4 rounded-xl border-2 border-slate-900 shadow-brutal-sm hover:shadow-brutal transition"
              >
                <span>Consulter le site d'Élise</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
