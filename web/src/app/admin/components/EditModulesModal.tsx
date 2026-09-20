'use client';

import React, { useState, useEffect } from 'react';
import { Layers, X, Check, CheckSquare, Square } from 'lucide-react';

export interface ModuleDefinition {
  code: string;
  label: string;
  desc: string;
}

export const REAL_BOUTIQUE_MODULES: ModuleDefinition[] = [
  { code: 'ecommerce', label: 'E-commerce & Stocks', desc: 'Gestion des produits, variantes, attributs et alertes stock.' },
  { code: 'click_and_collect', label: 'Click & Collect / Table', desc: 'Retrait sur créneau horaire et commande à table en direct.' },
  { code: 'woxxpay', label: 'Paiements WoxxPay / Stripe', desc: 'Paiement sécurisé par CB, espèces, chèque et virement.' },
  { code: 'woxxship', label: 'Livraisons WoxxShip', desc: 'Gestion des transporteurs, étiquettes et frais de port.' },
  { code: 'accounting', label: 'Facturation & Comptabilité', desc: 'Factures conformes, avoirs, TVA et exports comptables.' },
  { code: 'loyalty_coupons', label: 'Fidélité & Codes Promo', desc: 'Cartes cadeaux, avoirs clients et réductions.' },
  { code: 'analytics', label: 'Statistiques & CA', desc: 'Tableaux de bord d’analyse des ventes et du panier moyen.' },
  { code: 'notifications', label: 'Alertes Telegram & Email', desc: 'Notifications de commande en temps réel sur Telegram.' },
];

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
      setSelectedModules(initialModules || []);
    }
  }, [isOpen, initialModules]);

  if (!isOpen) return null;

  const toggleModule = (code: string) => {
    setSelectedModules((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const selectAll = () => {
    setSelectedModules(REAL_BOUTIQUE_MODULES.map((m) => m.code));
  };

  const deselectAll = () => {
    setSelectedModules([]);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-brutal w-full max-w-xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">Gestion des Modules</h3>
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

        {/* Action Rapide Tout Sélectionner */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span>{selectedModules.length} / {REAL_BOUTIQUE_MODULES.length} modules activés</span>
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
              Tout désactiver
            </button>
          </div>
        </div>

        {/* Liste des Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {REAL_BOUTIQUE_MODULES.map((mod) => {
            const isChecked = selectedModules.includes(mod.code);
            return (
              <div
                key={mod.code}
                onClick={() => toggleModule(mod.code)}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  isChecked
                    ? 'bg-amber-50/80 border-slate-900 shadow-brutal-xs'
                    : 'bg-white border-slate-200 hover:border-slate-400 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-black text-slate-950">{mod.label}</span>
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-slate-950 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1 leading-snug">{mod.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-100">
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
  );
}
