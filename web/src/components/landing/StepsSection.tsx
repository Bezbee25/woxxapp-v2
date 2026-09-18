'use client';

import React from 'react';
import { SectionMediaBackground } from './SectionMediaBackground';

export function StepsSection() {
  return (
    <section id="etapes" className="relative py-24 border-b-2 border-slate-900 overflow-hidden">
      <SectionMediaBackground
        src="/images/steps-bg.webm"
        alt="Créateur artisan travaillant sur son ordinateur"
        gradient="from-blue-50/85 via-white/50 to-slate-50/90"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest text-blue-700 uppercase bg-blue-100 px-3 py-1 rounded-full border border-blue-300 inline-block mb-3">
            Mise en route express
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Prêt en 4 étapes simples.
          </h2>
          <p className="text-slate-700 font-medium">De l'inscription à votre premier client en ligne.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/95 backdrop-blur-sm border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center font-black text-lg mb-4">
              1
            </div>
            <h3 className="font-black text-base mb-2">Choix du sous-domaine</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Indiquez le nom de votre commerce (ex: salon-lucie) pour réserver votre adresse en 30 secondes.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-300 border-2 border-slate-900 flex items-center justify-center font-black text-lg mb-4">
              2
            </div>
            <h3 className="font-black text-base mb-2">Paiement du Pack</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Réglez votre pack de base en toute sécurité par carte bancaire via Stripe.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-300 border-2 border-slate-900 flex items-center justify-center font-black text-lg mb-4">
              3
            </div>
            <h3 className="font-black text-base mb-2">Déploiement K8s (15s)</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Notre cluster Kubernetes crée automatiquement votre pod, votre base et votre certificat SSL.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-300 border-2 border-slate-900 flex items-center justify-center font-black text-lg mb-4">
              4
            </div>
            <h3 className="font-black text-base mb-2">Personnalisation</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Connectez-vous à votre interface pour ajouter vos horaires, vos photos et vos produits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
