'use client';

import React, { useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { SectionMediaBackground } from './SectionMediaBackground';

export function ShowroomSection() {
  const [selectedDemoTab, setSelectedDemoTab] = useState<'zorea' | 'pizza' | 'mode'>('zorea');

  return (
    <section id="showroom" className="relative py-24 border-y-2 border-slate-900 overflow-hidden">
      <SectionMediaBackground
        src="/images/showroom-bg.webm"
        alt="Showroom de boutiques et commerces"
        gradient="from-slate-100/90 via-white/70 to-slate-100/90"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-black tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-3">
              Showroom en direct
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Voyez ce que nos commerçants ont entre les mains.
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm font-medium">
            Explorez la boutique en production <strong className="text-slate-900">zorea.fr</strong> et nos sites de démonstrations interactifs.
          </p>
        </div>

        {/* Onglets de sélection du Showroom */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setSelectedDemoTab('zorea')}
            className={`px-5 py-3 rounded-xl font-bold text-sm border-2 border-slate-900 transition flex items-center gap-2 ${
              selectedDemoTab === 'zorea' ? 'bg-amber-300 shadow-brutal -translate-y-0.5' : 'bg-white hover:bg-slate-100 shadow-brutal-sm'
            }`}
          >
            <span>💍 Zorea (Bijouterie d'Art)</span>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded">Site Client Réel</span>
          </button>
          <button
            onClick={() => setSelectedDemoTab('pizza')}
            className={`px-5 py-3 rounded-xl font-bold text-sm border-2 border-slate-900 transition flex items-center gap-2 ${
              selectedDemoTab === 'pizza' ? 'bg-amber-300 shadow-brutal -translate-y-0.5' : 'bg-white hover:bg-slate-100 shadow-brutal-sm'
            }`}
          >
            <span>🍕 Store Pizza (Restauration)</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Démo</span>
          </button>
          <button
            onClick={() => setSelectedDemoTab('mode')}
            className={`px-5 py-3 rounded-xl font-bold text-sm border-2 border-slate-900 transition flex items-center gap-2 ${
              selectedDemoTab === 'mode' ? 'bg-amber-300 shadow-brutal -translate-y-0.5' : 'bg-white hover:bg-slate-100 shadow-brutal-sm'
            }`}
          >
            <span>👗 Store Mode (Prêt-à-porter)</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Démo</span>
          </button>
        </div>

        {/* CONTENU ONGLET 1 : ZOREA (SITE CLIENT RÉEL) */}
        {selectedDemoTab === 'zorea' && (
          <div className="bg-slate-50 border-2 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-brutal-lg">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Boutique Client en Production (Référence)</span>
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Zorea — Bijouterie & Créations d'Art
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  Le site vitrine et e-commerce de référence. Galerie photo immersive haute définition, intégration vidéo d'ambiance en arrière-plan, catalogue complet avec variantes de pierres, tunnel de commande Stripe et suivi d'envoi SendCloud.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Modules Actifs</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">Vitrine + Vente + Stripe + Transport</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Temps de Chargement</p>
                    <p className="text-sm font-black text-emerald-600 mt-0.5">0.4s (Next.js SSR)</p>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="https://zorea.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex bg-slate-900 hover:bg-blue-600 text-white font-black text-sm px-8 py-4 rounded-xl border-2 border-slate-900 shadow-brutal-sm hover:shadow-brutal transition items-center justify-center gap-2"
                  >
                    <span>Visiter le site zorea.fr</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* VIDÉO / IMAGES DU SITE ZOREA */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-900 shadow-brutal bg-slate-900 aspect-video">
                  <video
                    src="https://zorea.fr/uploads/plage_zorea-1788631990644.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-lg border border-white/20">
                    Vidéo réelle en direct de zorea.fr
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-square bg-slate-100">
                    <img
                      src="https://zorea.fr/uploads/boucle_oreil_fleur_4-1784839877178-157423169.webp"
                      alt="Zorea Produit 1"
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-square bg-slate-100">
                    <img
                      src="https://zorea.fr/uploads/pos___lux-1785970922403-756944064.webp"
                      alt="Zorea Produit 2"
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-square bg-slate-100">
                    <img
                      src="https://zorea.fr/uploads/pos___sur_lin-1785849883728-221268803.webp"
                      alt="Zorea Produit 3"
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 2 : DEMO PIZZA */}
        {selectedDemoTab === 'pizza' && (
          <div className="bg-slate-50 border-2 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-brutal-lg">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                    Site de Démonstration Restauration
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Demo Pizza — Fast-Food & Restauration
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  Démonstration pour pizzerias, snacks, boulangeries et traiteurs. Prise de commande ultra-rapide sur mobile, choix des suppléments/ingrédients, sélection du créneau de retrait en boutique ou livraison.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Fonctionnalité Clé</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">Click & Collect minute</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Alertes Gérant</p>
                    <p className="text-sm font-black text-amber-600 mt-0.5">Sonnerie nouvelle commande</p>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="https://demo-pizza.woxxapp.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex bg-slate-900 hover:bg-blue-600 text-white font-black text-sm px-8 py-4 rounded-xl border-2 border-slate-900 shadow-brutal-sm hover:shadow-brutal transition items-center justify-center gap-2"
                  >
                    <span>Visiter la démo demo-pizza</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* VIDÉO DU SITE PIZZA */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-900 shadow-brutal bg-slate-900 aspect-video">
                  <video
                    src="https://store-pizza.woxxapp.de/uploads/pizza-1788686879367.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-lg border border-white/20">
                    Vidéo réelle en direct de demo-pizza
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-video bg-slate-900">
                    <video
                      src="https://store-pizza.woxxapp.de/uploads/pizza2-1788698812288.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-video bg-slate-900">
                    <video
                      src="https://store-pizza.woxxapp.de/uploads/cafe-1788701839398.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 3 : DEMO MODE */}
        {selectedDemoTab === 'mode' && (
          <div className="bg-slate-50 border-2 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-brutal-lg">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-900 text-xs font-black px-3 py-1 rounded-full border border-blue-300">
                    Site de Démonstration Mode
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Demo Mode — Prêt-à-porter & Chaussures
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  Démonstration pour boutiques textiles. Gestion des tailles (S, M, L, XL), des couleurs, suivi précis des stocks pour éviter les ruptures, et génération d'étiquettes d'expédition SendCloud (Colissimo & Mondial Relay).
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Transport Connecté</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">SendCloud / WoxxShip</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Paiements Pris en Charge</p>
                    <p className="text-sm font-black text-blue-600 mt-0.5">CB / Apple Pay / Klarna</p>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="https://demo-mode.woxxapp.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex bg-slate-900 hover:bg-blue-600 text-white font-black text-sm px-8 py-4 rounded-xl border-2 border-slate-900 shadow-brutal-sm hover:shadow-brutal transition items-center justify-center gap-2"
                  >
                    <span>Visiter la démo demo-mode</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* IMAGES DU SITE MODE */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl overflow-hidden border-2 border-slate-900 shadow-brutal aspect-video bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
                    alt="Store Mode Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-video bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=80"
                      alt="Store Mode 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-video bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80"
                      alt="Store Mode 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
