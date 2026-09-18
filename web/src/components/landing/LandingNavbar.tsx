'use client';

import React from 'react';
import { ProfileDropdown } from '../auth/ProfileDropdown';
import { useAuth } from '@/lib/auth-context';

export function LandingNavbar() {
  const { openAuthModal } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 shadow-brutal-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* LOGO NEO-BRUTALIST */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-xl font-black group-hover:rotate-6 transition-transform">
              🏪
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-950 flex items-center gap-1.5">
                WoxxApp <span className="text-[10px] bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider">V2</span>
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest -mt-1">
                Plateforme SaaS Commerçants
              </span>
            </div>
          </a>
        </div>

        {/* LIENS DE NAVIGATION */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto py-1">
          <a
            href="#showroom"
            className="bg-white hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 text-xs font-black whitespace-nowrap shrink-0"
          >
            <span>✨</span>
            <span className="whitespace-nowrap">Showroom</span>
          </a>

          <a
            href="#modules"
            className="bg-white hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 text-xs font-black whitespace-nowrap shrink-0"
          >
            <span>📦</span>
            <span className="whitespace-nowrap">Modules</span>
          </a>

          <a
            href="#tarifs"
            className="bg-white hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 text-xs font-black whitespace-nowrap shrink-0"
          >
            <span>🏷️</span>
            <span className="whitespace-nowrap">Tarifs</span>
          </a>

          <a
            href="#etapes"
            className="bg-white hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 text-xs font-black whitespace-nowrap shrink-0"
          >
            <span>🚀</span>
            <span className="whitespace-nowrap">4 Étapes</span>
          </a>

          <a
            href="#faq"
            className="bg-white hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 text-xs font-black whitespace-nowrap shrink-0"
          >
            <span>❓</span>
            <span className="whitespace-nowrap">FAQ</span>
          </a>
        </div>

        {/* ACTIONS NAVBAR */}
        <div className="flex items-center gap-3">
          <ProfileDropdown />
          <button
            onClick={() => openAuthModal('register')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 sm:px-5 py-2.5 rounded-xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition active:translate-x-0 active:translate-y-0 cursor-pointer"
          >
            Créer ma boutique →
          </button>
        </div>
      </div>
    </nav>
  );
}
