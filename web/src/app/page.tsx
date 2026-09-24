'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp, Store, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ShowroomSection } from '../components/landing/ShowroomSection';
import { ElisePartnerSection } from '../components/landing/ElisePartnerSection';
import { PricingSection } from '../components/landing/PricingSection';
import { StepsSection } from '../components/landing/StepsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function LandingPage() {
  const { user } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dashboardUrl =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'charge_daffaire'
      ? '/sales-rep'
      : '/dashboard';

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 font-sans selection:bg-amber-300 selection:text-slate-950">
      {/* BANDEAU UTILISATEUR CONNECTÉ */}
      {user && (
        <div className="bg-emerald-400 text-slate-950 border-b-2 border-slate-900 px-4 py-2.5 shadow-brutal-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-black">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse"></span>
              <span>
                Connecté en tant que{' '}
                <span className="underline decoration-slate-950 underline-offset-2">
                  {user.full_name || user.email}
                </span>{' '}
                ({user.role})
              </span>
            </div>
            <Link
              href={dashboardUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-900 shadow-brutal-xs hover:shadow-brutal transition-all text-xs"
            >
              {user.role === 'admin' ? (
                <Shield className="w-3.5 h-3.5 text-purple-700" />
              ) : (
                <Store className="w-3.5 h-3.5 text-emerald-700" />
              )}
              <span>
                {user.role === 'admin'
                  ? 'Accéder au Panneau d’Administration →'
                  : user.role === 'charge_daffaire'
                  ? 'Accéder à mon Espace Chargé d’Affaires →'
                  : 'Aller sur mon Tableau de Bord Client →'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 1. NAVBAR */}
      <LandingNavbar />

      {/* 2. HERO */}
      <HeroSection />

      {/* 3. SHOWROOM */}
      <ShowroomSection />

      {/* 4. ACCOMPAGNEMENT ÉLISE & MOI */}
      <ElisePartnerSection />

      {/* 5. TARIFICATION & SIMULATEUR */}
      <PricingSection />

      {/* 6. DÉMARRAGE EN 4 ÉTAPES */}
      <StepsSection />

      {/* 7. FAQ */}
      <FaqSection />

      {/* 8. FOOTER */}
      <LandingFooter />

      {/* 9. BOUTON FLOTTANT SCROLL TOP */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Remonter en haut de la page"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center cursor-pointer group"
        >
          <ArrowUp className="w-6 h-6 stroke-[3] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
