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
    return <div className="p-8 text-slate-500 font-bold">Chargement des documents légaux...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> CMS & Documents Légaux
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Rédigez et publiez en Markdown les CGU, CGV, Mentions Légales et politiques obligatoires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/policies/${selectedPolicy}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-xl text-xs flex items-center gap-2 transition border-2 border-slate-900 shadow-brutal-xs"
          >
            <ExternalLink className="w-4 h-4" /> Voir la page publique
          </a>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition border-2 border-slate-900 shadow-brutal-xs ${
              isPreview
                ? 'bg-amber-400 text-slate-950'
                : 'bg-white text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4" /> {isPreview ? 'Mode Éditeur' : 'Prévisualiser'}
          </button>
        </div>
      </div>

      {/* Selecteur de Document */}
      <div className="flex flex-wrap gap-2.5">
        {POLICY_LIST.map((item) => (
          <button
            key={item.slug}
            onClick={() => {
              setSelectedPolicy(item.slug);
              setSavedSuccess(false);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition border-2 border-slate-900 ${
              selectedPolicy === item.slug
                ? 'bg-amber-400 text-slate-950 shadow-brutal-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Éditeur / Aperçu */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-brutal">
        <div className="p-4 bg-slate-50 border-b-2 border-slate-900 flex items-center justify-between">
          <span className="text-xs font-black text-slate-950 uppercase tracking-wider">
            Édition : {POLICY_LIST.find((p) => p.slug === selectedPolicy)?.label}
          </span>
          <span className="text-[11px] text-blue-700 font-mono font-black bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Route : /policies/{selectedPolicy}
          </span>
        </div>

        {isPreview ? (
          <div className="p-8 min-h-[400px] text-slate-800 whitespace-pre-line text-sm leading-relaxed bg-[#FFFDF9]">
            {policies[selectedPolicy] || 'Aucun contenu rédigé.'}
          </div>
        ) : (
          <textarea
            rows={18}
            value={policies[selectedPolicy] || ''}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="# Titre du document&#10;&#10;Rédigez ici en Markdown..."
            className="w-full p-6 bg-white font-mono text-xs md:text-sm text-slate-900 leading-relaxed focus:outline-none resize-y border-none"
          />
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-900 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-800 font-black flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
                <CheckCircle2 className="w-4 h-4" /> Modifications enregistrées et publiées !
              </span>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 shadow-brutal-xs transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Publication...' : 'Enregistrer & Publier'}
          </button>
        </div>
      </div>
    </div>
  );
}
