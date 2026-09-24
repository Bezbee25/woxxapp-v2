'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, RefreshCw, X, Layers, Edit2, Store, KeyRound } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { UpgradeImageModal } from '../components/UpgradeImageModal';
import { ResetUserPasswordModal } from '../components/ResetUserPasswordModal';

interface UserTenant {
  id: string;
  commerceName: string;
  subdomain: string;
  imageTag?: string;
  status: string;
}

interface UserItem {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'charge_daffaire' | 'client';
  is_active: boolean;
  assigned_sales_rep_id?: string;
  assignedSalesRep?: { id: string; fullName?: string; email: string };
  tenants?: UserTenant[];
  stats?: { tenants: number; subscriptions: number; invoices: number; clients: number };
  created_at: string;
}

export function UsersTab() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [salesReps, setSalesReps] = useState<UserItem[]>([]);
  
  // Modal Création
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'CHARGE_DAFFAIRE' | 'CLIENT'>('CLIENT');

  // Modal Reset Mot de passe
  const [selectedUserForPasswordReset, setSelectedUserForPasswordReset] = useState<UserItem | null>(null);

  // Modal Mise à jour d'image pour une boutique d'un client
  const [selectedTenantForUpgrade, setSelectedTenantForUpgrade] = useState<UserTenant | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = `/admin/users?${search ? `search=${encodeURIComponent(search)}` : ''}${
        roleFilter !== 'ALL' ? `&role=${roleFilter}` : ''
      }`;
      const data = await apiRequest<UserItem[]>(url);
      setUsers(data || []);

      const reps = (data || []).filter(u => u.role === 'charge_daffaire' || u.role === 'admin');
      setSalesReps(reps);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiRequest(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole.toUpperCase() }),
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Erreur changement de rôle');
    }
  };

  const handleAssignRep = async (userId: string, repId: string) => {
    try {
      await apiRequest(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ assignedSalesRepId: repId || null }),
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Erreur assignation chargé d’affaires');
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Erreur modification statut');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          fullName: newFullName,
          role: newRole,
        }),
      });
      setIsCreateOpen(false);
      setNewEmail('');
      setNewPassword('');
      setNewFullName('');
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Erreur création utilisateur');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Gestion des Clients & Utilisateurs
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Gérez les comptes, les assignations de chargés d'affaires et inspectez les versions d'images des boutiques clientes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition"
          >
            <UserPlus className="w-4 h-4" /> Nouvel Utilisateur
          </button>
          <button
            onClick={fetchUsers}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition border-2 border-slate-900 shadow-brutal-xs"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Barre de recherche & Filtres */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par email, nom ou boutique..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-slate-900 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:shadow-brutal-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'ADMIN', 'CHARGE_DAFFAIRE', 'CLIENT'].map((rf) => (
            <button
              key={rf}
              onClick={() => setRoleFilter(rf)}
              className={`px-3 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition shadow-brutal-xs ${
                roleFilter === rf
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {rf === 'ALL'
                ? 'Tous'
                : rf === 'CHARGE_DAFFAIRE'
                ? 'Chargés d’Affaires'
                : rf}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des utilisateurs & Boutiques */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl shadow-brutal overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b-2 border-slate-900">
              <tr>
                <th className="px-5 py-4">Utilisateur / Client</th>
                <th className="px-5 py-4">Rôle</th>
                <th className="px-5 py-4">Chargé d'Affaires</th>
                <th className="px-5 py-4">Boutique(s) & Version Image</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-950 text-sm">{u.fullName || 'Sans nom'}</div>
                    <div className="text-slate-500 text-[11px] font-mono">{u.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role.toUpperCase()}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 border-slate-900 shadow-brutal-xs focus:outline-none ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-900'
                          : u.role === 'charge_daffaire'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="CHARGE_DAFFAIRE">CHARGE D'AFFAIRES</option>
                      <option value="CLIENT">CLIENT</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    {u.role === 'client' ? (
                      <select
                        value={u.assigned_sales_rep_id || ''}
                        onChange={(e) => handleAssignRep(u.id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                      >
                        <option value="">Aucun assigné</option>
                        {salesReps.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.fullName || r.email}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-normal italic">Non applicable</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {u.tenants && u.tenants.length > 0 ? (
                      <div className="flex flex-col gap-1.5 items-start">
                        {u.tenants.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1"
                          >
                            <Store className="w-3 h-3 text-slate-600" />
                            <span className="font-bold text-slate-900">{t.commerceName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[9px] font-bold truncate max-w-[110px]" title={t.imageTag || 'latest'}>
                              {t.imageTag?.split(':')?.[1] || 'latest'}
                            </span>
                            <button
                              onClick={() => setSelectedTenantForUpgrade(t)}
                              className="p-0.5 hover:bg-slate-200 rounded text-blue-600 hover:text-blue-900"
                              title="Changer la version d'image de cette boutique"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-normal italic">
                        {u.role === 'charge_daffaire' ? `${u.stats?.clients || 0} clients suivis` : '0 boutique'}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        u.is_active
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {u.is_active ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUserForPasswordReset(u)}
                        className="px-2.5 py-1 rounded-xl text-xs font-black border-2 border-slate-900 bg-amber-100 hover:bg-amber-200 text-amber-950 shadow-brutal-xs transition flex items-center gap-1 cursor-pointer"
                        title="Réinitialiser le mot de passe"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>MDP</span>
                      </button>

                      <button
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition cursor-pointer ${
                          u.is_active
                            ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                        }`}
                      >
                        {u.is_active ? 'Désactiver' : 'Réactiver'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création Utilisateur */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-slate-950 shadow-brutal w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-slate-950 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" /> Nouvel Utilisateur
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Nom Complet</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jean.dupont@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Mot de Passe</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Rôle</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="CLIENT">Client</option>
                  <option value="CHARGE_DAFFAIRE">Chargé d'Affaires</option>
                  <option value="ADMIN">Super-Administrateur</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-xl text-xs border-2 border-slate-900 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs border-2 border-slate-900 shadow-brutal-xs transition"
                >
                  Créer l'utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Changement Version d'Image & Redéploiement Interactif depuis l'onglet Clients */}
      <UpgradeImageModal
        isOpen={!!selectedTenantForUpgrade}
        tenant={selectedTenantForUpgrade}
        onClose={() => setSelectedTenantForUpgrade(null)}
        onSuccess={fetchUsers}
      />

      {/* Modal Réinitialisation Mot de Passe Utilisateur */}
      <ResetUserPasswordModal
        isOpen={!!selectedUserForPasswordReset}
        user={selectedUserForPasswordReset}
        onClose={() => setSelectedUserForPasswordReset(null)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
