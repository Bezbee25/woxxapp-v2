'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  X,
  Check,
  CheckSquare,
  Square,
  Globe,
  ShoppingBag,
  Truck,
  BarChart3,
  Bell,
  CreditCard,
  Building2,
  Sparkles,
  ShieldCheck,
  Info,
  Calendar,
  Receipt
} from 'lucide-react';
import { MODULE_PROGRESSION_STEPS, MODULES_PRICING_CATALOG, calculateModulesOrder } from '@/lib/modules-catalog';

interface ClientPurchaseModulesModalProps {
  isOpen: boolean;
  tenant: {
    id: string;
    commerceName: string;
    subdomain: string;
    modules: string[];
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClientPurchaseModulesModal({
  isOpen,
  tenant,
  onClose,
  onSuccess,
}: ClientPurchaseModulesModalProps) {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'WOXXPAY_CARD' | 'WOXXPAY_TRANSFER'>('WOXXPAY_CARD');
  const [loading, setLoading] = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen && tenant) {
      const list = Array.isArray(tenant.modules) ? [...tenant.modules] : [];
      if (!list.includes('site_web')) list.push('site_web');
      if (list.includes('ecommerce')) {
        if (!list.includes('accounting')) list.push('accounting');
        if (!list.includes('woxxpay')) list.push('woxxpay');
      }
      setSelectedModules(Array.from(new Set(list)));
      setSuccessInvoice(null);
    }
  }, [isOpen, tenant]);

  if (!isOpen || !tenant) return null;

  const toggleModule = (code: string) => {
    if (code === 'site_web') return; // Socle de base permanent

    setSelectedModules((prev) => {
      const exists = prev.includes(code);
      if (exists) {
        return prev.filter((c) => c !== code);
      } else {
        if (code === 'ecommerce') {
          return Array.from(new Set([...prev, 'ecommerce', 'accounting', 'woxxpay']));
        }
        return [...prev, code];
      }
    });
  };

  const hasEcommerce = selectedModules.includes('ecommerce');
  const order = calculateModulesOrder(selectedModules, billingCycle);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/purchase-modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules: selectedModules,
          billingCycle,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du paiement');
      }
      setSuccessInvoice(data.invoice);
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-brutal w-full max-w-3xl p-6 space-y-5 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">
                Catalogue & Activation de Modules SaaS
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {tenant.commerceName} ({tenant.subdomain}.woxxapp.de)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successInvoice ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-3xl">
              ✅
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Paiement Confirmé & Modules Activés !
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
              Votre commande a été validée avec succès. Vos modules sont immédiatement synchronisés sur votre boutique en ligne et votre facture n° <span className="font-mono font-black text-slate-900">{successInvoice.invoiceNumber}</span> est disponible dans votre espace comptabilité.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal transition cursor-pointer"
              >
                Accéder à ma boutique
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sélecteur de Fréquence & Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-700">Formule d’engagement :</span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                      billingCycle === 'monthly'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                      billingCycle === 'yearly'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Annuel</span>
                    <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-black rounded">
                      -2 mois
                    </span>
                  </button>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-500">
                {selectedModules.length} module{selectedModules.length > 1 ? 's' : ''} sélectionné{selectedModules.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Liste des Modules par Étapes */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {MODULE_PROGRESSION_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-2xl border-2 border-slate-900/10 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                          {step.stepNumber}
                        </span>
                        <Icon className="w-4 h-4 text-slate-700" />
                        <h4 className="text-xs font-black text-slate-950">{step.stepTitle}</h4>
                      </div>
                      {step.badge && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium pl-8">{step.stepDesc}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                      {step.modules.map((mod) => {
                        const pricing = MODULES_PRICING_CATALOG[mod.code];
                        const price = billingCycle === 'yearly' ? pricing?.priceYearly : pricing?.priceMonthly;
                        const isChecked = selectedModules.includes(mod.code);
                        const isMandatory = mod.code === 'site_web';
                        const isLockedByEcommerce = hasEcommerce && mod.isCoreWithEcommerce;

                        return (
                          <div
                            key={mod.code}
                            onClick={() => !isMandatory && toggleModule(mod.code)}
                            className={`p-3 rounded-xl border-2 transition flex flex-col justify-between ${
                              isMandatory
                                ? 'bg-slate-100 border-slate-300 cursor-not-allowed opacity-85'
                                : isChecked
                                ? 'bg-amber-50/90 border-slate-900 shadow-brutal-xs cursor-pointer'
                                : 'bg-white border-slate-200 hover:border-slate-400 opacity-70 cursor-pointer'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-black text-slate-950">{mod.label}</span>
                                  {isLockedByEcommerce && (
                                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-900 text-[9px] font-black rounded border border-emerald-300">
                                      Inclus
                                    </span>
                                  )}
                                </div>
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-slate-950 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium mt-1 leading-snug">
                                {mod.desc}
                              </p>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-black">
                              <span className="text-[10px] uppercase font-bold text-slate-400">Tarif</span>
                              <span className="text-slate-950">
                                {price === 0 || isLockedByEcommerce ? (
                                  <span className="text-emerald-700 font-black">Inclus</span>
                                ) : (
                                  <span>{price} € / {billingCycle === 'yearly' ? 'an' : 'mois'}</span>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Récapitulatif Panier & Paiement */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5" /> Récapitulatif de votre commande
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Facturation {billingCycle === 'yearly' ? 'annuelle' : 'mensuelle'} immédiate avec TVA conforme 20%.
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Total HT</span>
                    <span className="font-mono text-xs font-bold text-slate-200">{order.totalHt.toFixed(2)} €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">TVA (20%)</span>
                    <span className="font-mono text-xs font-bold text-slate-200">{order.totalVat.toFixed(2)} €</span>
                  </div>
                  <div className="pl-3 border-l border-slate-800">
                    <span className="text-[10px] text-amber-300 block font-black uppercase">Total TTC</span>
                    <span className="font-mono text-lg font-black text-amber-400">
                      {order.totalTtc.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Moyen de Paiement & Bouton Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WOXXPAY_CARD')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border transition flex items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'WOXXPAY_CARD'
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-brutal-xs'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Carte Bancaire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WOXXPAY_TRANSFER')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border transition flex items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'WOXXPAY_TRANSFER'
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-brutal-xs'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Virement SEPA</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black border border-slate-700 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handlePurchase}
                    disabled={loading}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{loading ? 'Validation en cours...' : order.totalTtc === 0 ? 'Valider (Gratuit)' : 'Payer et Activer 🚀'}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
