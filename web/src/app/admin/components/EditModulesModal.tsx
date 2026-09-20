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
  ShieldCheck,
  Info
} from 'lucide-react';

export interface ModuleStepDefinition {
  stepNumber: number;
  stepTitle: string;
  stepDesc: string;
  icon: any;
  badge?: string;
  modules: {
    code: string;
    label: string;
    desc: string;
    isCoreWithEcommerce?: boolean;
  }[];
}

export const MODULE_PROGRESSION_STEPS: ModuleStepDefinition[] = [
  {
    stepNumber: 1,
    stepTitle: 'Site Vitrine & Catalogue',
    stepDesc: 'Socle obligatoire pour présenter vos produits et recevoir des contacts/devis.',
    icon: Globe,
    badge: 'Socle de Base',
    modules: [
      {
        code: 'site_web',
        label: 'Site Web & Catalogue Vitrine',
        desc: 'Pages d’accueil, catalogue produits, galerie, formulaire de contact et SEO.'
      }
    ]
  },
  {
    stepNumber: 2,
    stepTitle: 'Vente E-Commerce & Encaissement Légal',
    stepDesc: 'Tunnel de commande, panier d’achat, paiement sécurisé et facturation conforme obligatoire.',
    icon: ShoppingBag,
    badge: 'Essentiel Vente',
    modules: [
      {
        code: 'ecommerce',
        label: 'Boutique E-commerce & Stocks',
        desc: 'Panier d’achat, variantes (tailles/couleurs), gestion de stocks et commandes.'
      },
      {
        code: 'accounting',
        label: 'Facturation Légale & TVA',
        desc: 'Génération de factures conformes, avoirs, mentions légales et exports comptables.',
        isCoreWithEcommerce: true
      },
      {
        code: 'woxxpay',
        label: 'Paiements WoxxPay / CB Stripe',
        desc: 'Encaissement sécurisé par carte bancaire, virement, chèque et espèces.',
        isCoreWithEcommerce: true
      }
    ]
  },
  {
    stepNumber: 3,
    stepTitle: 'Logistique & Expéditions',
    stepDesc: 'Modes de mise à disposition des commandes (livraison ou retrait en boutique).',
    icon: Truck,
    modules: [
      {
        code: 'woxxship',
        label: 'Livraisons WoxxShip',
        desc: 'Impression d’étiquettes de transport (Colissimo, Mondial Relay) et suivi colis.'
      },
      {
        code: 'click_and_collect',
        label: 'Click & Collect / Table',
        desc: 'Retrait en boutique sur créneau horaire dédié et commande à table/comptoir.'
      }
    ]
  },
  {
    stepNumber: 4,
    stepTitle: 'Pilotage & Analyse des Ventes',
    stepDesc: 'Indicateurs de performance commerciale, panier moyen et suivi de rentabilité.',
    icon: BarChart3,
    modules: [
      {
        code: 'analytics',
        label: 'Statistiques & CA Avancés',
        desc: 'Tableaux de bord d’analyse du chiffre d’affaires, panier moyen et top ventes.'
      }
    ]
  },
  {
    stepNumber: 5,
    stepTitle: 'Notifications & Fidélisation',
    stepDesc: 'Alertes en direct et fidélisation de votre clientèle.',
    icon: Bell,
    modules: [
      {
        code: 'notifications',
        label: 'Alertes Telegram & Email',
        desc: 'Notification instantanée sur smartphone de chaque commande via Bot Telegram.'
      },
      {
        code: 'loyalty_coupons',
        label: 'Fidélité & Codes Promo',
        desc: 'Cartes cadeaux, avoirs clients, remises panier et codes promotionnels.'
      }
    ]
  }
];

export const REAL_BOUTIQUE_MODULES = MODULE_PROGRESSION_STEPS.flatMap((s) => s.modules);

interface EditModulesModalProps {
  isOpen: boolean;
  tenantName: string;
  initialModules: string[];
  onClose: () => void;
  onSave: (modules: string[]) => Promise<void>;
}

export function EditModulesModal({
  isOpen,
  tenantName,
  initialModules,
  onClose,
  onSave,
}: EditModulesModalProps) {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const list = [...(initialModules || [])];
      // Toujours inclure site_web
      if (!list.includes('site_web')) list.push('site_web');
      // Si ecommerce est coché, auto-inclure facturation & paiement
      if (list.includes('ecommerce')) {
        if (!list.includes('accounting')) list.push('accounting');
        if (!list.includes('woxxpay')) list.push('woxxpay');
      }
      setSelectedModules(list);
    }
  }, [isOpen, initialModules]);

  if (!isOpen) return null;

  const toggleModule = (code: string) => {
    if (code === 'site_web') return; // Socle permanent

    setSelectedModules((prev) => {
      const exists = prev.includes(code);
      if (exists) {
        // Si on désactive ecommerce, on retire ecommerce
        return prev.filter((c) => c !== code);
      } else {
        // Si on active ecommerce, on active obligatoirement accounting et woxxpay
        if (code === 'ecommerce') {
          return Array.from(new Set([...prev, 'ecommerce', 'accounting', 'woxxpay']));
        }
        return [...prev, code];
      }
    });
  };

  const selectAll = () => {
    setSelectedModules(REAL_BOUTIQUE_MODULES.map((m) => m.code));
  };

  const deselectAll = () => {
    setSelectedModules(['site_web']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(selectedModules);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const hasEcommerce = selectedModules.includes('ecommerce');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-brutal w-full max-w-2xl p-6 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">Chemin d’Activation des Modules</h3>
              <p className="text-xs text-slate-500 font-medium">{tenantName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Rapide & Info Progression */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-900 text-white rounded-lg text-[10px] font-black">
              {hasEcommerce ? 'Mode E-Commerce Actif' : 'Mode Vitrine Stricte'}
            </span>
            <span>{selectedModules.length} modules actifs</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-blue-600 hover:text-blue-800 underline text-xs"
            >
              Tout activer
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={deselectAll}
              className="text-slate-500 hover:text-slate-700 underline text-xs"
            >
              Vitrine seule
            </button>
          </div>
        </div>

        {/* Cheminement par Étapes */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {MODULE_PROGRESSION_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="p-4 rounded-2xl border-2 border-slate-900/10 bg-slate-50/50 space-y-3"
              >
                {/* Titre de l'étape */}
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

                {/* Modules de l'étape */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                  {step.modules.map((mod) => {
                    const isChecked = selectedModules.includes(mod.code);
                    const isMandatory = mod.code === 'site_web';
                    const isLockedByEcommerce = hasEcommerce && mod.isCoreWithEcommerce;

                    return (
                      <div
                        key={mod.code}
                        onClick={() => !isMandatory && toggleModule(mod.code)}
                        className={`p-3 rounded-xl border-2 transition flex flex-col justify-between ${
                          isMandatory
                            ? 'bg-slate-100 border-slate-300 cursor-not-allowed opacity-80'
                            : isChecked
                            ? 'bg-amber-50/90 border-slate-900 shadow-brutal-xs cursor-pointer'
                            : 'bg-white border-slate-200 hover:border-slate-400 opacity-60 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-950">{mod.label}</span>
                            {isLockedByEcommerce && (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-900 text-[9px] font-black rounded border border-emerald-300">
                                Inclus E-com
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
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Facturation & Paiement inclus d'office avec E-commerce.</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black border-2 border-slate-900"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modules'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

