'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Store,
  ExternalLink,
  Key,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Globe,
  Layers,
  CreditCard,
  Calendar,
  Sparkles,
  ShoppingBag,
  Truck,
  Clock,
  BarChart3,
  Bell,
  Gift,
  PlusCircle,
  Edit2,
  CheckCircle2,
  HelpCircle,
  UserCheck,
  Phone,
  MessageSquare
} from 'lucide-react';
import { ClientTenant } from './ClientStoresList';
import { MODULES_PRICING_CATALOG, calculateModulesOrder } from '@/lib/modules-catalog';
import { ClientPurchaseModulesModal } from './ClientPurchaseModulesModal';

interface ClientStoreDetailViewProps {
  tenant: ClientTenant;
  onBack: () => void;
  onRefresh: () => void;
  salesRep?: any;
}

export function ClientStoreDetailView({
  tenant,
  onBack,
  onRefresh,
  salesRep,
}: ClientStoreDetailViewProps) {
  const [ssoLoading, setSsoLoading] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const modulesList: string[] = Array.isArray(tenant.modules) ? tenant.modules : [];
  const orderCalc = calculateModulesOrder(modulesList, 'monthly');
  const yearlyCalc = calculateModulesOrder(modulesList, 'yearly');

  const handleOpenSso = async () => {
    setSsoLoading(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/sso`, {
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
      setSsoLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Barre de retour et Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à toutes mes boutiques</span>
        </button>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border ${
            tenant.status === 'ACTIVE'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}
        >
          {tenant.status === 'ACTIVE' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          Boutique {tenant.status === 'ACTIVE' ? 'En ligne & Active' : 'En attente de déploiement'}
        </span>
      </div>

      {/* HEADER PRINCIPAL DU SITE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-3xl font-black shrink-0">
            🏪
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {tenant.commerceName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <a
                href={`https://${tenant.subdomain}.woxxapp.de`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 font-mono text-xs font-bold inline-flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
              >
                <span>{tenant.subdomain}.woxxapp.de</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {tenant.customDomain && (
                <span className="text-slate-800 font-mono text-xs font-bold inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Globe className="w-3.5 h-3.5 text-slate-600" />
                  <span>{tenant.customDomain}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Boutons d'accès directs */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://${tenant.subdomain}.woxxapp.de`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-2xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition inline-flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Voir le site public</span>
          </a>

          <button
            onClick={handleOpenSso}
            disabled={ssoLoading}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-2xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Accès sécurisé 1-clic au tableau de bord administrateur de votre boutique"
          >
            {ssoLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Key className="w-4 h-4" />
            )}
            <span>Gérer ma boutique (Admin Backoffice) 🚀</span>
          </button>
        </div>
      </div>

      {/* GRILLE 2 COLONNES : FINANCES / ABONNEMENT + DOMAINE */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* CARTE FINANCIÈRE & COÛT DU SITE */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase text-amber-300">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Coût & Abonnement
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px]">
                Actif
              </span>
            </div>

            <div>
              <div className="text-3xl font-black text-white font-mono">
                {orderCalc.totalTtc.toFixed(2)} € <span className="text-sm font-normal text-slate-300">/ mois</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Soit {orderCalc.totalHt.toFixed(2)} € HT/mois (+ {orderCalc.totalVat.toFixed(2)} € TVA 20%)
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Option Annuelle :</span>
                <span className="font-bold text-amber-300 font-mono">{yearlyCalc.totalTtc.toFixed(2)} € TTC/an</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Économisez 2 mois d'abonnement en optant pour la facturation annuelle.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Changer de formule / Modules</span>
          </button>
        </div>

        {/* NOM DE DOMAINE & RÉSEAU */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2 uppercase tracking-wide">
              <Globe className="w-4 h-4 text-blue-600" /> Nom de Domaine & Accès
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Sous-domaine Gratuit Woxx</span>
              <div className="font-mono text-xs font-black text-blue-600 break-all">
                https://{tenant.subdomain}.woxxapp.de
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3 h-3" /> Certificat SSL Let's Encrypt Actif
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Domaine Personnalisé</span>
              <div className="font-mono text-xs font-black text-slate-900">
                {tenant.customDomain || 'Aucun domaine personnalisé lié'}
              </div>
              <p className="text-[10px] text-slate-500">
                Pour relier votre propre domaine (ex: <span className="font-mono">www.moncommerce.fr</span>), ajoutez un enregistrement CNAME pointant vers <span className="font-mono">cname.woxxapp.de</span>.
              </p>
            </div>
          </div>
        </div>

        {/* CONSEILLER DÉDIÉ DU SITE */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2 uppercase tracking-wide">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Conseiller Dédié
            </h3>

            {salesRep ? (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 border border-slate-900 flex items-center justify-center font-black text-slate-950">
                    {(salesRep.fullName || salesRep.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-950">{salesRep.fullName || 'Chargé d’Affaires'}</div>
                    <div className="text-[10px] text-slate-500">{salesRep.email}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {salesRep.phoneNumber && (
                    <a
                      href={`tel:${salesRep.phoneNumber}`}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 text-[10px] font-bold text-slate-900 inline-flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-blue-600" /> Appeler
                    </a>
                  )}
                  {salesRep.whatsappNumber && (
                    <a
                      href={`https://wa.me/${salesRep.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg border border-slate-900 text-[10px] font-black inline-flex items-center gap-1 shadow-brutal-xs"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <p className="text-xs font-medium text-slate-600">
                  Vous n'avez pas encore sélectionné de conseiller dédié.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODULES ACTIFS & CATALOGUE DÉTAILLÉ */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-brutal space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" /> Modules & Fonctionnalités Activés ({modulesList.length})
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Liste des fonctionnalités actuellement déployées et opérationnelles sur votre boutique.
            </p>
          </div>

          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter / Modifier mes modules</span>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulesList.map((code) => {
            const pricing = MODULES_PRICING_CATALOG[code];
            const label = pricing?.label || code;
            const desc = pricing?.desc || 'Fonctionnalité active sur votre instance.';
            const price = pricing?.priceMonthly || 0;

            return (
              <div
                key={code}
                className="p-4 rounded-2xl border-2 border-slate-900 bg-slate-50/60 shadow-brutal-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-slate-950">{label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Actif ✅
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                    {desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-[10px] text-slate-400 uppercase">Tarif</span>
                  <span className="text-slate-950 font-black font-mono">
                    {price === 0 ? (
                      <span className="text-emerald-700">Inclus de base</span>
                    ) : (
                      `${price.toFixed(2)} € / mois`
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal d'Achat & Modification des Modules */}
      <ClientPurchaseModulesModal
        isOpen={isPurchaseModalOpen}
        tenant={{
          id: tenant.id,
          commerceName: tenant.commerceName,
          subdomain: tenant.subdomain,
          modules: tenant.modules,
        }}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSuccess={() => {
          onRefresh();
        }}
      />
    </div>
  );
}
