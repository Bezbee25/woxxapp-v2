'use client';

import React, { useState } from 'react';
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
  Edit2
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { EditModulesModal } from '@/app/admin/components/EditModulesModal';

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
  const [ssoLoadingId, setSsoLoadingId] = useState<string | null>(null);
  const [editingModulesTenant, setEditingModulesTenant] = useState<ClientTenant | null>(null);

  const handleOpenSso = async (tenantId: string) => {
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

  const handleSaveModules = async (newModules: string[]) => {
    if (!editingModulesTenant) return;
    try {
      await apiRequest(`/tenants/${editingModulesTenant.id}/modules`, {
        method: 'PATCH',
        body: JSON.stringify({ modules: newModules }),
      });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour des modules');
    }
  };

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
        <h3 className="text-xl font-black text-slate-900">Vous n'avez pas encore de boutique</h3>
        <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
          Lancez votre première boutique en ligne en quelques clics. Votre site vitrine et son administration seront immédiatement configurés.
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition active:translate-y-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer ma première boutique</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-600" /> Mes Boutiques & Entreprises ({tenants.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Gérez vos sites en ligne, accédez à votre administration en 1 clic et activez des modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Nouvelle boutique
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl border-2 border-slate-900 shadow-brutal-xs transition"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tenants.map((t) => {
          const isDeployed = t.k8sStatus === 'ACTIVE' || t.k8sStatus === 'DEPLOYED' || t.status === 'ACTIVE';
          const modulesList: string[] = Array.isArray(t.modules) ? t.modules : [];

          return (
            <div
              key={t.id}
              className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal hover:shadow-brutal-lg transition flex flex-col justify-between"
            >
              <div>
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black">
                      🏪
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-950 leading-tight">
                        {t.commerceName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-blue-600 font-mono text-xs font-bold mt-1">
                        <span>{t.subdomain}.woxxapp.de</span>
                        <a
                          href={`https://${t.subdomain}.woxxapp.de`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-blue-800"
                          title="Ouvrir le site public"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      t.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : t.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {t.status === 'ACTIVE' && <ShieldCheck className="w-3 h-3" />}
                    {t.status === 'PENDING' && <AlertTriangle className="w-3 h-3" />}
                    {t.status}
                  </span>
                </div>

                {/* Domaine personnalisé si existant */}
                {t.customDomain && (
                  <div className="mb-4 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
                    <span className="font-bold">Domaine pro :</span>
                    <span className="text-slate-900 font-black">{t.customDomain}</span>
                  </div>
                )}

                {/* Modules actifs */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      Modules inclus
                    </span>
                    <button
                      onClick={() => setEditingModulesTenant(t)}
                      className="text-[11px] font-black text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Configurer
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-[10px] font-black flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Vitrine & Click/Collect
                    </span>
                    {modulesList.includes('ecommerce') && (
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-300 text-blue-900 text-[10px] font-black flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Vente CB
                      </span>
                    )}
                    {modulesList.includes('shipping') && (
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-300 text-indigo-900 text-[10px] font-black flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Transport
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="pt-4 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`https://${t.subdomain}.woxxapp.de`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Voir le site</span>
                </a>

                {/* Bouton SSO 1-Clic Direct vers l'Admin Boutique */}
                <button
                  onClick={() => handleOpenSso(t.id)}
                  disabled={ssoLoadingId === t.id}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  title="Ouvre immédiatement l'administration de votre boutique sans mot de passe supplémentaire"
                >
                  {ssoLoadingId === t.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>Gérer ma boutique (Admin) 🚀</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal d'édition des modules */}
      <EditModulesModal
        isOpen={!!editingModulesTenant}
        tenantName={editingModulesTenant?.commerceName || ''}
        initialModules={editingModulesTenant?.modules || []}
        onClose={() => setEditingModulesTenant(null)}
        onSave={handleSaveModules}
      />
    </div>
  );
}
