'use client';

import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  RefreshCw,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Send,
  AlertTriangle,
  Search,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface SalesRepQuotesTabProps {
  quotes: any[];
  loading: boolean;
  onRefresh: () => void;
  onOpenCreateQuote: () => void;
  onOpenPaymentModal: (quote: any) => void;
}

export function SalesRepQuotesTab({
  quotes,
  loading,
  onRefresh,
  onOpenCreateQuote,
  onOpenPaymentModal,
}: SalesRepQuotesTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter = filter === 'ALL' || q.status === filter;
    const matchesSearch =
      q.quoteNumber?.toLowerCase().includes(search.toLowerCase()) ||
      q.title?.toLowerCase().includes(search.toLowerCase()) ||
      q.client?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      q.client?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalQuotesCount = quotes.length;
  const paidQuotes = quotes.filter((q) => q.status === 'PAID');
  const totalPaidRevenue = paidQuotes.reduce((acc, q) => acc + (q.totalTtc || 0), 0);
  const pendingQuotes = quotes.filter((q) => q.status === 'SENT' || q.status === 'ACCEPTED');
  const totalPendingRevenue = pendingQuotes.reduce((acc, q) => acc + (q.totalTtc || 0), 0);

  const handleCopyLink = (quoteId: string) => {
    const url = `${window.location.origin}/quotes/${quoteId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(quoteId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendQuote = async (quoteId: string) => {
    try {
      await apiRequest(`/sales-rep/quotes/${quoteId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'SENT' }),
      });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’envoi');
    }
  };

  const handleDelete = async (quoteId: string) => {
    if (!confirm('Supprimer définitivement ce devis ?')) return;
    try {
      await apiRequest(`/sales-rep/quotes/${quoteId}`, { method: 'DELETE' });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur suppression');
    }
  };

  return (
    <div className="space-y-6">
      {/* EN-TÊTE PRINCIPAL */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" /> Devis & Encaissements WoxxPay ({quotes.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Gérez vos propositions tarifaires, suivez les encaissements et validez les virements WoxxPay.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCreateQuote}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Nouveau Devis
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

      {/* SYNTHÈSE DES CHIFFRES (LOI DE PRÄGNANZ) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-brutal-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Total Devis Émis</span>
          <span className="text-2xl font-black text-slate-950">{totalQuotesCount}</span>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-600 shadow-brutal-xs">
          <span className="text-[10px] font-black uppercase text-emerald-900 block mb-1">CA Encaissé TTC</span>
          <span className="text-2xl font-black text-emerald-950">{totalPaidRevenue.toFixed(2)} €</span>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-600 shadow-brutal-xs">
          <span className="text-[10px] font-black uppercase text-amber-900 block mb-1">En Cours de Paiement</span>
          <span className="text-2xl font-black text-amber-950">{totalPendingRevenue.toFixed(2)} €</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-600 shadow-brutal-xs">
          <span className="text-[10px] font-black uppercase text-blue-900 block mb-1">Taux Conversion</span>
          <span className="text-2xl font-black text-blue-950">
            {totalQuotesCount > 0 ? Math.round((paidQuotes.length / totalQuotesCount) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* RECHERCHE & FILTRES RAPIDES (LOI DE HICK) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par numéro, titre ou nom/email client..."
            className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:shadow-brutal-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'ALL', label: 'Tous' },
            { key: 'DRAFT', label: 'Brouillons' },
            { key: 'SENT', label: 'Envoyés' },
            { key: 'ACCEPTED', label: 'En attente' },
            { key: 'PAID', label: 'Payés' },
            { key: 'REJECTED', label: 'Refusés' },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setFilter(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition shadow-brutal-xs ${
                filter === st.key ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {loading && quotes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-black text-slate-800">Chargement de vos devis...</p>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-slate-900 shadow-brutal text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-3xl">
            📑
          </div>
          <h3 className="text-xl font-black text-slate-900">Aucun devis dans cette catégorie</h3>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            Créez une nouvelle proposition commerciale pour l'un de vos commerçants.
          </p>
          <button
            onClick={onOpenCreateQuote}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal transition"
          >
            <PlusCircle className="w-4 h-4" /> Créer un devis
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-brutal">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 uppercase font-black border-b-2 border-slate-900">
                <tr>
                  <th className="px-5 py-4">Numéro & Intitulé</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Montant TTC</th>
                  <th className="px-5 py-4">Statut</th>
                  <th className="px-5 py-4">Mode / Paiement</th>
                  <th className="px-5 py-4 text-right">Actions & Règlement</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-bold text-slate-900">
                {filteredQuotes.map((q) => {
                  const items = Array.isArray(q.items) ? q.items : [];
                  const isPaid = q.status === 'PAID';

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs font-black text-slate-950">{q.quoteNumber}</div>
                        <div className="text-slate-600 text-xs font-bold mt-0.5">{q.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {items.length} article{items.length > 1 ? 's' : ''} • Créé le {new Date(q.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-950 font-black">{q.client?.fullName || 'Client'}</div>
                        <div className="text-slate-500 font-normal text-[11px] font-mono">{q.client?.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-black text-slate-950">{q.totalTtc.toFixed(2)} €</div>
                        <div className="text-[10px] text-slate-500 font-medium">{q.totalHt.toFixed(2)} € HT</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                            q.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : q.status === 'ACCEPTED'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : q.status === 'SENT'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          {q.status === 'PAID' && <CheckCircle className="w-3 h-3" />}
                          {q.status === 'ACCEPTED' && <Clock className="w-3 h-3" />}
                          {q.status === 'SENT' && <Send className="w-3 h-3" />}
                          {q.status === 'DRAFT' && 'Brouillon'}
                          {q.status === 'SENT' && 'Envoyé'}
                          {q.status === 'ACCEPTED' && 'Validé / Attente'}
                          {q.status === 'PAID' && 'Payé WoxxPay'}
                          {q.status === 'REJECTED' && 'Refusé'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {q.paymentMethod === 'WOXXPAY_TRANSFER' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700">
                            <Building2 className="w-3.5 h-3.5" /> Virement SEPA
                          </span>
                        )}
                        {q.paymentMethod === 'WOXXPAY_CARD' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <CreditCard className="w-3.5 h-3.5" /> Carte Bancaire
                          </span>
                        )}
                        {!q.paymentMethod && <span className="text-slate-400 text-[11px] italic">Non défini</span>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Copier lien de paiement client */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(q.id)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-900 transition"
                            title="Copier le lien direct de paiement pour le client"
                          >
                            {copiedId === q.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          {/* Ouvrir la page de devis publique */}
                          <a
                            href={`/quotes/${q.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-900 transition"
                            title="Consulter la facture / devis"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Bouton Paiement WoxxPay */}
                          {!isPaid && (
                            <button
                              onClick={() => onOpenPaymentModal(q)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Faire payer (WoxxPay) 🚀</span>
                            </button>
                          )}

                          {!isPaid && (
                            <button
                              onClick={() => handleDelete(q.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
