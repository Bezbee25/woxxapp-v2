'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  Plus,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Terminal,
  Trash2,
  Star,
  Server,
  ArrowUpRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { BoutiqueImageVersion } from '../components/UpgradeImageModal';

export function BoutiqueVersionsTab() {
  const [versions, setVersions] = useState<BoutiqueImageVersion[]>([]);
  const [defaultTag, setDefaultTag] = useState<string>('');
  const [totalTenants, setTotalTenants] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modal Ajout de Version
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newArchitecture, setNewArchitecture] = useState<string>('ARM64');
  const [newIsRecommended, setNewIsRecommended] = useState<boolean>(false);
  const [newIsDefault, setNewIsDefault] = useState<boolean>(false);

  // Confirmation Upgrade All
  const [isUpgradeAllConfirmOpen, setIsUpgradeAllConfirmOpen] = useState<boolean>(false);

  const fetchVersions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<{
        defaultTag: string;
        versions: BoutiqueImageVersion[];
        totalTenants: number;
      }>('/admin/store-versions');

      if (data) {
        setVersions(data.versions || []);
        setDefaultTag(data.defaultTag || '');
        setTotalTenants(data.totalTenants || 0);
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de récupérer la liste des versions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const handleSetDefault = async (tag: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await apiRequest('/admin/store-versions', {
        method: 'POST',
        body: JSON.stringify({
          action: 'SET_DEFAULT',
          tag,
        }),
      });
      setSuccessNotice(`Version par défaut mise à jour : ${tag.split(':')?.[1] || tag}`);
      setTimeout(() => setSuccessNotice(null), 4000);
      await fetchVersions();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de version par défaut.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteVersion = async (tag: string) => {
    if (!confirm(`Confirmer la suppression de la version '${tag}' du catalogue ?`)) return;

    setActionLoading(true);
    setError(null);
    try {
      await apiRequest(`/admin/store-versions?tag=${encodeURIComponent(tag)}`, {
        method: 'DELETE',
      });
      setSuccessNotice('Version supprimée du catalogue.');
      setTimeout(() => setSuccessNotice(null), 4000);
      await fetchVersions();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) {
      setError("Veuillez renseigner le tag de l'image Docker.");
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      await apiRequest('/admin/store-versions', {
        method: 'POST',
        body: JSON.stringify({
          action: 'ADD_OR_UPDATE',
          tag: newTag.trim(),
          name: newName.trim(),
          description: newDescription.trim(),
          architecture: newArchitecture,
          isRecommended: newIsRecommended,
          isDefault: newIsDefault,
        }),
      });

      setIsAddModalOpen(false);
      setNewTag('');
      setNewName('');
      setNewDescription('');
      setNewIsRecommended(false);
      setNewIsDefault(false);
      setSuccessNotice("Nouvelle version d'image ajoutée au catalogue !");
      setTimeout(() => setSuccessNotice(null), 4000);
      await fetchVersions();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout de la version.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgradeAll = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ message: string; updatedCount: number }>('/admin/store-versions', {
        method: 'POST',
        body: JSON.stringify({
          action: 'UPGRADE_ALL',
          tag: defaultTag,
        }),
      });

      setIsUpgradeAllConfirmOpen(false);
      setSuccessNotice(res?.message || 'Toutes les boutiques ont été mises à jour !');
      setTimeout(() => setSuccessNotice(null), 5000);
      await fetchVersions();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du déploiement global.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & KPI */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" /> Catalogue & Registre des Versions de Boutiques
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Gérez la liste des images Docker/OCI certifiées pour les boutiques et sélectionnez les versions à déployer sur Kubernetes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition"
          >
            <Plus className="w-4 h-4" /> Ajouter une version
          </button>

          <button
            onClick={() => setIsUpgradeAllConfirmOpen(true)}
            disabled={actionLoading || versions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs transition disabled:opacity-50"
          >
            <ArrowUpRight className="w-4 h-4" /> Déployer défaut sur tout le parc
          </button>

          <button
            onClick={fetchVersions}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl border-2 border-slate-900 shadow-brutal-xs transition"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-600 rounded-2xl flex items-center gap-3 text-xs text-rose-900 font-bold">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successNotice && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-600 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Versions Table */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl shadow-brutal overflow-hidden">
        <div className="p-5 border-b-2 border-slate-900 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <span className="font-black text-slate-950 text-sm">Versions Répertoriées ({versions.length})</span>
          </div>
          <div className="text-xs text-slate-600 font-mono">
            Version active par défaut : <strong className="text-blue-600">{defaultTag.split(':')?.[1] || defaultTag}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b-2 border-slate-900">
              <tr>
                <th className="px-5 py-4">Version & Nom</th>
                <th className="px-5 py-4">Tag Image OCI / GHCR</th>
                <th className="px-5 py-4">Architecture</th>
                <th className="px-5 py-4">Utilisation & Statut</th>
                <th className="px-5 py-4">Date de Release</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-medium">
              {versions.map((ver) => {
                const isCurrentDefault = ver.tag === defaultTag;

                return (
                  <tr key={ver.id || ver.tag} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-950 text-sm flex items-center gap-1.5">
                        {ver.name}
                        {ver.isRecommended && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 border border-slate-900">
                            <Sparkles className="w-2.5 h-2.5" /> Recommandée
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm leading-tight">
                        {ver.description}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-mono font-bold text-slate-800">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 text-[11px] block truncate max-w-[280px]" title={ver.tag}>
                        {ver.tag}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-300">
                        {ver.architecture}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        {isCurrentDefault ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] border border-blue-300 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-blue-600 text-blue-600" /> Par Défaut (Nouveaux sites)
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-normal">Standard</span>
                        )}
                        <span className="text-[10px] font-mono text-slate-600 font-bold">
                          {ver.tenantCount || 0} boutique(s) en production
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500 text-[11px]">
                      {ver.releaseDate || 'N/A'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isCurrentDefault && (
                          <button
                            onClick={() => handleSetDefault(ver.tag)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-800 rounded-xl text-xs font-bold border-2 border-slate-900 shadow-brutal-xs transition"
                            title="Définir comme image par défaut pour les futures boutiques"
                          >
                            Définir par défaut
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteVersion(ver.tag)}
                          disabled={actionLoading || isCurrentDefault}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-30"
                          title="Supprimer du catalogue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout Version */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-4 border-slate-950 shadow-brutal w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-slate-950 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Ajouter une Version au Registre
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVersion} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                  Tag Docker / GHCR <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="ghcr.io/bezbee25/boutique-global:sha-xxxxxxx-arm64"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono font-bold focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                  Titre / Libellé de Version
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="v2026.09 - Nouvelle fonctionnalité"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                  Description / Changelog court
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Changements majeurs, corrections et nouveaux modules inclus..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl font-medium focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                    Architecture
                  </label>
                  <select
                    value={newArchitecture}
                    onChange={(e) => setNewArchitecture(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold focus:outline-none"
                  >
                    <option value="ARM64 (KinD & Prod)">ARM64 (Apple Silicon / KinD)</option>
                    <option value="AMD64 (x86_64)">AMD64 (x86_64)</option>
                    <option value="Multi-arch">Multi-arch</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                    <input
                      type="checkbox"
                      checked={newIsRecommended}
                      onChange={(e) => setNewIsRecommended(e.target.checked)}
                      className="rounded border-slate-900"
                    />
                    <span>Marquer comme Recommandée</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                    <input
                      type="checkbox"
                      checked={newIsDefault}
                      onChange={(e) => setNewIsDefault(e.target.checked)}
                      className="rounded border-slate-900"
                    />
                    <span>Définir comme Défaut</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold border-2 border-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black border-2 border-slate-900 shadow-brutal-xs"
                >
                  {actionLoading ? 'Ajout en cours...' : 'Enregistrer au catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation Déploiement Global */}
      {isUpgradeAllConfirmOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-4 border-slate-950 shadow-brutal w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-black text-slate-950 text-base">Déploiement Global K8s</h3>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Vous êtes sur le point de déclencher un Rolling Update sur <strong>{totalTenants} boutique(s)</strong> vers la version par défaut :
              <br />
              <strong className="font-mono text-blue-600 block mt-1">{defaultTag}</strong>
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsUpgradeAllConfirmOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold border-2 border-slate-900"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleUpgradeAll}
                disabled={actionLoading}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs"
              >
                {actionLoading ? 'Déploiement en cours...' : 'Confirmer le déploiement global'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
