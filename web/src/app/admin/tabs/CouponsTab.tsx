'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, RefreshCw, X } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface Coupon {
  id: string;
  code: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  maxUses?: number | null;
  usesCount: number;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
}

export function CouponsTab() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [maxUses, setMaxUses] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<Coupon[]>('/admin/coupons');
      setCoupons(data || []);
    } catch (err) {
      console.error('Erreur chargement coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/admin/coupons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Erreur mise à jour coupon');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Supprimer définitivement ce code promo ?')) return;
    try {
      await apiRequest(`/admin/coupons/${id}`, {
        method: 'DELETE',
      });
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Erreur suppression coupon');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code: newCode.trim().toUpperCase(),
          discountPercent: discountType === 'percent' ? discountValue : null,
          discountAmount: discountType === 'amount' ? discountValue : null,
          maxUses: maxUses ? parseInt(maxUses, 10) : null,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });
      setIsCreateOpen(false);
      setNewCode('');
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Erreur création coupon');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0D121F] p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" /> Codes Promotionnels ({coupons.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Générez des réductions pour vos campagnes marketing ou offres de lancement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Créer un Code Promo
          </button>

          <button
            onClick={fetchCoupons}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table des Coupons */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#080B12] text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Code Promo</th>
                <th className="px-5 py-4">Réduction</th>
                <th className="px-5 py-4">Utilisations</th>
                <th className="px-5 py-4">Expiration</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold rounded-lg text-sm">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">
                    {c.discountPercent ? `${c.discountPercent}% de réduction` : `${c.discountAmount} € de réduction`}
                  </td>
                  <td className="px-5 py-4 font-mono">
                    {c.usesCount} {c.maxUses ? `/ ${c.maxUses}` : 'utilisations'}
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('fr-FR') : 'Illimité'}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleActive(c.id, c.isActive)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        c.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                      }`}
                    >
                      {c.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    Aucun code promotionnel enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121F] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" /> Nouveau Code Promo
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Code Promo (ex: PROMO20)</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="EXEMPLE20"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Type de Réduction</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="percent">Pourcentage (%)</option>
                    <option value="amount">Montant Fixe (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Valeur</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nombre max d'utilisations (optionnel)</label>
                <input
                  type="number"
                  min={1}
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Illimité"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Date d'expiration (optionnel)</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Créer le coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
