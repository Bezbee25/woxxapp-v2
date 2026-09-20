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
import { BoutiqueVersionsTab } from './tabs/BoutiqueVersionsTab';
import { SmtpTab } from './tabs/SmtpTab';
import { WoxxPayTab } from './tabs/WoxxPayTab';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading: authLoading, logout, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('tenants');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isSalesRep = user?.role === 'charge_daffaire';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-sm flex items-center justify-center animate-spin text-xl">
            ⚙️
          </div>
          <p className="text-xs font-black text-slate-900">Chargement de votre espace sécurisé...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin && !isSalesRep)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9] p-4">
        <div className="max-w-md w-full bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-brutal-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 border-2 border-slate-900 shadow-brutal-sm flex items-center justify-center mx-auto text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-black text-slate-900">Accès Restreint</h1>
          <p className="text-xs text-slate-600 font-medium">
            Cet espace d'administration est strictement réservé aux administrateurs et collaborateurs habilités.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            {!user ? (
              <button
                onClick={() => openAuthModal('login')}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-3 rounded-xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition"
              >
                Se connecter en tant qu'administrateur
              </button>
            ) : (
              <Link
                href="/"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black py-3 rounded-xl border-2 border-slate-900 shadow-brutal-xs text-center transition"
              >
                Retour à l'accueil
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rendu modulaire de l'onglet actif
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
      case 'versions':
        return <BoutiqueVersionsTab />;
      case 'smtp':
        return <SmtpTab />;
      case 'woxxpay':
        return <WoxxPayTab />;
      default:
        return <TenantsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 flex">
      {/* Sidebar Rétractable Neo-Brutalist */}
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
        <header className="h-20 border-b-2 border-slate-900 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-brutal-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Espace Administration
            </span>
            <span className="text-slate-400 font-bold">/</span>
            <span className="text-xs font-black text-slate-950 bg-amber-300 px-2.5 py-1 rounded-lg border border-slate-900 uppercase">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-brutal-xs text-xs font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900"></span>
              <span className="text-slate-900 text-xs">{user.email}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-amber-400 uppercase">
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
