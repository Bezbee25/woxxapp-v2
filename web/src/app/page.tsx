"use client";

import React, { useState } from "react";
import { 
  Check, 
  Store, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight, 
  Sparkles,
  Truck,
  CreditCard,
  ShoppingBag,
  UtensilsCrossed,
  Globe,
  Headphones,
  ChevronDown,
  Play,
  Clock,
  Laptop,
  Smartphone,
  Star,
  Plus,
  HelpCircle,
  Scissors,
  Coffee,
  HeartHandshake,
  Gem,
  CalendarCheck,
  Award,
  Lock
} from "lucide-react";

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedDemoTab, setSelectedDemoTab] = useState<"zorea" | "pizza" | "mode">("zorea");

  // Options du simulateur de prix interactif
  const [optEcommerce, setOptEcommerce] = useState(true);
  const [optShipping, setOptShipping] = useState(false);
  const [optFoodDelivery, setOptFoodDelivery] = useState(false);

  // Calcul du total en direct
  const basePrice = isAnnual ? 150 : 15;
  const ecommercePrice = optEcommerce ? (isAnnual ? 300 : 30) : 0;
  const shippingPrice = optShipping ? (isAnnual ? 300 : 30) : 0;
  const foodPrice = optFoodDelivery ? (isAnnual ? 300 : 30) : 0;
  const totalPrice = basePrice + ecommercePrice + shippingPrice + foodPrice;

  const faqs = [
    {
      q: "Quel est l'engagement pour mon abonnement ?",
      a: "L'abonnement comporte un engagement d'un an (1 an), payable en une fois à tarif préférentiel (150 € / an pour le socle vitrine) ou mensualisé à 15 € / mois."
    },
    {
      q: "Est-ce que je peux ajouter des options (Vente en ligne, Transport) en cours d'année ?",
      a: "Oui, tout à fait ! Vous pouvez démarrer avec le pack Vitrine et activer le module E-commerce Stripe ou l'expédition SendCloud à tout moment depuis votre espace d'administration."
    },
    {
      q: "Je ne suis pas du tout technique, est-ce fait pour moi ?",
      a: "C'est exactement conçu pour vous. Si vous savez envoyer un message sur WhatsApp, vous saurez gérer votre boutique en ligne. Aucune ligne de code n'est nécessaire."
    },
    {
      q: "C'est quoi la commission de 2% sur les paiements par carte ?",
      a: "Sur chaque vente payée par carte bancaire via le système WoxxPay / Stripe Connect, nous prélevons 2% pour couvrir le traitement technique bancaire sécurisé. Le reste est versé directement sur votre compte bancaire."
    },
    {
      q: "Puis-je utiliser mon propre nom de domaine (ex: www.mon-salon.fr) ?",
      a: "Oui ! Chaque boutique reçoit d'office une adresse *.woxxapp.de sécurisée, et nous pouvons configurer votre propre nom de domaine personnalisé sur demande."
    },
    {
      q: "En quoi consiste l'accompagnement par Élise & Moi ?",
      a: "Élise & Moi prend en charge de A à Z la saisie de votre catalogue de produits, la mise en page de votre charte graphique, et vous guide pas à pas lors d'une session de formation personnalisée."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 font-sans antialiased selection:bg-amber-300 selection:text-slate-900">
      {/* ── BANDEAU D'ANNONCE TOP ─────────────────────────────────── */}
      <div className="bg-slate-900 text-white text-xs font-medium py-2.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">Nouveau</span>
        <span>Infrastructure Kubernetes 2026 : Déploiement instantané de votre boutique en moins de 15 secondes.</span>
      </div>

      {/* ── 1. NAVBAR ────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b-2 border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400 border-2 border-slate-900 shadow-brutal-sm flex items-center justify-center font-black text-xl">
              🏪
            </div>
            <div>
              <span className="font-black text-2xl tracking-tight text-slate-900 block leading-none">
                WOXX<span className="text-blue-600">APP</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plateforme Commerçants</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-700">
            <a href="#showroom" className="hover:text-blue-600 transition flex items-center gap-1.5">
              <span>Showroom Démo</span>
              <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Live</span>
            </a>
            <a href="#tarifs" className="hover:text-blue-600 transition">Grille Tarifaire</a>
            <a href="#elise-moi" className="hover:text-blue-600 transition flex items-center gap-1.5">
              <span>Élise & Moi</span>
              <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Accompagnement</span>
            </a>
            <a href="#etapes" className="hover:text-blue-600 transition">Démarrage en 4 étapes</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="/login" 
              className="hidden sm:inline-block text-sm font-bold text-slate-800 hover:text-blue-600 px-4 py-2.5 rounded-xl transition"
            >
              Espace Client
            </a>
            <a 
              href="#tarifs" 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-black px-5 py-2.5 rounded-xl border-2 border-slate-900 shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition active:translate-x-0 active:translate-y-0"
            >
              Créer ma boutique →
            </a>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO SECTION PLEINE LARGEUR (IMAGE EN BACKGROUND NETTE ET CLAIRE) ── */}
      <section className="relative w-full py-20 sm:py-28 border-b-2 border-slate-900 overflow-hidden bg-slate-100">
        {/* Image de fond pleine largeur : commerçant et numérique en boutique lumineuse */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=2400&auto=format&fit=crop&q=80" 
            alt="Commerçant artisan et technologie moderne" 
            className="w-full h-full object-cover object-center"
          />
          {/* Léger voile translucide clair pour faire ressortir l'image tout en garantissant un contraste parfait */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-[#FFFDF9]/90 backdrop-blur-[1px]"></div>
        </div>

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
            <a 
              href="#tarifs" 
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-base sm:text-lg font-black px-8 py-4 rounded-2xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition active:translate-x-0 active:translate-y-0 flex items-center justify-center gap-3"
            >
              <span>Lancer ma boutique</span>
              <ArrowRight className="w-5 h-5" />
            </a>
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
              <p className="text-xs font-black text-rose-700 flex items-center gap-1.5"><HeartHandshake className="w-4 h-4" /> Support dédié</p>
              <p className="text-[11px] text-slate-600 font-medium">Élise & Moi partenaire</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SHOWROOM (ZOREA EN SITE RÉFÉRENCE + DEMO PIZZA & MODE) ── */}
      <section id="showroom" className="py-24 bg-white border-y-2 border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              onClick={() => setSelectedDemoTab("zorea")}
              className={`px-5 py-3 rounded-xl font-bold text-sm border-2 border-slate-900 transition flex items-center gap-2 ${selectedDemoTab === "zorea" ? "bg-amber-300 shadow-brutal -translate-y-0.5" : "bg-white hover:bg-slate-100 shadow-brutal-sm"}`}
            >
              <span>💍 Zorea (Bijouterie d'Art)</span>
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded">Site Client Réel</span>
            </button>
            <button 
              onClick={() => setSelectedDemoTab("pizza")}
              className={`px-5 py-3 rounded-xl font-bold text-sm border-2 border-slate-900 transition flex items-center gap-2 ${selectedDemoTab === "pizza" ? "bg-amber-300 shadow-brutal -translate-y-0.5" : "bg-white hover:bg-slate-100 shadow-brutal-sm"}`}
            >
              <span>🍕 Store Pizza (Restauration)</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Démo</span>
            </button>
            <button 
              onClick={() => setSelectedDemoTab("mode")}
              className={`px-5 py-3 rounded-xl font-bold text-sm border-2 border-slate-900 transition flex items-center gap-2 ${selectedDemoTab === "mode" ? "bg-amber-300 shadow-brutal -translate-y-0.5" : "bg-white hover:bg-slate-100 shadow-brutal-sm"}`}
            >
              <span>👗 Store Mode (Prêt-à-porter)</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Démo</span>
            </button>
          </div>

          {/* CONTENU ONGLET 1 : ZOREA (SITE CLIENT RÉEL) */}
          {selectedDemoTab === "zorea" && (
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

                {/* VRAIE VIDÉO / IMAGES DU SITE ZOREA */}
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

          {/* CONTENU ONGLET 2 : DEMO PIZZA (DÉMO) */}
          {selectedDemoTab === "pizza" && (
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
                      href="https://store-pizza.woxxapp.de" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex bg-slate-900 hover:bg-blue-600 text-white font-black text-sm px-8 py-4 rounded-xl border-2 border-slate-900 shadow-brutal-sm hover:shadow-brutal transition items-center justify-center gap-2"
                    >
                      <span>Visiter la démo store-pizza</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* VRAIE VIDÉO DU SITE PIZZA */}
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
                      Vidéo réelle en direct de store-pizza
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-video bg-slate-900">
                      <video 
                        src="https://store-pizza.woxxapp.de/uploads/pizza2-1788698812288.webm" 
                        autoPlay loop muted playsInline className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-brutal-sm aspect-video bg-slate-900">
                      <video 
                        src="https://store-pizza.woxxapp.de/uploads/cafe-1788701839398.webm" 
                        autoPlay loop muted playsInline className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENU ONGLET 3 : DEMO MODE (DÉMO) */}
          {selectedDemoTab === "mode" && (
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
                      href="https://store-mode.woxxapp.de" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex bg-slate-900 hover:bg-blue-600 text-white font-black text-sm px-8 py-4 rounded-xl border-2 border-slate-900 shadow-brutal-sm hover:shadow-brutal transition items-center justify-center gap-2"
                    >
                      <span>Visiter la démo store-mode</span>
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

      {/* ── 4. SECTION ÉLISE & MOI (AVEC LOGO OFFICIEL D'ÉLISE) ────── */}
      <section id="elise-moi" className="py-20 bg-amber-50/70 border-b-2 border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 sm:p-12 shadow-brutal-lg relative overflow-hidden">
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

                <p className="text-slate-600 text-base leading-relaxed">
                  Confiez la mise en place de votre boutique à notre chargée d'affaires et Office Manager partenaire <strong className="text-slate-900 font-bold">Élise & Moi</strong> (<a href="https://elise-et-moi.fr/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-rose-600 hover:text-rose-700">elise-et-moi.fr</a>). Une assistance humaine sur mesure, sur simple devis.
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

              {/* CARTE PARTENAIRE AVEC LOGO & PHOTO RÉELLE D'ÉLISE & MOI */}
              <div className="lg:col-span-4 bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 text-center space-y-4 shadow-brutal-sm">
                <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-900 mx-auto p-2 shadow-brutal-xs flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://elise-et-moi.fr/assets/penpot/hero-logo.webp" 
                    alt="Logo Élise & Moi" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://elise-et-moi.fr/favicon.svg";
                    }}
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

      {/* ── 5. SIMULATEUR DE TARIFS ATLASSIAN (ENGAGEMENT 1 AN) ───── */}
      <section id="tarifs" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest text-emerald-700 uppercase bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mb-3">
            Tarification Atlassian Modulaire
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Payez uniquement ce dont vous avez besoin.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Un socle indispensable à tarif mini avec engagement 1 an, complété par les modules de votre choix activables à tout moment.
          </p>

          {/* Toggle Switch Annuel / Mensuel */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white p-2 rounded-2xl border-2 border-slate-900 shadow-brutal-sm">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition ${!isAnnual ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Facturation Mensuelle (15 €/mois)
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 ${isAnnual ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <span>Facturation Annuelle (150 €/an)</span>
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
                  <span className="text-4xl font-black text-slate-900">{isAnnual ? "150 €" : "15 €"}</span>
                  <span className="text-xs font-bold text-slate-500">{isAnnual ? "/ an" : "/ mois"}</span>
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
            className={`border-2 border-slate-900 rounded-2xl p-6 transition cursor-pointer flex flex-col justify-between ${optEcommerce ? 'bg-blue-50/50 shadow-brutal' : 'bg-white shadow-brutal-sm opacity-80 hover:opacity-100'}`}
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
                  <span className="text-4xl font-black text-slate-900">+{isAnnual ? "300 €" : "30 €"}</span>
                  <span className="text-xs font-bold text-slate-500">{isAnnual ? "/ an" : "/ mois"}</span>
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
              {optEcommerce ? "✓ Module Ajouté" : "+ Ajouter cette option"}
            </button>
          </div>

          {/* CARTE 3 : TRANSPORT & EXPÉDITION */}
          <div 
            onClick={() => setOptShipping(!optShipping)}
            className={`border-2 border-slate-900 rounded-2xl p-6 transition cursor-pointer flex flex-col justify-between ${optShipping ? 'bg-indigo-50/50 shadow-brutal' : 'bg-white shadow-brutal-sm opacity-80 hover:opacity-100'}`}
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
                  <span className="text-4xl font-black text-slate-900">+{isAnnual ? "300 €" : "30 €"}</span>
                  <span className="text-xs font-bold text-slate-500">{isAnnual ? "/ an" : "/ mois"}</span>
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
              {optShipping ? "✓ Module Ajouté" : "+ Ajouter cette option"}
            </button>
          </div>

          {/* CARTE 4 : RESTAURATION EXPRESS */}
          <div 
            onClick={() => setOptFoodDelivery(!optFoodDelivery)}
            className={`border-2 border-slate-900 rounded-2xl p-6 transition cursor-pointer flex flex-col justify-between ${optFoodDelivery ? 'bg-rose-50/50 shadow-brutal' : 'bg-white shadow-brutal-sm opacity-80 hover:opacity-100'}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-rose-600" />
                  <h3 className="text-lg font-black">Restauration Express</h3>
                </div>
                <input 
                  type="checkbox" 
                  checked={optFoodDelivery} 
                  onChange={() => {}} 
                  className="w-5 h-5 rounded border-2 border-slate-900 text-rose-600 focus:ring-0" 
                />
              </div>
              <p className="text-xs text-slate-500 font-medium mb-6">Pour snacks, pizzerias et restaurants avec livraison directe.</p>

              <div className="mb-6 pb-6 border-b border-slate-200/60">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">+{isAnnual ? "300 €" : "30 €"}</span>
                  <span className="text-xs font-bold text-slate-500">{isAnnual ? "/ an" : "/ mois"}</span>
                </div>
                <p className="text-[11px] text-rose-700 font-bold mt-1">Idéal métiers de bouche</p>
              </div>

              <ul className="space-y-3 text-xs font-medium text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600 shrink-0" /> Passerelle UberEats / Deliveroo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600 shrink-0" /> Impression des tickets en cuisine</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600 shrink-0" /> Gestion des temps de préparation</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600 shrink-0" /> Alertes sonores nouvelle commande</li>
              </ul>
            </div>

            <button className={`w-full py-2.5 text-xs font-black rounded-xl border-2 border-slate-900 transition ${optFoodDelivery ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {optFoodDelivery ? "✓ Module Ajouté" : "+ Ajouter cette option"}
            </button>
          </div>
        </div>

        {/* TOTAL RÉCAPITULATIF DU SIMULATEUR */}
        <div className="bg-slate-900 text-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-brutal-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Votre Configuration Personnalisée</span>
            <h4 className="text-2xl sm:text-3xl font-black mt-1">
              Total estimé : <span className="text-amber-400">{totalPrice} €</span> <span className="text-xs font-normal text-slate-400">{isAnnual ? "HT / an" : "HT / mois"} (Engagement 1 an)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Comprend le socle Vitrine {optEcommerce ? "+ Vente en ligne" : ""} {optShipping ? "+ Transport" : ""} {optFoodDelivery ? "+ Restauration" : ""}.
            </p>
          </div>

          <a 
            href="/register" 
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base px-8 py-4 rounded-2xl border-2 border-white shadow-brutal-sm hover:shadow-brutal transition flex items-center justify-center gap-2 shrink-0"
          >
            <span>Commander et déployer mon site</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ── 6. DÉMARRAGE EN 4 ÉTAPES ──────────────────────────────── */}
      <section id="etapes" className="py-20 bg-white border-t-2 border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Prêt en 4 étapes simples.
            </h2>
            <p className="text-slate-600 font-medium">De l'inscription à votre premier client en ligne.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center font-black text-lg mb-4">1</div>
              <h3 className="font-black text-base mb-2">Choix du sous-domaine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Indiquez le nom de votre commerce (ex: salon-lucie) pour réserver votre adresse en 30 secondes.</p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-300 border-2 border-slate-900 flex items-center justify-center font-black text-lg mb-4">2</div>
              <h3 className="font-black text-base mb-2">Paiement du Pack</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Réglez votre pack de base en toute sécurité par carte bancaire via Stripe.</p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-300 border-2 border-slate-900 flex items-center justify-center font-black text-lg mb-4">3</div>
              <h3 className="font-black text-base mb-2">Déploiement K8s (15s)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Notre cluster Kubernetes crée automatiquement votre pod, votre base et votre certificat SSL.</p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-brutal-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-300 border-2 border-slate-900 flex items-center justify-center font-black text-lg mb-4">4</div>
              <h3 className="font-black text-base mb-2">Personnalisation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Connectez-vous à votre interface pour ajouter vos horaires, vos photos et vos produits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDÉON ──────────────────────────────────────── */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-slate-600 font-medium">Tout ce que vous devez savoir en toute transparence.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-brutal-sm">
              <button 
                onClick={() => toggleFaq(i)}
                className="w-full p-6 text-left font-black text-base sm:text-lg text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-900 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-sm text-slate-600 border-t-2 border-slate-100 pt-4 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t-2 border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏪</span>
                <span className="text-white font-black text-xl">WoxxApp V2</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                La solution e-commerce et vitrine simple, sans abonnement caché, hébergée sur cluster souverain haute performance.
              </p>
            </div>

            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Démos & Clients</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="https://zorea.fr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Zorea Bijouterie (Client)</a></li>
                <li><a href="https://store-pizza.woxxapp.de" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Store Pizza (Démo)</a></li>
                <li><a href="https://store-mode.woxxapp.de" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Store Mode (Démo)</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Accompagnement</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="https://elise-et-moi.fr/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Élise & Moi (Office Manager)</a></li>
                <li><a href="mailto:contact@woxxapp.de" className="hover:text-white transition">Demande de devis sur mesure</a></li>
                <li><a href="mailto:support@woxxapp.de" className="hover:text-white transition">Assistance technique</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Sécurité & Légal</h5>
              <ul className="space-y-2 text-xs">
                <li><span>Hébergement K8s Hetzner (Allemagne)</span></li>
                <li><span>Paiements certifiés PCI-DSS Stripe</span></li>
                <li><a href="#" className="hover:text-white transition">Mentions Légales & CGU</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            © 2026 WoxxApp. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
