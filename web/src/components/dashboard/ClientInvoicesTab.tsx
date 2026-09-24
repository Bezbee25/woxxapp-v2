'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface Invoice {
  id: string;
  invoiceNumber: string;
  totalHt: number;
  totalVat: number;
  totalTtc: number;
  status: string;
  pdfUrl?: string;
  createdAt: string;
}

export function ClientInvoicesTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<Invoice[]>('/admin/subscriptions');
      // Pour les clients, afficher la liste
      setInvoices(Array.isArray(data) ? data : []);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Factures & Comptabilité
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Téléchargez vos factures d'abonnement et de modules en PDF certifié conforme.
          </p>
        </div>

        <button
          onClick={fetchInvoices}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl border-2 border-slate-900 shadow-brutal-xs transition self-start sm:self-auto"
          title="Rafraîchir"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal">
        {loading ? (
          <div className="py-12 text-center text-xs font-black text-slate-700 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            <span>Chargement de vos documents comptables...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-2xl">
              📄
            </div>
            <p className="text-xs font-black text-slate-900">Aucune facture émise pour le moment.</p>
            <p className="text-[11px] text-slate-500 font-medium max-w-sm mx-auto">
              Vos prochaines factures d'abonnement apparaîtront ici avec possibilité de téléchargement instantané.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 uppercase font-black border-b-2 border-slate-900">
                <tr>
                  <th className="px-4 py-3">Numéro Facture</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total HT</th>
                  <th className="px-4 py-3">Total TTC</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-bold text-slate-900">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      {new Date(inv.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">{inv.totalHt.toFixed(2)} €</td>
                    <td className="px-4 py-3 font-black">{inv.totalTtc.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle className="w-3 h-3" /> Payée
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.pdfUrl ? (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-black inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-normal">Disponible sous peu</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
