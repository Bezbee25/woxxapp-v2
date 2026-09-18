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
    return <div className="p-8 text-slate-500 font-bold">Chargement de la configuration WoxxPay...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" /> WoxxPay — Encaissement Direct Dédié
        </h2>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Configuration du compte marchand WoxxPay direct pour encaisser les abonnements WoxxApp V2 de façon complètement isolée.
        </p>
      </div>

      <div className="bg-amber-100 border-2 border-slate-900 rounded-2xl p-4 flex items-start gap-3 shadow-brutal-xs">
        <ShieldCheck className="w-5 h-5 text-slate-950 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-800 font-medium leading-relaxed">
          <strong className="text-slate-950 font-black">Compte Marchand Direct Isolé :</strong> Les encaissements des abonnements (15 €/mois ou 150 €/an) sont directement versés sur votre compte WoxxPay initial sans passer par des comptes connectés tiers.
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-4 shadow-brutal">
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">
            Identifiants API WoxxPay
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" /> Clé API Secrète WoxxPay (Live/Test)
              </label>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="woxx_live_appv2_••••••••••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-mono font-bold text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Merchant ID WoxxPay
              </label>
              <input
                type="text"
                required
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="merch_woxxapp_v2"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-mono font-bold text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Secret de Signature Webhook (Signature Verification)
              </label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="whsec_••••••••••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm font-mono font-bold text-slate-950 focus:outline-none focus:bg-amber-50/50 shadow-brutal-xs transition"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-brutal">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Paramètres WoxxPay enregistrés !
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 transition active:shadow-none disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer WoxxPay'}
          </button>
        </div>
      </form>
    </div>
  );
}
