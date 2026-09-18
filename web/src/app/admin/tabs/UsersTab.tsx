'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Shield, Briefcase, RefreshCw, X } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface UserItem {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'charge_daffaire' | 'client';
  is_active: boolean;
  assigned_sales_rep_id?: string;
  assignedSalesRep?: { id: string; fullName?: string; email: string };
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
  const [newSalesRepId, setNewSalesRepId] = useState('');

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
          assignedSalesRepId: newSalesRepId || null,
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
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Utilisateurs & Permissions ({users.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Gérez les comptes, promouvez des chargés d'affaires et assignez les portefeuilles clients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              className="pl-9 pr-4 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white w-52"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
          >
            <option value="ALL">Tous les rôles</option>
            <option value="ADMIN">Administrateurs</option>
            <option value="CHARGE_DAFFAIRE">Chargés d'Affaires</option>
            <option value="CLIENT">Clients</option>
          </select>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 shadow-brutal-xs transition"
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

      {/* Table des Utilisateurs */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-brutal">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase font-black border-b-2 border-slate-900">
              <tr>
                <th className="px-5 py-4">Utilisateur</th>
                <th className="px-5 py-4">Rôle</th>
                <th className="px-5 py-4">Chargé d'Affaires Assigné</th>
                <th className="px-5 py-4">Boutiques / Stats</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-bold text-slate-900">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-950 text-sm">{u.full_name || 'Sans nom'}</div>
                    <div className="text-slate-500 font-mono text-[11px] font-normal">{u.email}</div>
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
                            {r.full_name || r.email}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-normal italic">Non applicable</span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">
                    {u.role === 'charge_daffaire' ? (
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {u.stats?.clients || 0} clients
                      </span>
                    ) : (
                      <span>{u.stats?.tenants || 0} boutique(s)</span>
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
                    <button
                      onClick={() => handleToggleActive(u.id, u.is_active)}
                      className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition ${
                        u.is_active
                          ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                      }`}
                    >
                      {u.is_active ? 'Désactiver' : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création Utilisateur */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-brutal-lg">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h3 className="font-black text-slate-950 text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" /> Nouvel Utilisateur
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-600 hover:text-slate-950 p-1 border-2 border-slate-900 rounded-lg bg-slate-100"
              >
                <X className="w-4 h-4" />
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
    </div>
  );
}
