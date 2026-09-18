'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Save, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export function WoxxPayTab() {
  const [apiKey, setApiKey] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    apiRequest<Record<string, string>>('/admin/settings')
      .then((settings) => {
        if (settings) {
          if (settings.woxxpay_api_key) setApiKey(settings.woxxpay_api_key);
          if (settings.woxxpay_merchant_id) setMerchantId(settings.woxxpay_merchant_id);
          if (settings.woxxpay_webhook_secret) setWebhookSecret(settings.woxxpay_webhook_secret);
        }
      })
      .catch((err) => console.error('Erreur chargement settings WoxxPay:', err))
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
          woxxpay_api_key: apiKey,
          woxxpay_merchant_id: merchantId,
          woxxpay_webhook_secret: webhookSecret,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur enregistrement WoxxPay');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Chargement de la configuration WoxxPay...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0D121F] p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" /> WoxxPay — Encaissement Direct Dédié
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configuration du compte marchand WoxxPay direct pour encaisser les abonnements WoxxApp V2 de façon complètement isolée.
        </p>
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Compte Marchand Direct Isolé :</strong> Les encaissements des abonnements (15 €/mois ou 150 €/an) sont directement versés sur votre compte WoxxPay initial sans passer par des comptes connectés tiers.
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm uppercase font-bold text-cyan-400 tracking-wider">
            Identifiants API WoxxPay
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" /> Clé API Secrète WoxxPay (Live/Test)
              </label>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="woxx_live_appv2_••••••••••••••••"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Merchant ID WoxxPay
              </label>
              <input
                type="text"
                required
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="merch_woxxapp_v2"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Secret de Signature Webhook (Signature Verification)
              </label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="whsec_••••••••••••••••"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between bg-[#0D121F] p-4 rounded-2xl border border-slate-800">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Paramètres WoxxPay enregistrés !
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer WoxxPay'}
          </button>
        </div>
      </form>
    </div>
  );
}
