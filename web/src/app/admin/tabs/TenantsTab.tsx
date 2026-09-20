'use client';

import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Check,
  Edit2,
  PlusCircle,
  X,
  Layers,
  Sparkles,
  Server,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { EditModulesModal, REAL_BOUTIQUE_MODULES } from '../components/EditModulesModal';

interface Tenant {
  id: string;
  commerceName: string;
  subdomain: string;
  customDomain?: string;
  email: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  customCommissionPercent?: number | null;
  modules: string[];
  imageTag?: string;
  k8sStatus?: string;
  createdAt: string;
  user?: {
    id: string;
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
  
  // États d'édition commission
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCommission, setEditCommission] = useState<string>('');

  // États de mise à jour d'image / redéploiement
  const [upgradeTenant, setUpgradeTenant] = useState<Tenant | null>(null);
  const [targetImage, setTargetImage] = useState<string>('');
  const [upgrading, setUpgrading] = useState(false);

  // États de gestion des modules par boutique
  const [editingModulesTenant, setEditingModulesTenant] = useState<Tenant | null>(null);

  // États de création admin gratuite
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCommerceName, setNewCommerceName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newImageTag, setNewImageTag] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>(
    REAL_BOUTIQUE_MODULES.map((m) => m.code)
  );
  const [creating, setCreating] = useState(false);

  const availableModules = REAL_BOUTIQUE_MODULES;

  const handleSaveModules = async (newModules: string[]) => {
    if (!editingModulesTenant) return;
    try {
      await apiRequest(`/admin/tenants/${editingModulesTenant.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ modules: newModules }),
      });
      fetchTenants();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour des modules');
    }
  };

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

  const handleUpgradeImage = async () => {
    if (!upgradeTenant) return;
    setUpgrading(true);
    try {
      await apiRequest(`/admin/tenants/${upgradeTenant.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          imageTag: targetImage.trim(),
          redeploy: true,
        }),
      });
      setUpgradeTenant(null);
      fetchTenants();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du redéploiement de l’image');
    } finally {
      setUpgrading(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiRequest('/admin/tenants', {
        method: 'POST',
        body: JSON.stringify({
          commerceName: newCommerceName,
          subdomain: newSubdomain,
          email: newEmail,
          fullName: newFullName,
          modules: selectedModules,
          imageTag: newImageTag || undefined,
        }),
      });
      setIsCreateOpen(false);
      setNewCommerceName('');
      setNewSubdomain('');
      setNewEmail('');
      setNewFullName('');
      setNewImageTag('');
      fetchTenants();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de la boutique');
    } finally {
      setCreating(false);
    }
  };

  const toggleModule = (code: string) => {
    setSelectedModules((prev) =>
      prev.includes(code) ? prev.filter((m) => m !== code) : [...prev, code]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Filtres */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600" /> Boutiques & Clients ({tenants.length})
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Supervision des boutiques clientes, versions de conteneur déployées et statut Kubernetes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition"
          >
            <PlusCircle className="w-4 h-4" /> Créer une boutique (Admin)
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTenants()}
              className="pl-9 pr-4 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-brutal-xs w-48"
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
                <th className="px-5 py-4">Boutique & Sous-domaine</th>
                <th className="px-5 py-4">Client / Propriétaire</th>
                <th className="px-5 py-4">Version d'Image (Tag)</th>
                <th className="px-5 py-4">Modules</th>
                <th className="px-5 py-4">Statut K8s</th>
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
                    <div className="text-slate-500 font-normal text-[11px]">{t.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-mono text-[10px] font-bold truncate max-w-[170px]" title={t.imageTag || 'ghcr.io/bezbee25/boutique-global:latest'}>
                        {t.imageTag?.split(':')?.[1] || 'latest'}
                      </span>
                      <button
                        onClick={() => {
                          setUpgradeTenant(t);
                          setTargetImage(t.imageTag || 'ghcr.io/bezbee25/boutique-global:latest');
                        }}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900"
                        title="Changer la version d'image"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {t.modules && t.modules.length > 0 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 border-2 border-blue-200 text-[11px] text-blue-900 font-black">
                            {t.modules.length} module{t.modules.length > 1 ? 's' : ''} actif{t.modules.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-normal">Aucun module</span>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingModulesTenant(t)}
                        className="p-1 hover:bg-slate-200 rounded text-blue-600 hover:text-blue-900"
                        title="Gérer les modules de cette boutique"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
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

      {/* Modal Création Boutique Admin */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-brutal-lg space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-slate-950 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Créer une boutique (Admin Gratuit)
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-700">Nom Commercial</label>
                <input
                  type="text"
                  required
                  value={newCommerceName}
                  onChange={(e) => {
                    setNewCommerceName(e.target.value);
                    if (!newSubdomain) {
                      setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    }
                  }}
                  placeholder="Ex: Atelier Céramique"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-700">Sous-domaine (*.woxxapp.de)</label>
                  <input
                    type="text"
                    required
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="atelier"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-700">Email Client</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@domaine.com"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-700">Nom du Propriétaire (Optionnel)</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-700">Version d'Image (Optionnel)</label>
                <input
                  type="text"
                  value={newImageTag}
                  onChange={(e) => setNewImageTag(e.target.value)}
                  placeholder="Défaut configuré"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-700 mb-1.5 block">Modules Activés</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableModules.map((m) => (
                    <label
                      key={m.code}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
                        selectedModules.includes(m.code)
                          ? 'bg-amber-100 border-slate-900 text-slate-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(m.code)}
                        onChange={() => toggleModule(m.code)}
                        className="rounded"
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black border-2 border-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs"
                >
                  {creating ? 'Création & Provisioning...' : 'Créer & Déployer sur K8s'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Changement Version d'Image & Redéploiement */}
      {upgradeTenant && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-brutal-lg space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-slate-950 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" /> Version d'image : {upgradeTenant.commerceName}
              </h3>
              <button onClick={() => setUpgradeTenant(null)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Définissez la version d'image Docker à exécuter pour cette boutique. Un rolling update sera déclenché sur le cluster Kubernetes.
              </p>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-700">Image OCI / Docker</label>
                <input
                  type="text"
                  value={targetImage}
                  onChange={(e) => setTargetImage(e.target.value)}
                  placeholder="ghcr.io/bezbee25/boutique-global:YYYYMMDD-HHmmss"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setUpgradeTenant(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black border-2 border-slate-900"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleUpgradeImage}
                disabled={upgrading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs"
              >
                {upgrading ? 'Redéploiement K8s...' : 'Appliquer & Redéployer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition des modules par boutique */}
      <EditModulesModal
        isOpen={!!editingModulesTenant}
        tenantName={editingModulesTenant?.commerceName || ''}
        initialModules={editingModulesTenant?.modules || []}
        onClose={() => setEditingModulesTenant(null)}
        onSave={handleSaveModules}
      />
    </div>
  );
}
