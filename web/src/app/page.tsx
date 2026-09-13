"use client";

import { useState } from "react";
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
  ChevronDown
} from "lucide-react";

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const demos = [
    {
      name: "Demo Pizza",
      tag: "🍕 Restauration & Fast-Food",
      desc: "Menu interactif, personnalisation des ingrédients, Click & Collect minute et encaissement en ligne.",
      url: "https://demo-pizza.woxxapp.de",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      name: "Demo Mode",
      tag: "👗 Prêt-à-porter & Accessoires",
      desc: "Catalogue complet, filtres par taille/couleur, gestion des stocks et panier d'achat fluide.",
      url: "https://demo-mode.woxxapp.de",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      name: "Zorea Bijoux",
      tag: "💍 Artisanat & Créations",
      desc: "Galerie haute définition, storytelling créateur, paiement sécurisé Stripe et expédition suivie.",
      url: "https://zorea.woxxapp.de",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
  ];

  const faqs = [
    {
      q: "Est-ce que je peux changer d'offre ou ajouter des options à tout moment ?",
      a: "Oui, à 100% ! Vous pouvez démarrer avec le simple pack Vitrine et ajouter la vente en ligne ou le transport quand vous êtes prêt depuis votre espace client, en 1 clic."
    },
    {
      q: "Je ne suis pas du tout technique, est-ce fait pour moi ?",
      a: "C'est exactement conçu pour vous. Si vous savez envoyer un message sur WhatsApp, vous saurez gérer votre boutique en ligne. Aucune ligne de code n'est nécessaire."
    },
    {
      q: "C'est quoi la commission de 2% sur les paiements par carte ?",
      a: "Sur chaque vente payée par carte bancaire via le système WoxxPay / Stripe Connect, nous prélevons 2% pour couvrir le traitement technique sécurisé. Le reste est versé directement sur votre compte bancaire."
    },
    {
      q: "Puis-je utiliser mon propre nom de domaine (ex: www.mon-salon.fr) ?",
      a: "Oui ! Chaque boutique reçoit d'office une adresse *.woxxapp.de sécurisée, et nous pouvons brancher votre propre nom de domaine personnalisé sur demande."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* ── 1. NAVBAR ────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Woxx<span className="text-blue-600">App</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#showroom" className="hover:text-blue-600 transition">Showroom Démo</a>
            <a href="#tarifs" className="hover:text-blue-600 transition">Tarifs</a>
            <a href="#avantages" className="hover:text-blue-600 transition">Pourquoi nous</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2">
              Se connecter
            </a>
            <a href="#tarifs" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition">
              Créer mon site
            </a>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO SECTION ──────────────────────────────────────── */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plus de 100 commerçants et artisans équipés</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Votre site web professionnel,<br />
          <span className="text-blue-600">prêt en moins de 10 minutes.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Fini le site bricolé par votre cousin en 2012 qui ne marche pas sur mobile. 
          Vos horaires, votre catalogue, votre Click & Collect — tout est prêt, sans casser votre tirelire.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <a href="#tarifs" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2">
            Créer ma boutique maintenant <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#showroom" className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-6 py-4 rounded-xl text-base font-semibold shadow-sm transition flex items-center justify-center gap-2">
            Voir les boutiques en direct 👁️
          </a>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm font-medium text-slate-500">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Sans engagement</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Certificat SSL inclus</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Hébergement cloud européen</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Support humain réactif</span>
        </div>
      </section>

      {/* ── 3. SHOWROOM SECTION (MIS EN AVANT) ───────────────────── */}
      <section id="showroom" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Voyez exactement ce que vous allez avoir
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Des vraies boutiques actives sur notre cluster, prêtes à l'emploi. Pas des maquettes de présentation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {demos.map((demo) => (
              <div key={demo.name} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${demo.badgeColor}`}>
                      {demo.tag}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{demo.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{demo.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row gap-2">
                  <a 
                    href={demo.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Visiter la boutique</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href={`${demo.url}/admin`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 text-center bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium py-2.5 px-3 rounded-lg transition"
                  >
                    Tester l'admin
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. LES 3 PILIERS ─────────────────────────────────────── */}
      <section id="avantages" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Pourquoi les commerçants choisissent WoxxApp</h2>
          <p className="text-slate-600">Tout a été pensé pour vous faire gagner du temps et des ventes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Déploiement Instantané</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dès votre paiement validé, nos robots déploient votre espace en moins de 15 secondes sur nos serveurs. Vous pouvez commencer à saisir vos horaires immédiatement.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Modulaire & Évolutif</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Commencez avec un simple site vitrine pour être visible sur Google. Activez la vente par carte bancaire ou l'expédition le jour où votre activité grandit.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sauvegardes & Sécurité K8s</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Votre site tourne dans un conteneur isolé sur cluster Kubernetes sécurisé. Sauvegardes nocturnes automatiques et certificat SSL Let's Encrypt renouvelé pour vous.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. GRILLE TARIFAIRE ATLASSIAN (MODULAIRE) ────────────── */}
      <section id="tarifs" className="py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Des tarifs simples, transparents, à la carte
            </h2>
            <p className="text-slate-600 mb-8">
              Un socle indispensable à petit prix, puis vous ajoutez uniquement les fonctionnalités dont vous avez besoin.
            </p>

            {/* Switch Annuel / Mensuel */}
            <div className="inline-flex items-center gap-3 bg-white p-1.5 rounded-full border border-slate-300 shadow-sm">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${!isAnnual ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Mensuel
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${isAnnual ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <span>Annuel</span>
                <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">-17%</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 items-stretch">
            {/* CARTE 1 : SOCLE VITRINE (STARTER OBLIGATOIRE) */}
            <div className="bg-white rounded-2xl border-2 border-emerald-600 p-6 flex flex-col justify-between shadow-lg relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Le Socle Indispensable
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <Store className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Site Vitrine & Retrait</h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">Pour être trouvé sur Google et recevoir vos premières demandes.</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {isAnnual ? "150 €" : "15 €"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {isAnnual ? "/ an" : "/ mois"}
                    </span>
                  </div>
                  {isAnnual && <p className="text-[11px] text-emerald-600 font-semibold mt-1">Soit 12,50 € / mois</p>}
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Site web responsive mobile/PC</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Horaires & Coordonnées Google</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Formulaire de contact & Réservation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Module Click & Collect minute</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Hébergement cloud & SSL inclus</li>
                </ul>
              </div>

              <a href="/register" className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 rounded-xl transition shadow-sm">
                Choisir cette base
              </a>
            </div>

            {/* CARTE 2 : MODULE VENTE + STRIPE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">Vente de Produits</h3>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Populaire</span>
                </div>
                <p className="text-xs text-slate-500 mb-6">Catalogue en ligne avec encaissement par carte bancaire.</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      +{isAnnual ? "300 €" : "30 €"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{isAnnual ? "/ an" : "/ mois"}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">+ 2% par transaction CB</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Catalogue produits & fiches articles</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Gestion des stocks & variantes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Paiement CB, Apple Pay & Google Pay</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Passerelle sécurisée WoxxPay / Stripe</li>
                </ul>
              </div>

              <button className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold py-3 rounded-xl transition">
                Ajouter au panier
              </button>
            </div>

            {/* CARTE 3 : MODULE EXPÉDITION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">Transport & Envoi</h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">Expédiez partout en France et en Europe en quelques clics.</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      +{isAnnual ? "300 €" : "30 €"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{isAnnual ? "/ an" : "/ mois"}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Nécessite le module Vente</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0" /> Intégration Sendcloud / WoxxShip</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0" /> Colissimo, Mondial Relay, Chronopost</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0" /> Calcul automatique des frais de port</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0" /> Impression des étiquettes d'envoi</li>
                </ul>
              </div>

              <button className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold py-3 rounded-xl transition">
                Ajouter au panier
              </button>
            </div>

            {/* CARTE 4 : RESTAURATION & LIVRAISON */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-rose-600" />
                  <h3 className="text-lg font-bold text-slate-900">Restauration Express</h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">Pour snacks, pizzerias et restaurants avec livraison directe.</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      +{isAnnual ? "300 €" : "30 €"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{isAnnual ? "/ an" : "/ mois"}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Idéal commerces de bouche</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600 shrink-0" /> Passerelle UberEats / Deliveroo</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600 shrink-0" /> Impression des tickets en cuisine</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600 shrink-0" /> Gestion des temps de préparation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600 shrink-0" /> Alertes sonores de commande</li>
                </ul>
              </div>

              <button className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold py-3 rounded-xl transition">
                Ajouter au panier
              </button>
            </div>
          </div>

          {/* BANDEAU SUR DEVIS : ACCOMPAGNEMENT & DOMAINE */}
          <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Besoin d'un accompagnement personnalisé ou d'un nom de domaine propre ?</h4>
                <p className="text-xs text-slate-500">Mise en page de votre thème, saisie de votre catalogue de produits, configuration DNS : nous pouvons tout faire pour vous sur devis.</p>
              </div>
            </div>
            <a href="mailto:contact@woxxapp.de" className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-3 rounded-xl transition">
              Demander un devis
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ACCORDÉON ──────────────────────────────────────── */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Questions fréquentes</h2>
          <p className="text-slate-600">Tout ce que vous devez savoir avant de commencer.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button 
                onClick={() => toggleFaq(i)}
                className="w-full p-5 text-left font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/80 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <span className="text-white font-bold text-lg">WoxxApp</span>
          </div>

          <p className="text-xs">
            © 2026 WoxxApp. Hébergé sur infrastructure Kubernetes haute disponibilité en Europe.
          </p>

          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition">Mentions légales</a>
            <a href="#" className="hover:text-white transition">Confidentialité</a>
            <a href="mailto:contact@woxxapp.de" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
