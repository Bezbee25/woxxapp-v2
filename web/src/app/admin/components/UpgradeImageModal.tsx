'use client';

import React, { useState, useEffect } from 'react';
import { Layers, X, Check, AlertCircle, RefreshCw, Sparkles, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export interface BoutiqueImageVersion {
  id: string;
  tag: string;
  name: string;
  description: string;
  architecture: string;
  isRecommended?: boolean;
  isDefault?: boolean;
  releaseDate: string;
  tenantCount?: number;
}

interface UpgradeImageModalProps {
  isOpen: boolean;
  tenant: {
    id: string;
    commerceName: string;
    subdomain: string;
    imageTag?: string | null;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpgradeImageModal({ isOpen, tenant, onClose, onSuccess }: UpgradeImageModalProps) {
  const [versions, setVersions] = useState<BoutiqueImageVersion[]>([]);
  const [defaultTag, setDefaultTag] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [customTagMode, setCustomTagMode] = useState<boolean>(false);
  const [customTag, setCustomTag] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [upgrading, setUpgrading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<{ defaultTag: string; versions: BoutiqueImageVersion[] }>('/admin/store-versions');
      if (data) {
        setVersions(data.versions || []);
        setDefaultTag(data.defaultTag || '');
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de récupérer la liste des images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && tenant) {
      fetchVersions();
      const current = tenant.imageTag || '';
      setSelectedTag(current || defaultTag || 'ghcr.io/bezbee25/boutique-global:sha-745d530-arm64');
      setCustomTagMode(false);
      setCustomTag('');
      setSuccessMessage(null);
    }
  }, [isOpen, tenant]);

  if (!isOpen || !tenant) return null;

  const effectiveCurrentTag = tenant.imageTag || defaultTag || 'Non spécifié';
  const effectiveTargetTag = customTagMode ? customTag.trim() : selectedTag;
  const isSameTag = effectiveCurrentTag === effectiveTargetTag;

  const handleApplyUpgrade = async () => {
    if (!effectiveTargetTag) {
      setError("Veuillez sélectionner ou saisir un tag d'image valide.");
      return;
    }

    setUpgrading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await apiRequest(`/admin/tenants/${tenant.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          imageTag: effectiveTargetTag,
          redeploy: true,
        }),
      });

      setSuccessMessage(`Boutique mise à jour vers ${effectiveTargetTag.split(':')?.[1] || effectiveTargetTag} ! Redéploiement K8s en cours.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour sur Kubernetes.');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-slate-950 shadow-brutal w-full max-w-2xl max-h-[90vh] flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-900 bg-slate-50 rounded-t-[20px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-white font-black shadow-brutal-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950">Mettre à Jour la Version d'Image</h3>
              <p className="text-xs text-slate-600 font-medium">
                Boutique : <strong className="text-slate-900">{tenant.commerceName}</strong> ({tenant.subdomain}.woxxapp.de)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Notification d'erreur ou succès */}
          {error && (
            <div className="p-4 bg-rose-50 border-2 border-rose-600 rounded-2xl flex items-center gap-3 text-xs text-rose-900 font-bold">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-600 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Comparatif Version Actuelle -> Cible */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border-2 border-slate-900 shadow-brutal-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black uppercase text-slate-400">Version Actuelle</span>
              <div className="font-mono text-xs text-amber-300 font-bold truncate max-w-[200px]" title={effectiveCurrentTag}>
                {effectiveCurrentTag.split(':')?.[1] || effectiveCurrentTag}
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 hidden sm:block" />

            <div className="space-y-1 text-center sm:text-right">
              <span className="text-[10px] font-black uppercase text-slate-400">Version Sélectionnée</span>
              <div className="font-mono text-xs text-emerald-400 font-bold truncate max-w-[200px]" title={effectiveTargetTag}>
                {effectiveTargetTag ? (effectiveTargetTag.split(':')?.[1] || effectiveTargetTag) : 'Aucune'}
              </div>
            </div>
          </div>

          {/* Liste des images disponibles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-blue-600" /> Choisir parmi les images disponibles au catalogue :
              </label>
              <button
                type="button"
                onClick={() => setCustomTagMode(!customTagMode)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
              >
                {customTagMode ? 'Revenir à la liste' : 'Saisir un tag personnalisé'}
              </button>
            </div>

            {loading ? (
              <div className="py-8 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" /> Chargement des versions d'images...
              </div>
            ) : customTagMode ? (
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border-2 border-slate-900">
                <label className="text-[11px] font-black text-slate-700 uppercase">Tag Image Docker personnalisé</label>
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="ghcr.io/bezbee25/boutique-global:mon-tag-test"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500">
                  Assurez-vous que l'image est bien présente sur le registre GHCR avec les droits d'accès.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {versions.map((ver) => {
                  const isSelected = selectedTag === ver.tag;
                  const isCurrent = effectiveCurrentTag === ver.tag;

                  return (
                    <div
                      key={ver.id || ver.tag}
                      onClick={() => setSelectedTag(ver.tag)}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-brutal-xs'
                          : 'border-slate-300 hover:border-slate-900 bg-white'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-slate-950">{ver.name}</span>
                          {ver.isRecommended && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 border border-slate-900">
                              <Sparkles className="w-2.5 h-2.5" /> Recommandée
                            </span>
                          )}
                          {ver.isDefault && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-300">
                              Par défaut
                            </span>
                          )}
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 text-[10px] font-mono font-bold">
                              Actuelle
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {ver.description}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                          <span>Tag: <strong>{ver.tag.split(':')?.[1] || ver.tag}</strong></span>
                          <span>•</span>
                          <span>Arch: {ver.architecture}</span>
                          {ver.releaseDate && (
                            <>
                              <span>•</span>
                              <span>Date: {ver.releaseDate}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="pt-1">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-slate-900 bg-slate-50 rounded-b-[20px] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black border-2 border-slate-900 transition"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleApplyUpgrade}
            disabled={upgrading || !effectiveTargetTag}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition disabled:opacity-50"
          >
            {upgrading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Redéploiement K8s en cours...
              </>
            ) : isSameTag ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Redéployer cette version (Restart)
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                Mettre à jour & Redéployer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
