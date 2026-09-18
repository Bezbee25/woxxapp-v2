'use client';

import React, { useState, useEffect } from 'react';
import { Store, Search, ExternalLink, ShieldCheck, AlertTriangle, RefreshCw, Check, Edit2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface Tenant {
  id: string;
  commerceName: string;
  subdomain: string;
  customDomain?: string;
  email: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  customCommissionPercent?: number | null;
  modules: string[];
  createdAt: string;
  user?: {
    email: string;
    fullName?: string;
    assignedSalesRep?: { fullName?: string; email: string };
  };
}

export function TenantsTab() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCommission, setEditCommission] = useState<string>('');

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const url = `/admin/tenants?${search ? `search=${encodeURIComponent(search)}` : ''}${
        statusFilter !== 'ALL' ? `&status=${statusFilter}` : ''
      }`;
      const data = await apiRequest<Tenant[]>(url);
      setTenants(data || []);
    } catch (err) {
      console.error('Erreur chargement tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING') => {
    try {
      await apiRequest(`/admin/tenants/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTenants();
    } catch (err: any) {
      alert(err.message || 'Erreur mise à jour statut');
    }
  };

  const handleSaveCommission = async (id: string) => {
    try {
      const val = editCommission.trim() === '' ? null : parseFloat(editCommission);
      await apiRequest(`/admin/tenants/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ customCommissionPercent: val }),
      });
      setEditingId(null);
      fetchTenants();
    } catch (err: any) {
      alert(err.message || 'Erreur enregistrement commission');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filtres */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600" /> Boutiques & Tenants ({tenants.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Supervisez les boutiques hébergées sur le cluster Kubernetes et réglez les commissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTenants()}
              className="pl-9 pr-4 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-brutal-xs w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ACTIVE">Actifs</option>
            <option value="PENDING">En attente</option>
            <option value="SUSPENDED">Suspendus</option>
          </select>

          <button
            onClick={fetchTenants}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition border-2 border-slate-900 shadow-brutal-xs"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table des Tenants */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-brutal">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase font-black border-b-2 border-slate-900">
              <tr>
                <th className="px-5 py-4">Boutique & Domaine</th>
                <th className="px-5 py-4">Propriétaire</th>
                <th className="px-5 py-4">Commission</th>
                <th className="px-5 py-4">Modules Actifs</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-bold text-slate-900">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-950 text-sm">{t.commerceName}</div>
                    <div className="flex items-center gap-1.5 text-blue-600 font-mono text-[11px] mt-0.5">
                      <span>{t.subdomain}.woxxapp.de</span>
                      <a
                        href={`https://${t.subdomain}.woxxapp.de`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-950 font-black">{t.user?.fullName || 'Client'}</div>
                    <div className="text-slate-500 font-normal">{t.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    {editingId === t.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Défaut"
                          value={editCommission}
                          onChange={(e) => setEditCommission(e.target.value)}
                          className="w-20 px-2 py-1 bg-slate-50 border-2 border-slate-900 rounded text-xs font-bold text-slate-900"
                        />
                        <button
                          onClick={() => handleSaveCommission(t.id)}
                          className="p-1.5 bg-amber-400 border border-slate-900 text-slate-950 rounded hover:bg-amber-300"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">
                          {t.customCommissionPercent !== null && t.customCommissionPercent !== undefined
                            ? `${t.customCommissionPercent}% (Perso)`
                            : 'Standard (0%)'}
                        </span>
                        <button
                          onClick={() => {
                            setEditingId(t.id);
                            setEditCommission(
                              t.customCommissionPercent !== null && t.customCommissionPercent !== undefined
                                ? String(t.customCommissionPercent)
                                : ''
                            );
                          }}
                          className="text-slate-500 hover:text-blue-600 p-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {t.modules && t.modules.length > 0 ? (
                        t.modules.map((m) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-300 text-[10px] text-slate-800 font-mono font-bold"
                          >
                            {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px] font-normal">Aucun module</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        t.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : t.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {t.status === 'ACTIVE' && <ShieldCheck className="w-3 h-3" />}
                      {t.status === 'PENDING' && <AlertTriangle className="w-3 h-3" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {t.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'ACTIVE')}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition"
                        >
                          Activer
                        </button>
                      )}
                      {t.status !== 'SUSPENDED' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'SUSPENDED')}
                          className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition"
                        >
                          Suspendre
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 font-bold">
                    Aucune boutique trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
