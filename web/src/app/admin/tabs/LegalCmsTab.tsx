'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Save, ExternalLink, Eye, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

type PolicySlug = 'cgu' | 'cgv' | 'legal' | 'gdpr' | 'cookies';

const POLICY_LIST: Array<{ slug: PolicySlug; key: string; label: string }> = [
  { slug: 'cgu', key: 'policy_cgu', label: "Conditions Générales d'Utilisation (CGU)" },
  { slug: 'cgv', key: 'policy_cgv', label: 'Conditions Générales de Vente (CGV)' },
  { slug: 'legal', key: 'policy_legal', label: 'Mentions Légales' },
  { slug: 'gdpr', key: 'policy_gdpr', label: 'Protection des Données (RGPD)' },
  { slug: 'cookies', key: 'policy_cookies', label: 'Politique de Cookies' },
];

export function LegalCmsTab() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicySlug>('cgu');
  const [policies, setPolicies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    apiRequest<Record<string, string>>('/admin/settings')
      .then((settings) => {
        if (settings) {
          setPolicies({
            cgu: settings.policy_cgu || '',
            cgv: settings.policy_cgv || '',
            legal: settings.policy_legal || '',
            gdpr: settings.policy_gdpr || '',
            cookies: settings.policy_cookies || '',
          });
        }
      })
      .catch((err) => console.error('Erreur chargement CMS:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleContentChange = (val: string) => {
    setPolicies((prev) => ({
      ...prev,
      [selectedPolicy]: val,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const currentKey = `policy_${selectedPolicy}`;
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          [currentKey]: policies[selectedPolicy] || '',
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur enregistrement document');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Chargement des documents légaux...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0D121F] p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" /> CMS & Documents Légaux
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rédigez et publiez en Markdown les CGU, CGV, Mentions Légales et politiques obligatoires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/policies/${selectedPolicy}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium rounded-xl text-xs flex items-center gap-2 transition border border-slate-700"
          >
            <ExternalLink className="w-4 h-4" /> Voir la page publique
          </a>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition border ${
              isPreview
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-4 h-4" /> {isPreview ? 'Mode Éditeur' : 'Prévisualiser'}
          </button>
        </div>
      </div>

      {/* Selecteur de Document */}
      <div className="flex flex-wrap gap-2">
        {POLICY_LIST.map((item) => (
          <button
            key={item.slug}
            onClick={() => {
              setSelectedPolicy(item.slug);
              setSavedSuccess(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedPolicy === item.slug
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#0D121F] text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Éditeur / Aperçu */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#080B12] border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Édition Markdown : {POLICY_LIST.find((p) => p.slug === selectedPolicy)?.label}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Route : /policies/{selectedPolicy}
          </span>
        </div>

        {isPreview ? (
          <div className="p-8 min-h-[400px] text-slate-300 whitespace-pre-line text-sm leading-relaxed bg-[#07090E]/60">
            {policies[selectedPolicy] || 'Aucun contenu rédigé.'}
          </div>
        ) : (
          <textarea
            rows={18}
            value={policies[selectedPolicy] || ''}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="# Titre du document&#10;&#10;Rédigez ici en Markdown..."
            className="w-full p-6 bg-slate-950/60 font-mono text-xs md:text-sm text-slate-200 leading-relaxed focus:outline-none resize-y border-none"
          />
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-[#080B12] border-t border-slate-800 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Modifications enregistrées et publiées !
              </span>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Publication...' : 'Enregistrer & Publier'}
          </button>
        </div>
      </div>
    </div>
  );
}
