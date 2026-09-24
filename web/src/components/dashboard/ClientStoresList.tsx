'use client';

import React, { useState, useEffect } from 'react';
import {
  Store,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Key,
  Layers,
  ShoppingBag,
  Truck,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Globe,
  CreditCard
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { ClientStoreDetailView } from './ClientStoreDetailView';
import { calculateModulesOrder } from '@/lib/modules-catalog';

export interface ClientTenant {
  id: string;
  commerceName: string;
  subdomain: string;
  customDomain?: string;
  email: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  modules: string[];
  imageTag?: string;
  k8sStatus?: string;
  createdAt: string;
}

interface ClientStoresListProps {
  tenants: ClientTenant[];
  loading: boolean;
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function ClientStoresList({
  tenants,
  loading,
  onRefresh,
  onOpenCreate,
}: ClientStoresListProps) {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [salesRep, setSalesRep] = useState<any | null>(null);
  const [ssoLoadingId, setSsoLoadingId] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<any>('/account/sales-rep')
      .then((res) => {
        if (res?.salesRep) setSalesRep(res.salesRep);
      })
      .catch(() => {});
  }, []);

  const handleOpenSso = async (tenantId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSsoLoadingId(tenantId);
    try {
      const res = await fetch(`/api/tenants/${tenantId}/sso`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || 'Erreur lors de la génération du token SSO');
      }
      if (data.ssoUrl) {
        window.open(data.ssoUrl, '_blank');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’accès à la boutique');
    } finally {
      setSsoLoadingId(null);
    }
  };

  // Si un site est sélectionné, afficher la vue détaillée
  const activeTenant = tenants.find((t) => t.id === selectedTenantId);
  if (activeTenant) {
    return (
      <ClientStoreDetailView
        tenant={activeTenant}
        onBack={() => setSelectedTenantId(null)}
        onRefresh={onRefresh}
        salesRep={salesRep}
      />
    );
  }

  if (loading && tenants.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs font-black text-slate-800">Chargement de vos boutiques...</p>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-slate-900 shadow-brutal text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-300 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center mx-auto text-3xl">
          🏪
        </div>
        <h3 className="text-xl font-black text-slate-900">Vous n'avez pas encore de site boutique</h3>
        <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
          Lancez votre premier site et boutique en ligne en quelques clics. Votre vitrine et son administration seront immédiatement configurées.
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition active:translate-y-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer mon premier site</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-600" /> Mes Sites & Boutiques ({tenants.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Cliquez sur un site pour ouvrir sa fiche de gestion complète, ses modules et son abonnement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Nouveau site
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl border-2 border-slate-900 shadow-brutal-xs transition cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Liste des boutiques sous forme de cartes d'accès riches */}
      <div className="grid md:grid-cols-2 gap-6">
        {tenants.map((t) => {
          const modulesList: string[] = Array.isArray(t.modules) ? t.modules : [];
          const order = calculateModulesOrder(modulesList, 'monthly');

          return (
            <div
              key={t.id}
              onClick={() => setSelectedTenantId(t.id)}
              className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal hover:shadow-brutal-lg transition flex flex-col justify-between cursor-pointer group hover:border-blue-600"
            >
              <div>
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-400 group-hover:bg-amber-300 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-3xl font-black transition">
                      🏪
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-950 group-hover:text-blue-600 transition leading-tight">
                        {t.commerceName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-blue-600 font-mono text-xs font-bold mt-1">
                        <span>{t.subdomain}.woxxapp.de</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      t.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {t.status === 'ACTIVE' && <ShieldCheck className="w-3 h-3" />}
                    {t.status === 'PENDING' && <AlertTriangle className="w-3 h-3" />}
                    {t.status === 'ACTIVE' ? 'En ligne' : 'En attente'}
                  </span>
                </div>

                {/* Modules et tarifs */}
                <div className="my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Formule Active</span>
                    <span className="text-xs font-black text-slate-900">
                      {modulesList.length} module{modulesList.length > 1 ? 's' : ''} activé{modulesList.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Abonnement</span>
                    <span className="text-sm font-black text-slate-950 font-mono">
                      {order.totalTtc.toFixed(2)} € <span className="text-[10px] font-normal text-slate-500">/mois</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Bouton Détail */}
              <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => handleOpenSso(t.id, e)}
                  disabled={ssoLoadingId === t.id}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl border border-slate-900 shadow-brutal-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Accéder directement à l'administration du site"
                >
                  {ssoLoadingId === t.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>Admin 🚀</span>
                </button>

                <div className="inline-flex items-center gap-1 text-xs font-black text-blue-600 group-hover:translate-x-1 transition">
                  <span>Gérer ce site</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
