'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "Quel est l'engagement pour mon abonnement ?",
    a: "L'abonnement comporte un engagement d'un an (1 an), payable en une fois à tarif préférentiel (150 € / an pour le socle vitrine) ou mensualisé à 15 € / mois.",
  },
  {
    q: "Est-ce que je peux ajouter des options (Vente en ligne, Transport) en cours d'année ?",
    a: "Oui, tout à fait ! Vous pouvez démarrer avec le pack Vitrine et activer le module E-commerce Stripe ou l'expédition SendCloud à tout moment depuis votre espace d'administration.",
  },
  {
    q: "Où sont hébergées mes données et celles de mes clients ?",
    a: "Toutes vos données (base de données PostgreSQL, conteneurs Docker, images) sont hébergées en Union Européenne (Hetzner Allemagne) sur un cluster Kubernetes haute performance.",
  },
  {
    q: "Puis-je utiliser mon propre nom de domaine (.fr, .com) ?",
    a: "Oui, vous pouvez connecter votre domaine personnalisé très facilement. Nous générons automatiquement le certificat de sécurité SSL/TLS Let's Encrypt.",
  },
  {
    q: "Comment fonctionne la passerelle de paiement WoxxPay ?",
    a: "WoxxPay est notre passerelle sécurisée intégrée à Stripe. Elle permet d'encaisser vos clients directement sur votre compte bancaire avec une commission transparente de 2%.",
  },
  {
    q: "Comment fonctionne l'accompagnement par Élise & Moi ?",
    a: "Élise & Moi est notre partenaire spécialisé dans la gestion externalisée. Si vous manquez de temps, son équipe peut configurer votre catalogue, vos photos et votre charte graphique sur simple devis.",
  },
];

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-xs font-black tracking-widest text-slate-700 uppercase bg-slate-200 px-3 py-1 rounded-full border border-slate-400 inline-block mb-3">
          Assistance & Réponses
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Questions Fréquentes
        </h2>
        <p className="text-slate-700 font-medium">Tout ce que vous devez savoir en toute transparence.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white/95 backdrop-blur-sm border-2 border-slate-900 rounded-2xl overflow-hidden shadow-brutal-sm">
            <button
              onClick={() => toggleFaq(i)}
              className="w-full p-6 text-left font-black text-base sm:text-lg text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50 transition cursor-pointer"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-900 shrink-0 transition-transform ${
                  openFaq === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === i && (
              <div className="px-6 pb-6 text-sm text-slate-700 border-t-2 border-slate-100 pt-4 leading-relaxed font-medium">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
