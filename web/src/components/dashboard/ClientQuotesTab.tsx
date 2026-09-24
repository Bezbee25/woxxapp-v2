'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ClientQuote {
  id: string;
  quoteNumber: string;
  title: string;
  totalHt: number;
  totalVat: number;
  totalTtc: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'PAID' | 'REJECTED';
  paymentMethod?: string;
  validUntil?: string;
  createdAt: string;
  salesRep?: { fullName?: string; email: string };
  items: Array<{ description: string; quantity: number; unitPriceHt: number }>;
}

export function ClientQuotesTab() {
  const [quotes, setQuotes] = useState<ClientQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<any[]>('/sales-rep/quotes');
      setQuotes(Array.isArray(data) ? data : []);
    } catch {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.quoteNumber.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'PENDING') return q.status !== 'PAID';
    if (filter === 'PAID') return q.status === 'PAID';
    return true;
  });

  const pendingCount = quotes.filter((q) => q.status !== 'PAID').length;
  const paidCount = quotes.filter((q) => q.status === 'PAID').length;

  return (
    <div className="space-y-6">
      {/* EN-TÊTE & SYNTHÈSE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              WoxxPay Direct
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" /> Mes Devis & Propositions ({quotes.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Consultez les offres commerciales personnalisées, suivez l'avancement et réglez vos prestations en toute sécurité.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={fetchQuotes}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl border-2 border-slate-900 shadow-brutal-xs transition"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI & RÉSUMÉ VISUEL (LOI DE PRÄGNANZ) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-brutal-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Total Devis</span>
          <span className="text-2xl font-black text-slate-950">{quotes.length}</span>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-600 shadow-brutal-xs">
          <span className="text-[10px] font-black uppercase text-amber-900 block mb-1">À Régler</span>
          <span className="text-2xl font-black text-amber-900">{pendingCount}</span>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-600 shadow-brutal-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-black uppercase text-emerald-900 block mb-1">Réglés & Réalisés</span>
          <span className="text-2xl font-black text-emerald-900">{paidCount}</span>
        </div>
      </div>

      {/* BARRE DE RECHERCHE ET FILTRES (LOI DE HICK) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou référence (WOXX-DEV...)"
            className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:shadow-brutal-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING', 'PAID'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition shadow-brutal-xs ${
                filter === mode ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {mode === 'ALL' ? 'Tous' : mode === 'PENDING' ? 'À régler' : 'Payés'}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU / LISTE */}
      {loading && quotes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-black text-slate-800">Chargement de vos devis...</p>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-slate-900 shadow-brutal text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-2xl">
            📑
          </div>
          <h3 className="text-lg font-black text-slate-900">Aucun devis trouvé</h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            {search ? 'Aucun devis ne correspond à vos critères de recherche.' : 'Lorsque votre chargé d’affaires établira une proposition, vous la retrouverez ici.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredQuotes.map((quote) => {
            const isPaid = quote.status === 'PAID';

            return (
              <div
                key={quote.id}
                className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal hover:shadow-brutal-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-mono font-black text-slate-400 block">{quote.quoteNumber}</span>
                      <h3 className="text-base font-black text-slate-950 leading-tight">{quote.title}</h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {isPaid ? <CheckCircle className="w-3 h-3 text-emerald-700" /> : <Clock className="w-3 h-3 text-amber-700" />}
                      <span>{isPaid ? 'Réglé & Validé' : 'En attente de règlement'}</span>
                    </span>
                  </div>

                  {/* STEPPER DE PROGRESSION (EFFET ZEIGARNIK) */}
                  <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-[10px] font-black mb-1.5">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> 1. Proposition émise
                      </span>
                      <span className={isPaid ? 'text-emerald-700 flex items-center gap-1' : 'text-amber-700'}>
                        {isPaid && <Check className="w-3 h-3" />} 2. Règlement WoxxPay
                      </span>
                      <span className={isPaid ? 'text-blue-700' : 'text-slate-400'}>
                        3. Réalisation
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isPaid ? 'w-full bg-emerald-500' : 'w-1/2 bg-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4 text-xs space-y-1.5">
                    <p className="text-slate-500 font-medium">
                      Conseiller dédié : <span className="font-bold text-slate-900">{quote.salesRep?.fullName || quote.salesRep?.email || 'Conseiller WoxxApp'}</span>
                    </p>
                    <p className="text-slate-500 font-medium">
                      Montant HT : <span className="font-bold text-slate-900">{quote.totalHt.toFixed(2)} €</span>
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-xs font-black text-slate-900">Total TTC à régler :</span>
                      <span className="text-base font-black text-emerald-700">{quote.totalTtc.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/quotes/${quote.id}`}
                    target="_blank"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Consulter le devis</span>
                  </Link>

                  {!isPaid ? (
                    <Link
                      href={`/quotes/${quote.id}`}
                      target="_blank"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Régler en ligne 🚀</span>
                    </Link>
                  ) : (
                    <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Prestation en cours
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
