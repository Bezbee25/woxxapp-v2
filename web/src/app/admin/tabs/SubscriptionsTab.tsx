'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface SubscriptionData {
  subscriptions: Array<{
    id: string;
    billingCycle: string;
    status: string;
    currentPeriodEnd?: string;
    createdAt: string;
    user?: { email: string; fullName?: string };
  }>;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    totalHt: number;
    totalVat: number;
    totalTtc: number;
    vatRate: number;
    isVatExempt: boolean;
    legalNotice?: string;
    status: string;
    createdAt: string;
    user?: { email: string; fullName?: string };
  }>;
  stats: {
    totalRevenueTtc: number;
    totalRevenueHt: number;
    activeSubscriptionsCount: number;
    totalInvoicesCount: number;
  };
}

export function SubscriptionsTab() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<SubscriptionData>('/admin/subscriptions');
      setData(res);
    } catch (err) {
      console.error('Erreur chargement abonnements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" /> Abonnements & Facturation Directe
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Suivi des encaissements WoxxPay (15 €/mois ou 150 €/an) et registre des factures.
          </p>
        </div>

        <button
          onClick={fetchSubscriptions}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition border-2 border-slate-900 shadow-brutal-xs self-start md:self-auto"
          title="Rafraîchir"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-slate-900 p-5 rounded-3xl shadow-brutal">
          <div className="flex items-center justify-between text-slate-600 text-xs font-black uppercase mb-2">
            <span>Revenu Total TTC</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-950">
            {data?.stats?.totalRevenueTtc?.toFixed(2) || '0.00'} €
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 p-5 rounded-3xl shadow-brutal">
          <div className="flex items-center justify-between text-slate-600 text-xs font-black uppercase mb-2">
            <span>Revenu Total HT</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600">
            {data?.stats?.totalRevenueHt?.toFixed(2) || '0.00'} €
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 p-5 rounded-3xl shadow-brutal">
          <div className="flex items-center justify-between text-slate-600 text-xs font-black uppercase mb-2">
            <span>Abonnements Actifs</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-950">
            {data?.stats?.activeSubscriptionsCount || 0}
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 p-5 rounded-3xl shadow-brutal">
          <div className="flex items-center justify-between text-slate-600 text-xs font-black uppercase mb-2">
            <span>Factures Émises</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-500">
            {data?.stats?.totalInvoicesCount || 0}
          </div>
        </div>
      </div>

      {/* Table des Factures Récentes */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-brutal">
        <div className="p-5 bg-slate-50 border-b-2 border-slate-900 font-black text-sm text-slate-950 flex items-center justify-between">
          <span>Dernières Factures Émises</span>
          <span className="text-xs text-slate-500 font-bold">Conservation décennale Art. L123-22</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-white text-slate-700 uppercase font-black border-b-2 border-slate-900">
              <tr>
                <th className="px-5 py-4">N° Facture</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Montant HT</th>
                <th className="px-5 py-4">TVA</th>
                <th className="px-5 py-4">Montant TTC</th>
                <th className="px-5 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-bold text-slate-900">
              {data?.invoices?.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4 font-mono font-black text-blue-600">{inv.invoiceNumber}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {new Date(inv.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-950 font-black">{inv.user?.fullName || 'Client'}</div>
                    <div className="text-slate-500 text-[11px] font-mono font-normal">{inv.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-black">{inv.totalHt.toFixed(2)} €</td>
                  <td className="px-5 py-4 font-mono text-slate-600">
                    {inv.isVatExempt ? '0.00 € (Exo)' : `${inv.totalVat.toFixed(2)} € (${inv.vatRate}%)`}
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-slate-950">{inv.totalTtc.toFixed(2)} €</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle className="w-3 h-3" /> {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.invoices || data.invoices.length === 0) && !loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500 font-bold">
                    Aucune facture émise pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
