'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('woxx_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      // Activer Google Analytics si accepté
      loadGoogleAnalytics();
    }
  }, []);

  const loadGoogleAnalytics = () => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-DEFAULT';
    if (typeof window !== 'undefined' && !document.getElementById('ga-script') && gaId !== 'G-DEFAULT') {
      const script1 = document.createElement('script');
      script1.id = 'ga-script';
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { 'anonymize_ip': true });
      `;
      document.head.appendChild(script2);
    }
  };

  const handleAccept = () => {
    localStorage.setItem('woxx_cookie_consent', 'accepted');
    setShowBanner(false);
    loadGoogleAnalytics();
  };

  const handleRefuse = () => {
    localStorage.setItem('woxx_cookie_consent', 'refused');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 bg-[#0B0F19]/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 text-white animate-fade-in-up">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shrink-0">
          <Cookie className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg flex items-center gap-2 text-white">
              Respect de votre vie privée <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </h3>
            <button
              onClick={handleRefuse}
              className="text-slate-400 hover:text-white p-1 transition"
              title="Continuer sans accepter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Nous utilisons des cookies techniques indispensables au fonctionnement du service et, avec votre accord, des cookies de mesure d'audience (Google Analytics) pour optimiser votre expérience. Vous pouvez changer d'avis à tout moment.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Accepter & Continuer
            </button>
            <button
              onClick={handleRefuse}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl border border-slate-700 transition"
            >
              Refuser
            </button>
            <Link
              href="/policies/cookies"
              className="text-xs text-cyan-400 hover:underline ml-auto"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
