'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Store, Mail, RefreshCw, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface SalesRepWithClients {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  clients?: Array<{
    id: string;
    email: string;
    fullName?: string;
    tenants: Array<{ commerceName: string; subdomain: string; status: string }>;
  }>;
  stats?: { clients: number };
}

export function SalesRepsTab() {
  const [salesReps, setSalesReps] = useState<SalesRepWithClients[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSalesReps = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<any[]>('/admin/users?role=CHARGE_DAFFAIRE');
      setSalesReps(data || []);
    } catch (err) {
      console.error('Erreur chargement chargés d’affaires:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReps();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0D121F] p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" /> Équipe Commerciale & Chargés d'Affaires ({salesReps.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualisez les performances et les portefeuilles clients assignés à chaque chargé d'affaires.
          </p>
        </div>

        <button
          onClick={fetchSalesReps}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 self-start md:self-auto"
          title="Rafraîchir"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Grille des Chargés d'Affaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesReps.map((rep) => (
          <div
            key={rep.id}
            className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                  {rep.full_name ? rep.full_name.charAt(0).toUpperCase() : 'C'}
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rep.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {rep.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{rep.full_name || 'Chargé d’affaires'}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono mb-4">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> {rep.email}
              </p>

              <div className="bg-[#080B12] rounded-xl p-4 border border-slate-800/80 mb-4">
                <div className="text-xs text-slate-400 mb-1">Portefeuille Clients Assignés</div>
                <div className="text-2xl font-black text-amber-400">
                  {rep.stats?.clients || 0} <span className="text-xs font-medium text-slate-400">clients</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>Rôle : Chargé d'Affaires</span>
              <span className="text-cyan-400 font-semibold">WoxxApp V2</span>
            </div>
          </div>
        ))}

        {salesReps.length === 0 && !loading && (
          <div className="col-span-full bg-[#0D121F] border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            Aucun chargé d'affaires enregistré. Vous pouvez promouvoir un utilisateur dans l'onglet "Utilisateurs & Rôles".
          </div>
        )}
      </div>
    </div>
  );
}
