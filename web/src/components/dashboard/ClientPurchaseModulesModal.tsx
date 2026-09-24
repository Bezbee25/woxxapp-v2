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
  Receipt,
  AlertTriangle,
  RotateCcw,
  Clock
} from 'lucide-react';
import {
  MODULE_PROGRESSION_STEPS,
  DEFAULT_PRICING_CATALOG,
  ModulePricingItem,
  TaxSettings,
  calculateModulesOrder,
  calculateProrataOrder,
  parseTenantModules
} from '@/lib/modules-catalog';

interface ClientPurchaseModulesModalProps {
  isOpen: boolean;
  tenant: {
    id: string;
    commerceName: string;
    subdomain: string;
    modules: any;
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
  const [activeOriginalModules, setActiveOriginalModules] = useState<string[]>([]);
  const [unrenewedModules, setUnrenewedModules] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subscription, setSubscription] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<any | null>(null);

  // Modale de confirmation pour non-reconduction d'un module déjà payé
  const [confirmCancelModule, setConfirmCancelModule] = useState<ModulePricingItem | null>(null);

  // Données dynamiques de configuration
  const [pricingMap, setPricingMap] = useState<Record<string, ModulePricingItem>>(DEFAULT_PRICING_CATALOG);
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    taxType: 'MICRO_ENTERPRISE',
    vatRate: 0.0,
    isVatExempt: true,
    legalNotice: 'Franchise en base de TVA, art. 293 B du CGI',
    companyName: 'WoxxApp SAS',
  });

  useEffect(() => {
    fetch('/api/modules/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (data?.pricingMap) setPricingMap(data.pricingMap);
        if (data?.taxSettings) setTaxSettings(data.taxSettings);
      })
      .catch((err) => console.error('Erreur chargement catalogue:', err));

    fetch('/api/admin/subscriptions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.subscriptions) && data.subscriptions.length > 0) {
          const sub = data.subscriptions[0];
          setSubscription(sub);
          if (sub.billingCycle === 'yearly') {
            setBillingCycle('yearly');
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen && tenant) {
      const parsed = parseTenantModules(tenant.modules);
      const list = parsed.activeModules;
      if (!list.includes('site_web')) list.push('site_web');
      if (list.includes('ecommerce')) {
        if (!list.includes('accounting')) list.push('accounting');
        if (!list.includes('woxxpay')) list.push('woxxpay');
      }
      setActiveOriginalModules(list);
      setSelectedModules(Array.from(new Set(list)));
      setUnrenewedModules(parsed.unrenewedModules);
      setSuccessInvoice(null);
      setConfirmCancelModule(null);
    }
  }, [isOpen, tenant]);

  if (!isOpen || !tenant) return null;

  // Gestion du clic sur un module
  const handleModuleClick = (code: string) => {
    if (code === 'site_web') return; // Socle de base permanent

    const pricing = pricingMap[code] || DEFAULT_PRICING_CATALOG[code];
    const isCurrentlyActive = activeOriginalModules.includes(code);

    if (isCurrentlyActive) {
      // Le module est déjà actif et payé pour la période
      if (!unrenewedModules.includes(code)) {
        // Demande de non-reconduction -> ouvrir la modale de confirmation
        setConfirmCancelModule(pricing || {
          code,
          label: code,
          desc: '',
          category: '',
          priceMonthly: 0,
          priceYearly: 0,
        });
      } else {
        // Déjà marqué pour non-reconduction -> annuler la résiliation
        setUnrenewedModules((prev) => prev.filter((c) => c !== code));
      }
    } else {
      // C'est un nouveau module pas encore actif
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
    }
  };

  const handleConfirmCancellation = () => {
    if (confirmCancelModule) {
      setUnrenewedModules((prev) => Array.from(new Set([...prev, confirmCancelModule.code])));
      setConfirmCancelModule(null);
    }
  };

  const hasEcommerce = selectedModules.includes('ecommerce');

  // Nouveaux modules ajoutés qui nécessitent un paiement
  const newlyAddedModules = selectedModules.filter((m) => !activeOriginalModules.includes(m));

  // Calcul du coût : Prorata si annuel, ou mensuel si mensuel
  const isExistingYearly = subscription?.billingCycle === 'yearly' || billingCycle === 'yearly';
  const prorataCalculation = calculateProrataOrder(
    newlyAddedModules,
    isExistingYearly ? 'yearly' : 'monthly',
    subscription?.currentPeriodEnd || null,
    pricingMap,
    taxSettings
  );

  // Si première souscription (aucun module actif originellement)
  const fullOrder = calculateModulesOrder(selectedModules, billingCycle, pricingMap, taxSettings);
  const activeOrder = activeOriginalModules.length > 1 ? prorataCalculation : fullOrder;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/purchase-modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules: selectedModules,
          unrenewedModules,
          billingCycle,
          paymentMethod: 'STRIPE_CARD',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du traitement');
      }

      if (data.invoice) {
        setSuccessInvoice(data.invoice);
      } else {
        // Enregistrement sans frais
        onSuccess();
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-brutal w-full max-w-3xl p-6 space-y-5 max-h-[92vh] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">
                Catalogue & Gestion des Modules
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
              Vos nouveaux modules sont immédiatement synchronisés sur votre boutique. Votre facture officielle n° <span className="font-mono font-black text-slate-900">{successInvoice.invoiceNumber}</span> est disponible dans votre espace comptabilité.
            </p>
            <div className="pt-3">
              <button
                onClick={() => {
                  onClose();
                  onSuccess();
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal transition cursor-pointer"
              >
                Retour à ma boutique 🏪
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Info Abonnement & Cycle */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-700">Formule :</span>
                {subscription ? (
                  <span className="px-2.5 py-1 bg-slate-900 text-amber-300 font-black text-xs rounded-xl font-mono">
                    {subscription.billingCycle === 'yearly' ? 'Abonnement Annuel' : 'Abonnement Mensuel'}
                  </span>
                ) : (
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
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
                      className={`px-3 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer ${
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
                )}
              </div>

              {isExistingYearly && newlyAddedModules.length > 0 && (
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  ⚡ Prorata appliqué ({prorataCalculation.daysRemaining} jours restants)
                </span>
              )}
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
                        const pricing = pricingMap[mod.code] || DEFAULT_PRICING_CATALOG[mod.code];
                        const price = billingCycle === 'yearly' ? pricing?.priceYearly : pricing?.priceMonthly;
                        const isMandatory = mod.code === 'site_web';
                        const isLockedByEcommerce = hasEcommerce && mod.isCoreWithEcommerce;

                        const isCurrentlyActive = activeOriginalModules.includes(mod.code);
                        const isChecked = selectedModules.includes(mod.code);
                        const isUnrenewed = unrenewedModules.includes(mod.code);

                        return (
                          <div
                            key={mod.code}
                            onClick={() => !isMandatory && handleModuleClick(mod.code)}
                            className={`p-3 rounded-xl border-2 transition flex flex-col justify-between ${
                              isMandatory
                                ? 'bg-slate-100 border-slate-300 cursor-not-allowed opacity-85'
                                : isUnrenewed
                                ? 'bg-amber-50 border-amber-400 shadow-brutal-xs cursor-pointer'
                                : isChecked
                                ? 'bg-emerald-50/90 border-slate-900 shadow-brutal-xs cursor-pointer'
                                : 'bg-white border-slate-200 hover:border-slate-400 opacity-70 cursor-pointer'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-black text-slate-950">{pricing?.label || mod.label}</span>
                                  {isLockedByEcommerce && (
                                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-900 text-[9px] font-black rounded border border-emerald-300">
                                      Inclus
                                    </span>
                                  )}
                                  {isCurrentlyActive && !isUnrenewed && (
                                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded">
                                      Payé & Actif
                                    </span>
                                  )}
                                  {isUnrenewed && (
                                    <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[9px] font-black rounded border border-amber-400">
                                      Non reconduit
                                    </span>
                                  )}
                                </div>

                                {isUnrenewed ? (
                                  <span title="Cliquer pour annuler la non-reconduction">
                                    <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                                  </span>
                                ) : isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-slate-950 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium mt-1 leading-snug">
                                {pricing?.desc || mod.desc}
                              </p>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-black">
                              <span className="text-[10px] uppercase font-bold text-slate-400">Tarif</span>
                              <span className="text-slate-950 font-mono">
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
                    <Receipt className="w-3.5 h-3.5" />
                    {newlyAddedModules.length > 0
                      ? 'Nouveaux modules à activer'
                      : 'Modifications de votre formule'}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {activeOrder.isVatExempt ? (
                      <span className="text-emerald-400 font-bold">{activeOrder.legalNotice}</span>
                    ) : (
                      <span>Facturation avec TVA légale {activeOrder.vatRate}%</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Total HT</span>
                    <span className="font-mono text-xs font-bold text-slate-200">{activeOrder.totalHt.toFixed(2)} €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">
                      {activeOrder.isVatExempt ? 'TVA (0%)' : `TVA (${activeOrder.vatRate}%)`}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-200">{activeOrder.totalVat.toFixed(2)} €</span>
                  </div>
                  <div className="pl-3 border-l border-slate-800">
                    <span className="text-[10px] text-amber-300 block font-black uppercase">
                      {activeOrder.isVatExempt ? 'Net à Payer' : 'Total TTC'}
                    </span>
                    <span className="font-mono text-lg font-black text-amber-400">
                      {activeOrder.totalTtc.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Moyen de Paiement Stripe Exclusif & Bouton Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-800 text-slate-200 border border-slate-700 inline-flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Paiement sécurisé Carte Bancaire (Stripe)</span>
                  </span>
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
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {loading
                        ? 'Traitement en cours...'
                        : activeOrder.totalTtc === 0
                        ? 'Enregistrer les modifications'
                        : `Payer ${activeOrder.totalTtc.toFixed(2)} € par CB 💳`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* DIALOGUE DE CONFIRMATION DE NON-RECONDUCTION */}
        {confirmCancelModule && (
          <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-sm rounded-3xl p-6 flex items-center justify-center animate-in fade-in">
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-brutal max-w-md p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-2xl">
                ⚠️
              </div>
              <h4 className="text-base font-black text-slate-950">
                Programmer la non-reconduction du module ?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le module <span className="font-bold text-slate-900">{confirmCancelModule.label}</span> a déjà été payé pour la période en cours.
              </p>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 text-left space-y-1">
                <p>• <strong>Il reste actif</strong> sur votre boutique sans coupure jusqu’à votre prochaine date d’échéance.</p>
                <p>• <strong>Il ne sera pas renouvelé</strong> ni facturé lors du prochain prélèvement.</p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmCancelModule(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl border border-slate-900 cursor-pointer"
                >
                  Garder le module
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancellation}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal-xs cursor-pointer"
                >
                  Confirmer la non-reconduction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
