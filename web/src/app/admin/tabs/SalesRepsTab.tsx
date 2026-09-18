'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Store, Mail, RefreshCw } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" /> Équipe Commerciale & Chargés d'Affaires ({salesReps.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Visualisez les performances et les portefeuilles clients assignés à chaque chargé d'affaires.
          </p>
        </div>

        <button
          onClick={fetchSalesReps}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition border-2 border-slate-900 shadow-brutal-xs self-start md:self-auto"
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
            className="bg-white border-2 border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-brutal hover:shadow-brutal-lg transition"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black text-lg shadow-brutal-xs">
                  {rep.full_name ? rep.full_name.charAt(0).toUpperCase() : 'C'}
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    rep.is_active
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}
                >
                  {rep.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-950 mb-1">{rep.full_name || 'Chargé d’affaires'}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono mb-4">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {rep.email}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-900 mb-4 shadow-brutal-xs">
                <div className="text-xs font-black uppercase text-slate-500 mb-1">Clients Assignés</div>
                <div className="text-2xl font-black text-slate-950">
                  {rep.stats?.clients || 0} <span className="text-xs font-bold text-slate-500">commerçants</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-slate-100 text-xs text-slate-600 font-bold flex items-center justify-between">
              <span>Rôle : Chargé d'Affaires</span>
              <span className="text-blue-600 font-black">WoxxApp V2</span>
            </div>
          </div>
        ))}

        {salesReps.length === 0 && !loading && (
          <div className="col-span-full bg-white border-2 border-slate-900 rounded-3xl p-12 text-center text-slate-500 font-bold shadow-brutal">
            Aucun chargé d'affaires enregistré. Vous pouvez promouvoir un utilisateur dans l'onglet "Utilisateurs & Rôles".
          </div>
        )}
      </div>
    </div>
  );
}
