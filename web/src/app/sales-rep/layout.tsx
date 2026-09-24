'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { SalesRepSidebar, SalesRepTab } from '@/components/sales-rep/SalesRepSidebar';
import Link from 'next/link';

export default function SalesRepLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<SalesRepTab>('clients');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-400 border-2 border-slate-900 shadow-brutal-sm flex items-center justify-center animate-spin text-xl">
            💼
          </div>
          <p className="text-xs font-black text-slate-900">Chargement de votre espace commercial...</p>
        </div>
      </div>
    );
  }

  const isAuthorized = user && (user.role === 'charge_daffaire' || user.role === 'admin');

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9] p-4">
        <div className="max-w-md w-full bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-brutal-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-slate-900 shadow-brutal-sm flex items-center justify-center mx-auto text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-black text-slate-900">Accès Restreint</h1>
          <p className="text-xs text-slate-600 font-medium">
            Cet espace est réservé aux chargés d'affaires et administrateurs habilités.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            {!user ? (
              <button
                onClick={() => openAuthModal('login')}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-3 rounded-xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition cursor-pointer"
              >
                Se connecter
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black py-3 rounded-xl border-2 border-slate-900 shadow-brutal-xs text-center transition"
              >
                Retour à mon espace
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 flex">
      <SalesRepSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          const event = new CustomEvent('sales-rep-tab-change', { detail: tab });
          window.dispatchEvent(event);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={logout}
        userEmail={user.email}
        userName={user.full_name}
        userRole={user.role}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        <header className="h-20 border-b-2 border-slate-900 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-brutal-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Espace Commercial
            </span>
            <span className="text-slate-400 font-bold">/</span>
            <span className="text-xs font-black text-slate-950 bg-amber-300 px-2.5 py-1 rounded-lg border border-slate-900 uppercase">
              Gestion Clients & Devis
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-brutal-xs text-xs font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-slate-900"></span>
              <span className="text-slate-900 text-xs">{user.full_name || user.email}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-amber-400 uppercase">
                {user.role}
              </span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
