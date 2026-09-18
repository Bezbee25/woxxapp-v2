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
    return <div className="p-8 text-slate-500 font-bold">Chargement des paramètres SMTP...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-600" /> Serveur SMTP & Outils d'Analyse
        </h2>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Configurez l'envoi d'emails transactionnels (factures, alertes) et le tag Google Analytics (GA4).
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Paramètres SMTP */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-4 shadow-brutal">
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">
            1. Configuration Serveur de Messagerie (SMTP)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Hôte SMTP (Host)</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.sendgrid.net / mail.woxxapp.de"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-medium text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Port SMTP</label>
              <input
                type="text"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="587 ou 465"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-medium text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Nom d'Utilisateur / API Key</label>
              <input
                type="text"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="apikey / user@woxxapp.de"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-medium text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Mot de Passe / Clé Secrète</label>
              <input
                type="password"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-medium text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Adresse d'Expéditeur (From)</label>
              <input
                type="email"
                value={smtpFrom}
                onChange={(e) => setSmtpFrom(e.target.value)}
                placeholder="no-reply@woxxapp.de"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-medium text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
            </div>
          </div>
        </div>

        {/* Google Analytics */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-4 shadow-brutal">
          <div className="flex items-center gap-2 text-slate-950">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">
              2. Google Analytics 4 (Mesure d'Audience)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              ID de Mesure GA4 (ex: G-XXXXXXXXXX)
            </label>
            <input
              type="text"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="G-1234567890"
              className="w-full md:w-96 px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-mono font-bold text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
            />
            <span className="text-[11px] text-slate-500 font-medium mt-2 block">
              Conforme CNIL : Google Analytics ne sera exécuté que si le visiteur accepte expressément le bandeau de consentement des cookies.
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-brutal">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Configuration enregistrée !
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 transition active:shadow-none disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
