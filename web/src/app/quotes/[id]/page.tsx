'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FileText,
  Building2,
  CreditCard,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Phone,
  MessageSquare,
  Calendar,
  Mail,
  User,
} from 'lucide-react';

interface QuoteDetail {
  id: string;
  quoteNumber: string;
  title: string;
  description?: string;
  totalHt: number;
  totalVat: number;
  totalTtc: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'PAID' | 'REJECTED';
  paymentMethod?: string;
  validUntil?: string;
  paidAt?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPriceHt: number;
    vatRate: number;
    totalHt: number;
    totalTtc: number;
  }>;
  bankDetails?: {
    iban: string;
    bic: string;
    beneficiary: string;
    amount: number;
    reference: string;
  } | null;
  client?: { fullName?: string; email: string };
  salesRep?: {
    fullName?: string;
    email: string;
    avatarUrl?: string;
    companyName?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    calendlyUrl?: string;
    bio?: string;
  };
}

export default function PublicQuotePage() {
  const params = useParams();
  const quoteId = params?.id as string;

  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'WOXXPAY_TRANSFER' | 'WOXXPAY_CARD'>('WOXXPAY_TRANSFER');
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const cleanWhatsapp = quote?.salesRep?.whatsappNumber?.replace(/[^0-9]/g, '');

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}`);
      if (!res.ok) throw new Error('Devis introuvable');
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.error('Erreur chargement devis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quoteId) fetchQuote();
  }, [quoteId]);

  const handlePay = async (method: 'WOXXPAY_TRANSFER' | 'WOXXPAY_CARD') => {
    setPaying(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Erreur lors du paiement');
      setSuccessMessage(data.message);
      fetchQuote();
    } catch (err: any) {
      alert(err.message || 'Erreur paiement');
    } finally {
      setPaying(false);
    }
  };

  const copyIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-black text-slate-800">Chargement de votre devis officiel...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-brutal text-center space-y-3">
          <div className="text-3xl">📄</div>
          <h1 className="text-lg font-black text-slate-900">Devis introuvable</h1>
          <p className="text-xs text-slate-600 font-medium">
            Le lien de ce devis est expiré ou invalide. Contactez votre chargé d'affaires WoxxApp.
          </p>
        </div>
      </div>
    );
  }

  const isPaid = quote.status === 'PAID';

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* EN-TÊTE LOGO & STATUT */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black">
              🏪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-950">WoxxApp</span>
                <span className="text-[10px] bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded font-black">
                  WoxxPay Certifié
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold">Plateforme de Commerce & Solutions Digitales</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase border flex items-center gap-1.5 ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  : 'bg-amber-100 text-amber-900 border-amber-400'
              }`}
            >
              {isPaid ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Clock className="w-4 h-4 text-amber-700" />}
              <span>{isPaid ? 'Devis Réglé & Validé' : 'En attente de règlement'}</span>
            </span>
          </div>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-4 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-brutal-xs animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* CORPS DU DEVIS */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-6">
          {/* INFORMATIONS PARTIES PRENANTES & CONTACT COMMERCIAL */}
          <div className="grid sm:grid-cols-2 gap-6 pb-6 border-b-2 border-slate-100">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Votre Chargé d'Affaires Dédié
              </span>

              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-slate-900 shadow-brutal-xs overflow-hidden flex items-center justify-center shrink-0">
                  {quote.salesRep?.avatarUrl ? (
                    <img
                      src={quote.salesRep.avatarUrl}
                      alt={quote.salesRep.fullName || 'Commercial'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-black text-slate-900">
                      {(quote.salesRep?.fullName || 'CA').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-black text-sm text-slate-950 truncate">
                    {quote.salesRep?.fullName || 'Conseiller WoxxApp'}
                  </p>
                  <p className="text-xs text-purple-700 font-bold truncate">
                    {quote.salesRep?.companyName || 'WoxxApp SAS'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{quote.salesRep?.email}</p>
                </div>
              </div>

              {quote.salesRep?.bio && (
                <p className="text-xs text-slate-600 font-medium italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  "{quote.salesRep.bio}"
                </p>
              )}

              {/* BOUTONS D'ÉCHANGE RAPIDE */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {quote.salesRep?.phoneNumber && (
                  <a
                    href={`tel:${quote.salesRep.phoneNumber}`}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-[11px] rounded-xl border-2 border-slate-900 shadow-brutal-xs transition flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Appeler</span>
                  </a>
                )}

                {cleanWhatsapp && (
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-[11px] rounded-xl border-2 border-slate-900 shadow-brutal-xs transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {quote.salesRep?.calendlyUrl && (
                  <a
                    href={quote.salesRep.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-[11px] rounded-xl border-2 border-slate-900 shadow-brutal-xs transition flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Prendre RDV</span>
                  </a>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                Client Destinataire
              </span>
              <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 shadow-brutal-xs space-y-1">
                <p className="font-black text-sm text-slate-950">{quote.client?.fullName || 'Client Professionnel'}</p>
                <p className="text-xs text-slate-600 font-medium font-mono">{quote.client?.email}</p>
              </div>
            </div>
          </div>

          {/* DÉTAILS DEVIS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500">Devis N° {quote.quoteNumber}</span>
                <h2 className="text-lg font-black text-slate-950">{quote.title}</h2>
              </div>
              {quote.validUntil && (
                <div className="text-xs font-bold text-slate-500">
                  Offre valable jusqu'au {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>

            {quote.description && (
              <p className="text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
                {quote.description}
              </p>
            )}

            {/* TABLEAU DES ARTICLES */}
            <div className="border-2 border-slate-900 rounded-2xl overflow-hidden mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black border-b-2 border-slate-900 text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Désignation</th>
                    <th className="px-4 py-3 text-center">Quantité</th>
                    <th className="px-4 py-3 text-right">Prix Unitaire HT</th>
                    <th className="px-4 py-3 text-right">TVA</th>
                    <th className="px-4 py-3 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-bold text-slate-900">
                  {quote.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5 font-medium">{item.description}</td>
                      <td className="px-4 py-3.5 text-center">{item.quantity}</td>
                      <td className="px-4 py-3.5 text-right">{item.unitPriceHt.toFixed(2)} €</td>
                      <td className="px-4 py-3.5 text-right font-medium">{item.vatRate}%</td>
                      <td className="px-4 py-3.5 text-right font-black">{item.totalHt.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTAUX */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs space-y-1">
                <p className="text-slate-300">Total HT net : <span className="font-bold text-white">{quote.totalHt.toFixed(2)} €</span></p>
                <p className="text-slate-300">Montant TVA (20%) : <span className="font-bold text-white">{quote.totalVat.toFixed(2)} €</span></p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Net à Payer TTC</span>
                <span className="text-3xl font-black text-amber-400">{quote.totalTtc.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE DE RÈGLEMENT OU CONFIRMATION PEAK-END */}
        {!isPaid ? (
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" /> Choisissez votre mode de règlement WoxxPay
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Plateforme de paiement sécurisée • Rapprochement comptable automatisé.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Séquestre 100% garanti</span>
              </div>
            </div>

            {/* SÉLECTEUR DE MÉTHODE DE PAIEMENT ERGONOMIQUE */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* OPTION VIREMENT BANCAIRE */}
              <div
                onClick={() => setPaymentMethod('WOXXPAY_TRANSFER')}
                className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all ${
                  paymentMethod === 'WOXXPAY_TRANSFER'
                    ? 'border-blue-600 bg-blue-50/70 shadow-brutal-xs ring-2 ring-blue-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center border-2 border-slate-900 shadow-brutal-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-950">Virement Bancaire SEPA</h4>
                      <p className="text-[11px] text-slate-500 font-bold">Instantané ou sous 24-48h</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'WOXXPAY_TRANSFER'
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {paymentMethod === 'WOXXPAY_TRANSFER' && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium mb-4">
                  Générez l'ordre de virement WoxxPay avec les coordonnées bancaires du compte séquestre.
                </p>

                {paymentMethod === 'WOXXPAY_TRANSFER' && (
                  <div className="bg-white p-4 rounded-xl border-2 border-blue-300 text-xs font-mono space-y-3 mb-4 animate-in fade-in">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans font-bold block">IBAN de Séquestre :</span>
                      <div className="flex items-center justify-between font-black text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1">
                        <span className="truncate pr-2">FR76 3000 4012 3456 7890 1234 567</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyIban('FR7630004012345678901234567');
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-sans font-black rounded-md flex items-center gap-1 shrink-0 transition"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? 'Copié !' : 'Copier'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-sans font-bold block">Référence obligatoire :</span>
                      <div className="flex items-center justify-between font-black text-blue-700 bg-blue-50/50 p-2 rounded-lg border border-blue-200 mt-1">
                        <span>WOXX-{quote.quoteNumber}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`WOXX-${quote.quoteNumber}`);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-sans font-black rounded-md flex items-center gap-1 shrink-0 transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copier</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handlePay('WOXXPAY_TRANSFER')}
                  disabled={paying}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {paying && paymentMethod === 'WOXXPAY_TRANSFER' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enregistrement du virement...</span>
                    </>
                  ) : (
                    <span>Valider le virement bancaire</span>
                  )}
                </button>
              </div>

              {/* OPTION CARTE BANCAIRE */}
              <div
                onClick={() => setPaymentMethod('WOXXPAY_CARD')}
                className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all ${
                  paymentMethod === 'WOXXPAY_CARD'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-brutal-xs ring-2 ring-emerald-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center border-2 border-slate-900 shadow-brutal-xs">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-950">Carte Bancaire (3D Secure)</h4>
                      <p className="text-[11px] text-emerald-800 font-bold">Règlement instantané</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'WOXXPAY_CARD'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {paymentMethod === 'WOXXPAY_CARD' && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium mb-4">
                  Paiement sécurisé immédiat. Déclenche immédiatement l'activation et la réalisation de vos services.
                </p>

                <div className="bg-white p-3.5 rounded-xl border-2 border-emerald-200 text-xs text-slate-600 space-y-1.5 mb-4">
                  <p className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Protégé par WoxxPay & 3D Secure
                  </p>
                  <p className="text-[11px]">Cartes acceptées : Visa, Mastercard, CB, Apple Pay.</p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePay('WOXXPAY_CARD')}
                  disabled={paying}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {paying && paymentMethod === 'WOXXPAY_CARD' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Règlement en cours...</span>
                    </>
                  ) : (
                    <span>Payer {quote.totalTtc.toFixed(2)} € par Carte</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* EXPÉRIENCE PEAK-END : CONFIRMATION CHALEUREUSE & SUIVI */
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-400 rounded-full text-xs font-black uppercase inline-flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-700" /> Devis Réglé & Acquitté
              </span>
              <h3 className="text-2xl font-black text-slate-950">Merci pour votre confiance !</h3>
              <p className="text-xs text-slate-600 font-medium">
                Votre règlement de <span className="font-bold text-slate-900">{quote.totalTtc.toFixed(2)} € TTC</span> a bien été validé par WoxxPay. Votre chargé d'affaires a été notifié et démarre dès maintenant la mise en œuvre de votre prestation.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Référence devis :</span>
                <span className="font-mono font-bold text-slate-900">{quote.quoteNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Chargé d'affaires dédié :</span>
                <span className="font-bold text-slate-900">{quote.salesRep?.fullName || quote.salesRep?.email || 'Conseiller Woxx'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Mode de règlement :</span>
                <span className="font-black text-emerald-700">WoxxPay Certifié</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Imprimer / Télécharger le Devis (PDF)</span>
              </button>

              <a
                href="/dashboard"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition flex items-center gap-2"
              >
                <span>Accéder à mon Espace Client</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
