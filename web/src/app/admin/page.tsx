'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { TenantsTab } from './tabs/TenantsTab';
import { UsersTab } from './tabs/UsersTab';
import { SalesRepsTab } from './tabs/SalesRepsTab';
import { SubscriptionsTab } from './tabs/SubscriptionsTab';
import { CouponsTab } from './tabs/CouponsTab';
import { CompanyTaxTab } from './tabs/CompanyTaxTab';
import { LegalCmsTab } from './tabs/LegalCmsTab';
import { GdprAuditTab } from './tabs/GdprAuditTab';
import { ModulesTab } from './tabs/ModulesTab';
import { SmtpTab } from './tabs/SmtpTab';
import { WoxxPayTab } from './tabs/WoxxPayTab';
import { Shield, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading: authLoading, logout, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('tenants');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isSalesRep = user?.role === 'charge_daffaire';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090E] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Accès au panneau d'administration sécurisé...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin && !isSalesRep)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090E] p-4 text-white">
        <div className="max-w-md w-full bg-[#0D121F] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Accès Restreint</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cet espace d'administration est strictement réservé aux administrateurs et collaborateurs habilités.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            {!user ? (
              <button
                onClick={() => openAuthModal('login')}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold py-3 rounded-xl shadow-lg transition"
              >
                Se connecter en tant qu'administrateur
              </button>
            ) : (
              <Link
                href="/"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-3 rounded-xl border border-slate-700 text-center transition"
              >
                Retour à l'accueil
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rendu de l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tenants':
        return <TenantsTab />;
      case 'users':
        return <UsersTab />;
      case 'sales-reps':
        return <SalesRepsTab />;
      case 'subscriptions':
        return <SubscriptionsTab />;
      case 'coupons':
        return <CouponsTab />;
      case 'company-tax':
        return <CompanyTaxTab />;
      case 'legal-cms':
        return <LegalCmsTab />;
      case 'gdpr-audit':
        return <GdprAuditTab />;
      case 'modules':
        return <ModulesTab />;
      case 'smtp':
        return <SmtpTab />;
      case 'woxxpay':
        return <WoxxPayTab />;
      default:
        return <TenantsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex">
      {/* Sidebar Rétractable */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={logout}
        userEmail={user.email}
      />

      {/* Zone de Contenu */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        <header className="h-16 border-b border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Espace Administration
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold text-cyan-400 capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-mono text-[11px]">{user.email}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {user.role}
              </span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
