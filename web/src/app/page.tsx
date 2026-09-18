'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ShowroomSection } from '../components/landing/ShowroomSection';
import { ElisePartnerSection } from '../components/landing/ElisePartnerSection';
import { PricingSection } from '../components/landing/PricingSection';
import { StepsSection } from '../components/landing/StepsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function LandingPage() {
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

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 font-sans selection:bg-amber-300 selection:text-slate-950 overflow-x-clip">
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
