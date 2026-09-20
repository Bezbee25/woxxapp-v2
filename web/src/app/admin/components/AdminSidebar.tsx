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
  | 'versions'
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
        { id: 'versions' as AdminTab, label: 'Versions Boutiques (K8s)', icon: Layers },
        { id: 'modules' as AdminTab, label: 'Modules & Tarifs', icon: Tag },
        { id: 'smtp' as AdminTab, label: 'Serveur SMTP', icon: Mail },
        { id: 'woxxpay' as AdminTab, label: 'WoxxPay Direct API', icon: Zap },
      ],
    },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-white border-r-2 border-slate-900 flex flex-col justify-between transition-all duration-300 z-30 select-none shadow-brutal-xs ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header Sidebar */}
      <div>
        <div className="h-20 border-b-2 border-slate-900 flex items-center justify-between px-4 bg-white">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black text-sm shadow-brutal-xs">
                🛡️
              </div>
              <div className="leading-tight">
                <span className="font-black text-slate-950 text-base tracking-tight block">
                  WOXX<span className="text-blue-600">APP</span>
                </span>
                <span className="text-[10px] font-black uppercase text-slate-500">Admin Control</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto w-10 h-10 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black text-base shadow-brutal-xs">
              W
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className={`p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-900 shadow-brutal-xs transition ${
              isCollapsed ? 'hidden' : 'block'
            }`}
            title={isCollapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {isCollapsed && (
          <div className="flex justify-center py-3 border-b-2 border-slate-900 bg-slate-50">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 shadow-brutal-xs transition"
              title="Déplier la barre latérale"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-170px)]">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider px-3 mb-1.5">
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-brutal-xs'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-2 border-transparent'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-900" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="p-3 border-t-2 border-slate-900 bg-slate-50 space-y-1.5">
        <Link
          href="/"
          className={`w-full flex items-center gap-2.5 px-3 py-2 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-900 shadow-brutal-xs transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? "Retour au Site Public" : undefined}
        >
          <Home className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Retour au Site</span>}
        </Link>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-slate-900 rounded-xl text-xs font-black shadow-brutal-xs transition ${
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
