'use client';

import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Building2, Copy, Check, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface QuotePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  quote: {
    id: string;
    quoteNumber: string;
    title: string;
    totalTtc: number;
    status: string;
    client?: { fullName?: string; email: string };
  } | null;
}

export function QuotePaymentModal({
  isOpen,
  onClose,
  onSuccess,
  quote,
}: QuotePaymentModalProps) {
  const [method, setMethod] = useState<'WOXXPAY_TRANSFER' | 'WOXXPAY_CARD'>('WOXXPAY_TRANSFER');
  const [transferDetails, setTransferDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!isOpen || !quote) return null;

  const handleGenerateTransfer = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<any>(`/sales-rep/quotes/${quote.id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ method: 'WOXXPAY_TRANSFER', confirmReceived: false }),
      });
      if (res && res.transferDetails) {
        setTransferDetails(res.transferDetails);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la génération du virement');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPaid = async () => {
    setConfirming(true);
    try {
      await apiRequest(`/sales-rep/quotes/${quote.id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ method, confirmReceived: true }),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Erreur confirmation paiement');
    } finally {
      setConfirming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white border-2 border-slate-900 rounded-3xl shadow-brutal-lg p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shadow-brutal-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black">
            💳
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Encaissement WoxxPay</h2>
            <p className="text-xs text-slate-500 font-bold">
              Devis {quote.quoteNumber} • {quote.totalTtc.toFixed(2)} € TTC
            </p>
          </div>
        </div>

        {/* CHOIX DU MODE DE PAIEMENT */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setMethod('WOXXPAY_TRANSFER');
              if (!transferDetails) handleGenerateTransfer();
            }}
            className={`p-4 rounded-2xl border-2 border-slate-900 transition text-left flex flex-col justify-between ${
              method === 'WOXXPAY_TRANSFER'
                ? 'bg-blue-50 border-blue-900 shadow-brutal-xs font-black'
                : 'bg-white hover:bg-slate-50 font-bold'
            }`}
          >
            <Building2 className="w-6 h-6 text-blue-700 mb-2" />
            <div>
              <span className="text-xs text-slate-900 block">Virement Bancaire (WoxxPay)</span>
              <span className="text-[10px] text-slate-500 font-normal">RIB/IBAN dédié avec référence</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod('WOXXPAY_CARD')}
            className={`p-4 rounded-2xl border-2 border-slate-900 transition text-left flex flex-col justify-between ${
              method === 'WOXXPAY_CARD'
                ? 'bg-emerald-50 border-emerald-900 shadow-brutal-xs font-black'
                : 'bg-white hover:bg-slate-50 font-bold'
            }`}
          >
            <CreditCard className="w-6 h-6 text-emerald-700 mb-2" />
            <div>
              <span className="text-xs text-slate-900 block">Carte Bancaire (CB)</span>
              <span className="text-[10px] text-slate-500 font-normal">Stripe Connect WoxxPay</span>
            </div>
          </button>
        </div>

        {/* CONTENU VIREMENT BANCAIRE */}
        {method === 'WOXXPAY_TRANSFER' && (
          <div className="space-y-4 mb-6">
            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 shadow-brutal-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black text-slate-900">Coordonnées de virement SEPA</span>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">
                  Compte Séquestre WoxxPay
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Bénéficiaire</span>
                  <p className="font-bold text-slate-950">WoxxApp SAS (WoxxPay Services)</p>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase block">IBAN</span>
                  <div className="flex items-center justify-between font-mono font-bold text-slate-950 bg-white p-2 rounded-lg border border-slate-300">
                    <span>FR76 3000 4012 3456 7890 1234 567</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('FR7630004012345678901234567')}
                      className="p-1 hover:bg-slate-100 rounded text-blue-600"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase block">BIC / SWIFT</span>
                    <p className="font-mono font-bold text-slate-950">BNPAFRPP</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Référence Obligatoire</span>
                    <p className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      WOXX-{quote.quoteNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 font-medium">
              💡 Transmettez ces informations au client ou invitez-le à régler directement sur la page client sécurisée.
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`/quotes/${quote.id}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-black text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            Ouvrir la page client de paiement ↗
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border-2 border-slate-900 text-xs font-black bg-white hover:bg-slate-100 text-slate-800 transition"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleConfirmPaid}
              disabled={confirming}
              className="px-5 py-2.5 rounded-xl border-2 border-slate-900 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-brutal hover:shadow-brutal-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {confirming ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validation en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Valider & Encaisser le Devis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
