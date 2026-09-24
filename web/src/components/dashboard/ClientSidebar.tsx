'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

export type ClientTab = 'stores' | 'quotes' | 'invoices' | 'account';

interface ClientSidebarProps {
  activeTab: ClientTab;
  onSelectTab: (tab: ClientTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  userEmail: string;
  userName?: string;
  userRole?: string;
}

export function ClientSidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  userEmail,
  userName,
  userRole,
}: ClientSidebarProps) {
  const navItems = [
    { id: 'stores' as ClientTab, label: 'Mes Boutiques', icon: Store, color: 'text-emerald-500' },
    { id: 'quotes' as ClientTab, label: 'Mes Devis & Offres', icon: FileText, color: 'text-amber-500' },
    { id: 'invoices' as ClientTab, label: 'Factures & Abonnements', icon: FileText, color: 'text-blue-500' },
    { id: 'account' as ClientTab, label: 'Mon Compte & Sécurité', icon: User, color: 'text-purple-500' },
  ];

  return (
    <aside
      className={`bg-white border-r-2 border-slate-900 flex flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div>
        {/* LOGO & EN-TÊTE */}
        <div className="h-20 border-b-2 border-slate-900 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-xl font-black shrink-0">
              🏪
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-base text-slate-950 tracking-tight leading-none">
                  WoxxApp
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mt-0.5">
                  Espace Client
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-xl border-2 border-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition shadow-brutal-xs shrink-0"
            title={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* LIENS DE NAVIGATION */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl border-2 font-black text-xs transition-all text-left ${
                  isActive
                    ? 'bg-amber-300 text-slate-950 border-slate-900 shadow-brutal-xs'
                    : 'bg-white text-slate-700 border-transparent hover:border-slate-900 hover:bg-slate-50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : item.color}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {(userRole === 'admin' || userRole === 'charge_daffaire') && (
            <div className="pt-3 border-t-2 border-slate-100 mt-3">
              <Link
                href="/admin"
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl border-2 border-purple-900 bg-purple-50 text-purple-950 font-black text-xs hover:bg-purple-100 transition-all shadow-brutal-xs"
                title="Panneau Super-Admin"
              >
                <Shield className="w-5 h-5 text-purple-700 shrink-0" />
                {!isCollapsed && <span className="truncate">Panneau Admin Global</span>}
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* BAS DE SIDEBAR & PROFIL */}
      <div className="p-3 border-t-2 border-slate-900 bg-slate-50 space-y-2">
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-300 transition"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Retour à l'accueil</span>}
        </Link>

        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center font-black text-xs shrink-0">
            {(userName || userEmail).charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-950 truncate leading-none">
                {userName || 'Client'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold truncate mt-0.5">{userEmail}</p>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Se déconnecter</span>}
        </button>
      </div>
    </aside>
  );
}
