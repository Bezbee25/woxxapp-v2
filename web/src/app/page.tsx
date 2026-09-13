"use client";

import { useState } from "react";
import { Check, Store, ExternalLink } from "lucide-react";

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-primary">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-primary tracking-tight">
          Votre commerce en ligne, sans prise de tête.
        </h1>
        <p className="text-xl text-muted mb-10">
          De la vitrine au click & collect, gérez tout au même endroit. 
          Parce que vous avez mieux à faire que coder.
        </p>
        <button className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition">
          Lancer mon site
        </button>
      </section>

      {/* Showroom */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ils nous font confiance</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Demo Pizza", url: "https://demo-pizza.woxxapp.de" },
              { name: "Demo Mode", url: "https://demo-mode.woxxapp.de" },
              { name: "Zorea", url: "https://zorea.woxxapp.de" }
            ].map((demo) => (
              <a key={demo.name} href={demo.url} target="_blank" rel="noopener noreferrer" 
                 className="group block p-6 border rounded-xl hover:border-accent hover:shadow-lg transition bg-slate-50">
                <Store className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  {demo.name} <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Des tarifs aussi clairs que nos sites</h2>
        
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={!isAnnual ? "font-bold" : "text-muted"}>Mensuel</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-primary rounded-full relative"
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isAnnual ? 'left-8' : 'left-1'}`} />
          </button>
          <span className={isAnnual ? "font-bold" : "text-muted"}>Annuel (-20%)</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Site Vitrine", price: isAnnual ? 12 : 15, features: ["Galerie", "Horaires", "Contact"] },
            { title: "E-Commerce", price: isAnnual ? 24 : 30, features: ["Catalogue", "Panier", "Stock"], highlight: true },
            { title: "Livraison", price: isAnnual ? 24 : 30, features: ["UberEats", "Deliveroo", "Suivi"] },
          ].map((plan) => (
            <div key={plan.title} className={`p-8 rounded-2xl border ${plan.highlight ? 'border-accent shadow-xl relative' : 'border-slate-200'}`}>
              {plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-1 rounded-full text-sm">Populaire</span>}
              <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
              <div className="text-4xl font-bold mb-6">€{plan.price}<span className="text-base font-normal text-muted">/mois</span></div>
              <ul className="space-y-4 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-semibold ${plan.highlight ? 'bg-accent text-white hover:bg-blue-600' : 'bg-slate-100 hover:bg-slate-200'}`}>
                Choisir
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
          <div className="space-y-6">
            <details className="group bg-slate-50 p-6 rounded-xl cursor-pointer">
              <summary className="font-semibold text-lg list-none flex justify-between">
                Faut-il savoir coder ?
                <span className="group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-muted">Absolument pas. Si vous savez utiliser un smartphone, vous saurez gérer votre site.</p>
            </details>
            <details className="group bg-slate-50 p-6 rounded-xl cursor-pointer">
              <summary className="font-semibold text-lg list-none flex justify-between">
                Puis-je utiliser mon propre nom de domaine ?
                <span className="group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-muted">Oui ! Le module "Nom de Domaine Personnalisé" vous permet de lier votre site à votre domaine existant.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
