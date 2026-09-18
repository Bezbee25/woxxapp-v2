'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, User, UserRole } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { 
  Shield, 
  Users, 
  Briefcase, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  UserPlus, 
  ArrowUpRight, 
  Check, 
  X,
  Lock,
  Store,
  Sliders,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface WoxxPaySettings {
  api_url: string;
  merchant_token: string;
  webhook_secret: string;
  default_commission_percent: number;
  is_enabled: boolean;
}

export default function AdminPage() {
  const { user, loading: authLoading, logout, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'clients' | 'sales_reps' | 'woxxpay'>('clients');

  // Données
  const [usersList, setUsersList] = useState<User[]>([]);
  const [salesRepsList, setSalesRepsList] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [stats, setStats] = useState<{ clients_count: number; sales_reps_count: number; tenants_count: number }>({
    clients_count: 0,
    sales_reps_count: 0,
    tenants_count: 0,
  });

  // WoxxPay
  const [woxxpay, setWoxxpay] = useState<WoxxPaySettings>({
    api_url: 'https://pay.woxxapp.de',
    merchant_token: '',
    webhook_secret: '',
    default_commission_percent: 2.0,
    is_enabled: true,
  });
  const [woxxpaySaving, setWoxxpaySaving] = useState(false);
  const [woxxpaySuccess, setWoxxpaySuccess] = useState(false);

  // Modale d'assignation
  const [assigningUser, setAssigningUser] = useState<User | null>(null);
  const [selectedRepId, setSelectedRepId] = useState<string>('');

  const isAdmin = user?.role === 'admin';
  const isSalesRep = user?.role === 'charge_daffaire';

  const loadData = async () => {
    if (!user || (!isAdmin && !isSalesRep)) return;
    setLoadingData(true);

    try {
      if (isAdmin) {
        const [allUsers, allStats, paySettings] = await Promise.all([
          apiRequest<User[]>('/admin/users'),
          apiRequest<any>('/admin/stats'),
          apiRequest<WoxxPaySettings>('/admin/settings/woxxpay'),
        ]);

        if (Array.isArray(allUsers)) {
          setUsersList(allUsers.filter((u) => u.role === 'client'));
          setSalesRepsList(allUsers.filter((u) => u.role === 'charge_daffaire'));
        }
        if (allStats) setStats(allStats);
        if (paySettings) setWoxxpay(paySettings);
      } else if (isSalesRep) {
        const assignedClients = await apiRequest<User[]>('/sales-rep/clients');
        if (Array.isArray(assignedClients)) {
          setUsersList(assignedClients);
        }
      }
    } catch (err) {
      console.error('Erreur chargement admin:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, user]);

  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    try {
      await apiRequest(`/admin/users/${targetUserId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      await loadData();
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleToggleActive = async (targetUserId: string) => {
    try {
      await apiRequest(`/admin/users/${targetUserId}/toggle-active`, {
        method: 'PATCH',
      });
      await loadData();
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleAssignSalesRep = async () => {
    if (!assigningUser) return;
    try {
      await apiRequest(`/admin/users/${assigningUser.id}/assign-sales-rep`, {
        method: 'PATCH',
        body: JSON.stringify({ sales_rep_id: selectedRepId || null }),
      });
      setAssigningUser(null);
      await loadData();
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleSaveWoxxPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setWoxxpaySaving(true);
    setWoxxpaySuccess(false);

    try {
      const res = await apiRequest<WoxxPaySettings>('/admin/settings/woxxpay', {
        method: 'PATCH',
        body: JSON.stringify(woxxpay),
      });
      if (res) {
        setWoxxpay(res);
        setWoxxpaySuccess(true);
        setTimeout(() => setWoxxpaySuccess(false), 3000);
      }
    } catch (err: any) {
      alert(`Erreur enregistrement WoxxPay: ${err.message}`);
    } finally {
      setWoxxpaySaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-sm flex items-center justify-center animate-spin text-xl">
            ⚙️
          </div>
          <p className="text-xs font-black text-slate-800">Chargement de votre espace sécurisé...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin && !isSalesRep)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9] p-4">
        <div className="max-w-md w-full bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-brutal-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 border-2 border-slate-900 shadow-brutal-sm flex items-center justify-center mx-auto text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-black text-slate-900">Accès Restreint</h1>
          <p className="text-xs text-slate-600 font-medium">
            Cet espace est strictement réservé aux administrateurs et chargés d'affaires WoxxApp.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            {!user ? (
              <button
                onClick={() => openAuthModal('login')}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-3 rounded-xl border-2 border-slate-900 shadow-brutal"
              >
                Se connecter en tant qu'administrateur
              </button>
            ) : (
              <Link
                href="/"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black py-3 rounded-xl border-2 border-slate-900 shadow-brutal-xs text-center"
              >
                Retour à l'accueil
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 font-sans pb-20">
      {/* ── TOPBAR ADMIN ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-900 shadow-brutal-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-brutal-xs transition-colors"
              title="Retour au site public"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-xl font-black">
                🛡️
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 block leading-none">
                  WOXX<span className="text-blue-600">APP</span> <span className="text-xs bg-slate-900 text-amber-400 px-2 py-0.5 rounded font-black ml-1 uppercase">Admin</span>
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  {isAdmin ? 'Super Administrateur' : 'Espace Chargé d’Affaires'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loadingData}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-800 shadow-brutal-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l-2 border-slate-200">
              <div className="hidden md:block text-right">
                <div className="text-xs font-black text-slate-900 truncate max-w-[150px]">
                  {user.full_name || user.email}
                </div>
                <div className="text-[9px] font-black text-slate-500 uppercase">
                  {user.role}
                </div>
              </div>
              <button
                onClick={logout}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-slate-900 rounded-xl text-xs font-black shadow-brutal-xs transition-all"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENU PRINCIPAL ────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI CARDS */}
        {isAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-brutal flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Clients enregistrés</p>
                <p className="text-3xl font-black text-slate-950 mt-1">{usersList.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-2xl">
                👥
              </div>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-brutal flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Chargés d'Affaires</p>
                <p className="text-3xl font-black text-slate-950 mt-1">{salesRepsList.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 border-2 border-slate-900 flex items-center justify-center text-2xl">
                💼
              </div>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-brutal flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Passerelle WoxxPay</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-3 h-3 rounded-full border border-slate-900 ${woxxpay.is_enabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-sm font-black text-slate-900">
                    {woxxpay.is_enabled ? 'Active (2.0%)' : 'Désactivée'}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center text-2xl">
                💳
              </div>
            </div>
          </div>
        )}

        {/* BARRE D'ONGLETS */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-900 shadow-brutal-xs max-w-lg">
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'clients'
                ? 'bg-white text-slate-950 border-2 border-slate-900 shadow-brutal-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Clients ({usersList.length})</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('sales_reps')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'sales_reps'
                  ? 'bg-white text-slate-950 border-2 border-slate-900 shadow-brutal-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Chargés d'Affaires ({salesRepsList.length})</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab('woxxpay')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'woxxpay'
                  ? 'bg-white text-slate-950 border-2 border-slate-900 shadow-brutal-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>WoxxPay</span>
            </button>
          )}
        </div>

        {/* ── ONGLET 1 : CLIENTS ──────────────────────────────────── */}
        {activeTab === 'clients' && (
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  {isAdmin ? 'Liste des Clients & Commerçants' : 'Mon Portefeuille de Clients Assignés'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {isAdmin 
                    ? 'Supervisez les comptes clients, affectez-les à des chargés d’affaires ou promouvez-les.' 
                    : 'Consultez et accompagnez les commerçants qui vous sont assignés.'}
                </p>
              </div>
            </div>

            {usersList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-2xl">
                <p className="text-xs font-black text-slate-500">Aucun client trouvé pour le moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 bg-slate-50 text-[11px] font-black uppercase text-slate-600">
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Date Inscription</th>
                      <th className="p-3.5">Chargé d'Affaires</th>
                      <th className="p-3.5">Statut</th>
                      {isAdmin && <th className="p-3.5 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100 text-xs font-bold text-slate-900">
                    {usersList.map((client) => {
                      const assignedRep = salesRepsList.find((r) => r.id === client.assigned_sales_rep_id);

                      return (
                        <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="font-black text-slate-950">{client.full_name || 'Sans nom'}</div>
                            <div className="text-[11px] text-slate-500 font-normal">{client.email}</div>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            {new Date(client.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-3.5">
                            {assignedRep ? (
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-black">
                                <Briefcase className="w-3 h-3 text-blue-600" />
                                <span>{assignedRep.full_name || assignedRep.email}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Non assigné</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              client.is_active 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}>
                              {client.is_active ? 'Actif' : 'Suspendu'}
                            </span>
                          </td>
                          {isAdmin && (
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setAssigningUser(client);
                                  setSelectedRepId(client.assigned_sales_rep_id || '');
                                }}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-xl text-[11px] font-black shadow-brutal-xs hover:shadow-brutal transition-all"
                              >
                                Affecter
                              </button>

                              <button
                                onClick={() => handleRoleChange(client.id, 'charge_daffaire')}
                                className="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-400 text-white border-2 border-slate-900 rounded-xl text-[11px] font-black shadow-brutal-xs hover:shadow-brutal transition-all"
                                title="Promouvoir en chargé d'affaires"
                              >
                                Promouvoir
                              </button>

                              <button
                                onClick={() => handleToggleActive(client.id)}
                                className={`px-2.5 py-1.5 border-2 border-slate-900 rounded-xl text-[11px] font-black shadow-brutal-xs hover:shadow-brutal transition-all ${
                                  client.is_active 
                                    ? 'bg-rose-100 hover:bg-rose-200 text-rose-800' 
                                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                }`}
                              >
                                {client.is_active ? 'Suspendre' : 'Activer'}
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ONGLET 2 : CHARGÉS D'AFFAIRES ───────────────────────── */}
        {isAdmin && activeTab === 'sales_reps' && (
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Chargés d'Affaires Actifs</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Liste des membres de l'équipe commerciale habilités à gérer des portefeuilles clients.
                </p>
              </div>
            </div>

            {salesRepsList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-2xl">
                <p className="text-xs font-black text-slate-500">
                  Aucun chargé d'affaires pour l'instant. Promouvez un client depuis l'onglet Clients.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 bg-slate-50 text-[11px] font-black uppercase text-slate-600">
                      <th className="p-3.5">Chargé d'Affaires</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Clients en charge</th>
                      <th className="p-3.5">Statut</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100 text-xs font-bold text-slate-900">
                    {salesRepsList.map((rep) => {
                      const count = usersList.filter((c) => c.assigned_sales_rep_id === rep.id).length;

                      return (
                        <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="font-black text-slate-950">{rep.full_name || 'Sans nom'}</div>
                          </td>
                          <td className="p-3.5 text-slate-600 font-normal">{rep.email}</td>
                          <td className="p-3.5">
                            <span className="bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full text-xs font-black border border-blue-300">
                              {count} client(s)
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              rep.is_active 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}>
                              {rep.is_active ? 'Actif' : 'Suspendu'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleRoleChange(rep.id, 'client')}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-slate-900 rounded-xl text-[11px] font-black shadow-brutal-xs hover:shadow-brutal transition-all"
                            >
                              Rétrograder en Client
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ONGLET 3 : CONFIGURATION WOXXPAY ───────────────────── */}
        {isAdmin && activeTab === 'woxxpay' && (
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 text-xs font-black uppercase mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Passerelle de Paiement</span>
                </div>
                <h2 className="text-xl font-black text-slate-950">Configuration de WoxxPay</h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Connectez la plateforme WoxxApp à votre service WoxxPay pour l'encaissement et la commission de 2%.
                </p>
              </div>
            </div>

            {woxxpaySuccess && (
              <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-emerald-800 text-xs font-black">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Paramètres WoxxPay enregistrés avec succès !</span>
              </div>
            )}

            <form onSubmit={handleSaveWoxxPay} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  URL de l'API WoxxPay
                </label>
                <input
                  type="url"
                  required
                  value={woxxpay.api_url}
                  onChange={(e) => setWoxxpay({ ...woxxpay, api_url: e.target.value })}
                  placeholder="https://pay.woxxapp.de"
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  Clé / Token Marchand Secret
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={woxxpay.merchant_token}
                    onChange={(e) => setWoxxpay({ ...woxxpay, merchant_token: e.target.value })}
                    placeholder="woxxpay_sec_••••••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  Webhook Secret (Vérification Signature)
                </label>
                <input
                  type="text"
                  value={woxxpay.webhook_secret}
                  onChange={(e) => setWoxxpay({ ...woxxpay, webhook_secret: e.target.value })}
                  placeholder="whsec_••••••••••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Commission par défaut (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={woxxpay.default_commission_percent}
                    onChange={(e) => setWoxxpay({ ...woxxpay, default_commission_percent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Statut du module
                  </label>
                  <select
                    value={woxxpay.is_enabled ? 'true' : 'false'}
                    onChange={(e) => setWoxxpay({ ...woxxpay, is_enabled: e.target.value === 'true' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
                  >
                    <option value="true">Actif et Opérationnel</option>
                    <option value="false">Désactivé (Mode test)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={woxxpaySaving}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
              >
                {woxxpaySaving ? 'Enregistrement...' : 'Enregistrer la configuration WoxxPay'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ── MODALE D'AFFECTATION DE CHARGÉ D'AFFAIRES ─────────────── */}
      {assigningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-brutal-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950">
                Affecter un Chargé d'Affaires
              </h3>
              <button
                onClick={() => setAssigningUser(null)}
                className="w-8 h-8 rounded-xl border-2 border-slate-900 bg-slate-100 flex items-center justify-center text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Client sélectionné : <span className="font-black text-slate-900">{assigningUser.full_name || assigningUser.email}</span>
            </p>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                Choisir le chargé d'affaires référent :
              </label>
              <select
                value={selectedRepId}
                onChange={(e) => setSelectedRepId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="">-- Aucun (Non assigné) --</option>
                {salesRepsList.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.full_name || rep.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssigningUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-xl text-xs font-black"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAssignSalesRep}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 rounded-xl text-xs font-black shadow-brutal-xs"
              >
                Valider l'affectation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
