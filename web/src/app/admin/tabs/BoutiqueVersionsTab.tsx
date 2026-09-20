'use client';

import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Save, RefreshCw, AlertCircle, Sparkles, Terminal } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export function BoutiqueVersionsTab() {
  const [defaultImage, setDefaultImage] = useState('ghcr.io/bezbee25/boutique-global:latest');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Suggestions de tags automatiques
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suggestedTags = [
    `ghcr.io/bezbee25/boutique-global:${todayStr}-stable`,
    `ghcr.io/bezbee25/boutique-global:v2026.09.20-main`,
    `ghcr.io/bezbee25/boutique-global:latest`
  ];

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const settings = await apiRequest<Record<string, string>>('/admin/settings');
      if (settings && settings.boutique_default_image_tag) {
        setDefaultImage(settings.boutique_default_image_tag);
      }
    } catch (err) {
      console.error('Erreur chargement version d’image:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          boutique_default_image_tag: defaultImage.trim(),
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde du tag d’image.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" /> Version Générique des Boutiques & Registre
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Définissez la version de conteneur Docker/OCI appliquée lors du déploiement des boutiques clientes sur Kubernetes.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition border-2 border-slate-900 shadow-brutal-xs self-start md:self-auto"
          title="Rafraîchir"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Configuration Principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700">
              Image Docker / Tag Actif pour le Déploiement
            </label>
            <div className="relative">
              <input
                type="text"
                value={defaultImage}
                onChange={(e) => setDefaultImage(e.target.value)}
                placeholder="ghcr.io/bezbee25/boutique-global:YYYYMMDD-HHmmss"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-900 rounded-2xl text-xs font-mono font-bold text-slate-950 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Toute nouvelle boutique créée ou reprovisionnée utilisera cette référence d'image immuable.
            </p>
          </div>

          {/* Suggestions de versions */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Suggestions de Tags :
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setDefaultImage(tag)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 border border-slate-300 hover:border-slate-900 text-[11px] font-mono font-bold text-slate-800 transition"
                >
                  {tag.split(':')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton de Sauvegarde */}
          <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer la version générique'}
            </button>

            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Enregistré avec succès !
              </span>
            )}
          </div>
        </div>

        {/* Panneau Pédagogique K8s & Stratégie */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-brutal space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
            <Terminal className="w-5 h-5" /> Bonnes Pratiques Kubernetes
          </div>
          
          <div className="text-xs text-slate-300 space-y-3 font-normal leading-relaxed">
            <p>
              <strong className="text-white font-bold">1. Abandon de <code>latest</code></strong> :
              Les tags horodatés (ex: <code>20260920-173000</code>) garantissent l'immuabilité et évitent les conflits de cache K8s (<code>imagePullPolicy: IfNotPresent</code>).
            </p>
            <p>
              <strong className="text-white font-bold">2. Déploiement Rollout</strong> :
              Chaque mise à jour d'image déclenche un Rolling Update sans coupure de trafic pour les visiteurs des boutiques.
            </p>
            <p>
              <strong className="text-white font-bold">3. Rollback Immédiat</strong> :
              En cas d'anomalie, il suffit de revenir à l'horodatage précédent pour restaurer la version saine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
