'use client';

import React, { useState } from 'react';
import { User, Shield, Key, Download, Trash2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function ClientAccountTab() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleExportGdpr = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/gdpr/export/my');
      if (!res.ok) throw new Error('Erreur lors du téléchargement');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-donnees-${user?.email || 'compte'}.json`;
      a.click();
    } catch (err: any) {
      alert(err.message || 'Erreur export RGPD');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-600" /> Mon Compte & Profil
        </h2>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Informations de votre compte commerçant et préférences de sécurité.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" /> Identité du Compte
          </h3>

          <div className="space-y-3 text-xs font-bold">
            <div>
              <span className="text-slate-500 font-extrabold uppercase text-[10px] block">
                Adresse Email
              </span>
              <p className="text-slate-950 mt-0.5">{user?.email}</p>
            </div>

            <div>
              <span className="text-slate-500 font-extrabold uppercase text-[10px] block">
                Nom complet ou Société
              </span>
              <p className="text-slate-950 mt-0.5">{user?.full_name || 'Non renseigné'}</p>
            </div>

            <div>
              <span className="text-slate-500 font-extrabold uppercase text-[10px] block">
                Type de compte
              </span>
              <span className="inline-flex mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-600" /> Vos Données & RGPD
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Conformément au RGPD, vous disposez d'un droit d'accès et de portabilité sur l'ensemble de vos données.
          </p>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleExportGdpr}
              disabled={downloading}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Génération du fichier...' : 'Exporter toutes mes données (JSON)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
