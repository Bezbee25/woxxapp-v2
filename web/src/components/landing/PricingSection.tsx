'use client';

import React, { useState } from 'react';
import { Store, ShoppingBag, Truck, UtensilsCrossed, Check, ArrowRight } from 'lucide-react';
import { SectionMediaBackground } from './SectionMediaBackground';
import { useAuth } from '@/lib/auth-context';

export function PricingSection() {
  const { openAuthModal } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [optEcommerce, setOptEcommerce] = useState(true);
  const [optShipping, setOptShipping] = useState(false);
  const optFoodDelivery = false;

  // Calcul du total en direct
  const basePrice = isAnnual ? 150 : 15;
  const ecommercePrice = optEcommerce ? (isAnnual ? 300 : 30) : 0;
  const shippingPrice = optShipping ? (isAnnual ? 300 : 30) : 0;
  const foodPrice = optFoodDelivery ? (isAnnual ? 300 : 30) : 0;
  const totalPrice = basePrice + ecommercePrice + shippingPrice + foodPrice;

  return (
    <section id="tarifs" className="relative py-24 border-b-2 border-slate-900 overflow-hidden">
      <SectionMediaBackground
        src="/images/pricing.webm"
        alt="Boutique et commerce soigné"
        gradient="from-emerald-50/85 via-white/55 to-[#FFFDF9]/90"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mb-3">
            Tarification Atlassian Modulaire
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Payez uniquement ce dont vous avez besoin.
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-medium">
            Un socle indispensable à tarif mini avec engagement 1 an, complété par les modules de votre choix activables à tout moment.
          </p>

          {/* Toggle Switch Annuel / Mensuel */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white p-2 rounded-2xl border-2 border-slate-900 shadow-brutal-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition ${
                !isAnnual ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Facturation Mensuelle
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 ${
                isAnnual ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <span>Facturation Annuelle</span>
              <span className="bg-emerald-400 text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded-md">-17%</span>
            </button>
          </div>
        </div>

        {/* GRILLE DES MODULES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
          {/* CARTE 1 : SOCLE VITRINE */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-brutal flex flex-col justify-between relative">
            <div className="absolute -top-3 left-6 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-slate-900">
              Socle Inclus d'Office
            </div>

            <div>
              <div className="flex items-center gap-2 mt-2 mb-3">
                <Store className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-black">Site Vitrine & Retrait</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-6">Pour présenter vos activités et recevoir vos commandes.</p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{isAnnual ? '150 €' : '15 €'}</span>
                  <span className="text-xs font-bold text-slate-500">{isAnnual ? '/ an' : '/ mois'}</span>
                </div>
                <p className="text-[11px] text-amber-700 font-bold mt-1">Engagement 1 an</p>
              </div>

              <ul className="space-y-3 text-xs font-medium text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Site responsive mobile & PC</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Horaires, adresse et informations d'accès</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Click & Collect sans paiement</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Sous-domaine *.woxxapp.de</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Hébergement cloud K8s & SSL</li>
              </ul>
            </div>

            <div className="bg-emerald-50 text-emerald-900 text-xs font-bold py-2.5 px-3 rounded-xl text-center border border-emerald-200">
              ✓ Inclus dans toute commande
            </div>
          </div>

          {/* CARTE 2 : VENTE DE PRODUITS + STRIPE */}
          <div
            onClick={() => setOptEcommerce(!optEcommerce)}
            className={`border-2 border-slate-900 rounded-2xl p-6 transition cursor-pointer flex flex-col justify-between ${
              optEcommerce ? 'bg-blue-50/80 shadow-brutal' : 'bg-white shadow-brutal-sm opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-black">Vente de Produits</h3>
                </div>
                <input
                  type="checkbox"
                  checked={optEcommerce}
                  onChange={() => {}}
                  className="w-5 h-5 rounded border-2 border-slate-900 text-blue-600 focus:ring-0"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium mb-6">Catalogue en ligne avec encaissement direct par carte.</p>

              <div className="mb-6 pb-6 border-b border-slate-200/60">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">+{isAnnual ? '300 €' : '30 €'}</span>
                  <span className="text-xs font-bold text-slate-500">{isAnnual ? '/ an' : '/ mois'}</span>
                </div>
                <p className="text-[11px] text-blue-700 font-bold mt-1">+ 2% par transaction Stripe</p>
              </div>

              <ul className="space-y-3 text-xs font-medium text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Catalogue & fiches produits illimitées</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Gestion des stocks & variantes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Paiement CB, Apple Pay & Google Pay</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> WoxxPay / Stripe Connect sécurisé</li>
              </ul>
            </div>

            <button className={`w-full py-2.5 text-xs font-black rounded-xl border-2 border-slate-900 transition ${optEcommerce ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {optEcommerce ? '✓ Module Ajouté' : '+ Ajouter cette option'}
            </button>
          </div>

          {/* CARTE 3 : TRANSPORT & EXPÉDITION */}
          <div
            onClick={() => setOptShipping(!optShipping)}
            className={`border-2 border-slate-900 rounded-2xl p-6 transition cursor-pointer flex flex-col justify-between ${
              optShipping ? 'bg-indigo-50/80 shadow-brutal' : 'bg-white shadow-brutal-sm opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-black">Transport & Envoi</h3>
                </div>
                <input
                  type="checkbox"
                  checked={optShipping}
                  onChange={() => {}}
                  className="w-5 h-5 rounded border-2 border-slate-900 text-indigo-600 focus:ring-0"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium mb-6">Expédiez partout en France et en Europe en quelques clics.</p>

              <div className="mb-6 pb-6 border-b border-slate-200/60">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">+{isAnnual ? '300 €' : '30 €'}</span>
                  <span className="text-xs font-bold text-slate-500">{isAnnual ? '/ an' : '/ mois'}</span>
                </div>
                <p className="text-[11px] text-indigo-700 font-bold mt-1">Nécessite le module Vente</p>
              </div>

              <ul className="space-y-3 text-xs font-medium text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0" /> SendCloud / WoxxShip intégré</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0" /> Colissimo, Mondial Relay, Chronopost</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0" /> Calcul automatique des frais de port</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0" /> Impression des étiquettes en 1 clic</li>
              </ul>
            </div>

            <button className={`w-full py-2.5 text-xs font-black rounded-xl border-2 border-slate-900 transition ${optShipping ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {optShipping ? '✓ Module Ajouté' : '+ Ajouter cette option'}
            </button>
          </div>

          {/* CARTE 4 : RESTAURATION EXPRESS */}
          <div className="bg-slate-100/90 border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm flex flex-col justify-between opacity-85 relative">
            <div className="absolute -top-3 right-6 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-slate-900 shadow-xs">
              En cours de dev
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-black text-slate-900">Restauration Express</h3>
                </div>
                <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Bientôt
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mb-6">Pour snacks, pizzerias et restaurants avec livraison directe et tickets cuisine.</p>

              <div className="mb-6 pb-6 border-b border-slate-300/80">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">Bientôt disponible</span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-1">Intégration Deliveroo & UberEats</p>
              </div>

              <ul className="space-y-3 text-xs font-medium text-slate-500 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400 shrink-0" /> Passerelle UberEats / Deliveroo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400 shrink-0" /> Impression des tickets en cuisine</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400 shrink-0" /> Gestion des temps de préparation</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400 shrink-0" /> Alertes sonores nouvelle commande</li>
              </ul>
            </div>

            <div className="w-full py-2.5 text-xs font-black rounded-xl border-2 border-slate-400 bg-slate-200 text-slate-600 text-center cursor-not-allowed">
              🚀 En cours de développement
            </div>
          </div>
        </div>

        {/* TOTAL RÉCAPITULATIF DU SIMULATEUR */}
        <div className="bg-slate-900 text-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-brutal-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Votre Configuration Personnalisée</span>
            <h4 className="text-2xl sm:text-3xl font-black mt-1">
              Total estimé : <span className="text-amber-400">{totalPrice} €</span>{' '}
              <span className="text-xs font-normal text-slate-400">{isAnnual ? 'HT / an' : 'HT / mois'} (Engagement 1 an)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Comprend le socle Vitrine {optEcommerce ? '+ Vente en ligne' : ''} {optShipping ? '+ Transport' : ''} {optFoodDelivery ? '+ Restauration' : ''}.
            </p>
          </div>

          <button
            onClick={() => openAuthModal('register')}
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base px-8 py-4 rounded-2xl border-2 border-white shadow-brutal-sm hover:shadow-brutal transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Commander et déployer mon site</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
