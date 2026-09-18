'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Save, BarChart3, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export function SmtpTab() {
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('no-reply@woxxapp.de');
  const [gaId, setGaId] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    apiRequest<Record<string, string>>('/admin/settings')
      .then((settings) => {
        if (settings) {
          if (settings.smtp_host) setSmtpHost(settings.smtp_host);
          if (settings.smtp_port) setSmtpPort(settings.smtp_port);
          if (settings.smtp_user) setSmtpUser(settings.smtp_user);
          if (settings.smtp_pass) setSmtpPass(settings.smtp_pass);
          if (settings.smtp_from) setSmtpFrom(settings.smtp_from);
          if (settings.google_analytics_id) setGaId(settings.google_analytics_id);
        }
      })
      .catch((err) => console.error('Erreur chargement settings SMTP:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          smtp_host: smtpHost,
          smtp_port: smtpPort,
          smtp_user: smtpUser,
          smtp_pass: smtpPass,
          smtp_from: smtpFrom,
          google_analytics_id: gaId,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur enregistrement SMTP');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Chargement des paramètres SMTP...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0D121F] p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-cyan-400" /> Serveur SMTP & Outils d'Analyse
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configurez l'envoi d'emails transactionnels (factures, alertes) et le tag Google Analytics (GA4).
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Paramètres SMTP */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm uppercase font-bold text-cyan-400 tracking-wider">
            1. Configuration Serveur de Messagerie (SMTP)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Hôte SMTP (Host)</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.sendgrid.net / mail.woxxapp.de"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Port SMTP</label>
              <input
                type="text"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="587 ou 465"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nom d'Utilisateur / API Key</label>
              <input
                type="text"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="apikey / user@woxxapp.de"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Mot de Passe / Clé Secrète</label>
              <input
                type="password"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Adresse d'Expéditeur (From)</label>
              <input
                type="email"
                value={smtpFrom}
                onChange={(e) => setSmtpFrom(e.target.value)}
                placeholder="no-reply@woxxapp.de"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Google Analytics */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-sm uppercase font-bold tracking-wider">
              2. Google Analytics 4 (Mesure d'Audience)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              ID de Mesure GA4 (ex: G-XXXXXXXXXX)
            </label>
            <input
              type="text"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="G-1234567890"
              className="w-full md:w-96 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[11px] text-slate-500 mt-2 block">
              Conforme CNIL : Google Analytics ne sera exécuté que si le visiteur accepte expressément le bandeau de consentement des cookies.
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between bg-[#0D121F] p-4 rounded-2xl border border-slate-800">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Configuration enregistrée !
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
