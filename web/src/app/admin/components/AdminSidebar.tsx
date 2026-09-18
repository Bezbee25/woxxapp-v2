'use client';

import React from 'react';
import {
  Store,
  Users,
  Briefcase,
  CreditCard,
  Tag,
  Building2,
  FileText,
  ShieldAlert,
  Layers,
  Mail,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
} from 'lucide-react';
import Link from 'next/link';

export type AdminTab =
  | 'tenants'
  | 'users'
  | 'sales-reps'
  | 'subscriptions'
  | 'coupons'
  | 'company-tax'
  | 'legal-cms'
  | 'gdpr-audit'
  | 'modules'
  | 'smtp'
  | 'woxxpay';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  userEmail?: string;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  userEmail,
}: AdminSidebarProps) {
  const navSections = [
    {
      title: 'Gestion des Comptes',
      items: [
        { id: 'tenants' as AdminTab, label: 'Boutiques & Tenants', icon: Store },
        { id: 'users' as AdminTab, label: 'Utilisateurs & Rôles', icon: Users },
        { id: 'sales-reps' as AdminTab, label: 'Chargés d’Affaires', icon: Briefcase },
      ],
    },
    {
      title: 'Finances & Ventes',
      items: [
        { id: 'subscriptions' as AdminTab, label: 'Abonnements & Factures', icon: CreditCard },
        { id: 'coupons' as AdminTab, label: 'Codes Promo', icon: Tag },
        { id: 'company-tax' as AdminTab, label: 'Type Entreprise & TVA', icon: Building2 },
      ],
    },
    {
      title: 'Légal & Conformité',
      items: [
        { id: 'legal-cms' as AdminTab, label: 'CMS Pages Légales', icon: FileText },
        { id: 'gdpr-audit' as AdminTab, label: 'Audit & Archive RGPD', icon: ShieldAlert },
      ],
    },
    {
      title: 'Configuration Système',
      items: [
        { id: 'modules' as AdminTab, label: 'Modules & Tarifs', icon: Layers },
        { id: 'smtp' as AdminTab, label: 'Serveur SMTP', icon: Mail },
        { id: 'woxxpay' as AdminTab, label: 'WoxxPay Direct API', icon: Zap },
      ],
    },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#0A0E17] border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header Sidebar */}
      <div>
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20">
                W2
              </div>
              <span className="font-extrabold text-white text-base tracking-tight truncate">
                Admin <span className="text-cyan-400">Control</span>
              </span>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm">
              W
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition ${
              isCollapsed ? 'hidden' : 'block'
            }`}
            title={isCollapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Bouton de repliement centré si collapsed */}
        {isCollapsed && (
          <div className="flex justify-center py-2 border-b border-slate-800">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Déplier la barre latérale"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="p-3 border-t border-slate-800 bg-[#080B12] space-y-1">
        <Link
          href="/"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? "Retour au Site Public" : undefined}
        >
          <Home className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Retour au Site</span>}
        </Link>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Déconnexion ({userEmail?.split('@')[0]})</span>}
        </button>
      </div>
    </aside>
  );
}
