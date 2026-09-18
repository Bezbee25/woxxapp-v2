'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Download, FileSpreadsheet, Lock, CheckCircle, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface AnonymizedUser {
  id: string;
  email: string;
  anonymizedAt: string;
}

export function GdprAuditTab() {
  const [anonymizedUsers, setAnonymizedUsers] = useState<AnonymizedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadYear, setDownloadYear] = useState<string>('');

  const fetchAnonymized = async () => {
    setLoading(true);
    try {
      const allUsers = await apiRequest<any[]>('/admin/users');
      const filtered = (allUsers || []).filter((u) => !u.is_active && u.email.includes('anonymized'));
      setAnonymizedUsers(
        filtered.map((u) => ({
          id: u.id,
          email: u.email,
          anonymizedAt: u.created_at,
        }))
      );
    } catch (err) {
      console.error('Erreur audit RGPD:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnonymized();
  }, []);

  const handleDownloadArchive = () => {
    const url = `/api/admin/gdpr/fiscal-archive${downloadYear ? `?year=${downloadYear}` : ''}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0D121F] p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" /> Audit RGPD & Archive Décennale Légale
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Garantie de conformité avec les règlements européens (RGPD) et le Code de Commerce français.
        </p>
      </div>

      {/* Compliance Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <CheckCircle className="w-4 h-4" /> Art. 20 RGPD — Portabilité
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Chaque client peut exporter ses données au format JSON structuré directement depuis son espace.
          </p>
        </div>

        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Lock className="w-4 h-4" /> Art. 17 RGPD — Droit à l'Oubli
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Anonymisation irréversible des données d'identification lors de la suppression de compte.
          </p>
        </div>

        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <FileSpreadsheet className="w-4 h-4" /> Art. L123-22 Code Commerce
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Conservation inaltérable des factures et écritures comptables pendant 10 ans pour le fisc.
          </p>
        </div>
      </div>

      {/* Téléchargement Archive Fiscale */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" /> Téléchargement Archive Fiscale (10 Ans)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Générez le fichier CSV officiel de toutes les factures émises pour votre expert-comptable ou l'administration fiscale.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={downloadYear}
              onChange={(e) => setDownloadYear(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">Tout l'historique</option>
              <option value="2026">Exercice 2026</option>
              <option value="2025">Exercice 2025</option>
              <option value="2024">Exercice 2024</option>
            </select>

            <button
              onClick={handleDownloadArchive}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition"
            >
              <FileSpreadsheet className="w-4 h-4" /> Exporter en CSV
            </button>
          </div>
        </div>
      </div>

      {/* Registre des Utilisateurs Anonymisés */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#080B12] border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-sm text-white">Registre des Comptes Anonymisés (Droit à l'oubli)</span>
          <button
            onClick={fetchAnonymized}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0E17] text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">ID Utilisateur Anonymisé</th>
                <th className="px-5 py-4">Alias Anonyme</th>
                <th className="px-5 py-4">Statut Données</th>
                <th className="px-5 py-4">Conservation Factures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {anonymizedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-4 font-mono text-slate-400">{u.id}</td>
                  <td className="px-5 py-4 font-mono text-cyan-400">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Identité Supprimée
                    </span>
                  </td>
                  <td className="px-5 py-4 text-emerald-400 font-semibold">
                    Factures Archivées 10 ans
                  </td>
                </tr>
              ))}
              {anonymizedUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                    Aucun compte supprimé ou anonymisé enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
