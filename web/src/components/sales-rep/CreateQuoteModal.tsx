'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, ArrowRight, RefreshCw, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ClientOption {
  id: string;
  email: string;
  fullName?: string;
  tenants?: Array<{ id: string; commerceName: string; subdomain: string }>;
}

interface QuoteLine {
  description: string;
  quantity: number;
  unitPriceHt: number;
  vatRate: number;
}

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clients: ClientOption[];
  preselectedClientId?: string;
}

const PRESET_ITEMS = [
  { description: 'Création & Hébergement Site Vitrine (Annuel)', unitPriceHt: 150, vatRate: 20 },
  { description: 'Module E-commerce & Paiement CB Stripe Connect', unitPriceHt: 300, vatRate: 20 },
  { description: 'Module Transport WoxxShip & Étiquettes Colissimo/MR', unitPriceHt: 300, vatRate: 20 },
  { description: 'Accompagnement & Shooting Photo Produits (Élise & Moi)', unitPriceHt: 250, vatRate: 20 },
  { description: 'Configuration Domaine Personnalisé & Certificat SSL Pro', unitPriceHt: 50, vatRate: 20 },
];

export function CreateQuoteModal({
  isOpen,
  onClose,
  onSuccess,
  clients,
  preselectedClientId,
}: CreateQuoteModalProps) {
  const [clientId, setClientId] = useState(preselectedClientId || (clients[0]?.id || ''));
  const [title, setTitle] = useState('Offre Commerciale WoxxApp');
  const [description, setDescription] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [validityDays, setValidityDays] = useState(30);

  const [lines, setLines] = useState<QuoteLine[]>([
    { description: 'Création & Hébergement Site Vitrine (Annuel)', quantity: 1, unitPriceHt: 150, vatRate: 20 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentClient = clients.find((c) => c.id === clientId);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { description: '', quantity: 1, unitPriceHt: 50, vatRate: 20 },
    ]);
  };

  const removeLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof QuoteLine, value: any) => {
    setLines((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addPreset = (preset: { description: string; unitPriceHt: number; vatRate: number }) => {
    setLines((prev) => [...prev, { ...preset, quantity: 1 }]);
  };

  // Calculs totaux
  const totalHt = lines.reduce((acc, l) => acc + (Number(l.quantity) || 0) * (Number(l.unitPriceHt) || 0), 0);
  const totalVat = lines.reduce((acc, l) => acc + (Number(l.quantity) || 0) * (Number(l.unitPriceHt) || 0) * ((Number(l.vatRate) || 0) / 100), 0);
  const totalTtc = totalHt + totalVat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Veuillez sélectionner un client.');
      return;
    }
    if (lines.length === 0) {
      setError('Veuillez inclure au moins un article dans le devis.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await apiRequest('/sales-rep/quotes', {
        method: 'POST',
        body: JSON.stringify({
          clientId,
          title,
          description,
          tenantId: selectedTenantId || undefined,
          items: lines,
          validityDays,
          status: 'SENT',
        }),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du devis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white border-2 border-slate-900 rounded-3xl shadow-brutal-lg p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shadow-brutal-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black">
            📝
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Nouveau Devis Commercial</h2>
            <p className="text-xs text-slate-500 font-bold">
              Établissez une proposition personnalisée pour votre client avec paiement direct WoxxPay.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border-2 border-rose-600 text-rose-800 text-xs font-bold mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SÉLECTION DU CLIENT */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">Client Destinataire *</label>
              <select
                required
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setSelectedTenantId('');
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
              >
                <option value="">Sélectionnez un client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName || c.email} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Boutique Associée (Optionnel)
              </label>
              <select
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
              >
                <option value="">Aucune boutique rattachée</option>
                {currentClient?.tenants?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.commerceName} ({t.subdomain}.woxxapp.de)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-slate-900 mb-1">Intitulé du Devis *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Pack Sérénité + Module Vente & Transport"
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">Validité (jours)</label>
              <input
                type="number"
                min="7"
                max="90"
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* RACCOURCIS PRESETS */}
          <div>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Ajouter rapidement une prestation type :
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_ITEMS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addPreset(preset)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-amber-200 border border-slate-900 rounded-lg text-[10px] font-black text-slate-900 transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{preset.description.split('(')[0]} ({preset.unitPriceHt} €)</span>
                </button>
              ))}
            </div>
          </div>

          {/* LIGNES D'ARTICLES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">Articles & Prestations</span>
              <button
                type="button"
                onClick={addLine}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-400 rounded-lg text-xs font-black flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto p-1">
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <div className="col-span-6">
                    <input
                      type="text"
                      required
                      placeholder="Description de la prestation..."
                      value={line.description}
                      onChange={(e) => updateLine(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-900 rounded-lg font-bold text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qté"
                      value={line.quantity}
                      onChange={(e) => updateLine(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-900 rounded-lg font-bold text-xs text-center"
                    />
                  </div>
                  <div className="col-span-3 flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Prix HT"
                      value={line.unitPriceHt}
                      onChange={(e) => updateLine(idx, 'unitPriceHt', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-900 rounded-lg font-bold text-xs text-right"
                    />
                    <span className="font-bold text-slate-600">€</span>
                  </div>
                  <div className="col-span-1 text-right">
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="p-1 text-rose-600 hover:text-rose-800"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RÉCAPITULATIF DU TOTAL */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-400">Total HT : {totalHt.toFixed(2)} €</span>
              <span className="text-slate-400 ml-3">TVA (20%) : {totalVat.toFixed(2)} €</span>
            </div>
            <div className="text-base font-black">
              Total TTC : <span className="text-amber-400 text-xl">{totalTtc.toFixed(2)} €</span>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border-2 border-slate-900 text-xs font-black bg-white hover:bg-slate-100 text-slate-800 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-brutal hover:shadow-brutal-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <span>Générer et envoyer le devis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
