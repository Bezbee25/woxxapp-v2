'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Shield,
  Key,
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Zap,
  Lock,
  Percent,
  Check,
  Eye,
  EyeOff,
  Radio,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface PaymentSettings {
  stripeAccountId: string;
  stripePublishableKey: string;
  hasStripeSecretKey: boolean;
  maskedStripeSecretKey: string;
  hasStripeWebhookSecret: boolean;
  maskedStripeWebhookSecret: string;
  stripeConnectStatus: 'NOT_CONNECTED' | 'PENDING' | 'CONNECTED' | 'RESTRICTED';
  bankIban: string;
  bankBic: string;
  bankAccountHolder: string;
  defaultCommissionRate: number;
  woxxpayLiveMode: boolean;
}

export function SalesRepPaymentTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [settings, setSettings] = useState<PaymentSettings>({
    stripeAccountId: '',
    stripePublishableKey: '',
    hasStripeSecretKey: false,
    maskedStripeSecretKey: '',
    hasStripeWebhookSecret: false,
    maskedStripeWebhookSecret: '',
    stripeConnectStatus: 'NOT_CONNECTED',
    bankIban: '',
    bankBic: '',
    bankAccountHolder: '',
    defaultCommissionRate: 10.0,
    woxxpayLiveMode: false,
  });

  const [stripeSecretKeyInput, setStripeSecretKeyInput] = useState('');
  const [stripeWebhookSecretInput, setStripeWebhookSecretInput] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<PaymentSettings>('/sales-rep/payment-settings');
      if (data) {
        setSettings(data);
      }
    } catch (err: any) {
      console.error('Erreur chargement paramètres de paiement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccessMessage('');
    setTestResult(null);

    try {
      const payload: any = {
        stripeAccountId: settings.stripeAccountId,
        stripePublishableKey: settings.stripePublishableKey,
        stripeConnectStatus: settings.stripeConnectStatus,
        bankIban: settings.bankIban,
        bankBic: settings.bankBic,
        bankAccountHolder: settings.bankAccountHolder,
        defaultCommissionRate: settings.defaultCommissionRate,
        woxxpayLiveMode: settings.woxxpayLiveMode,
        hasExistingSecret: settings.hasStripeSecretKey,
      };

      if (stripeSecretKeyInput.trim()) {
        payload.stripeSecretKey = stripeSecretKeyInput.trim();
      }
      if (stripeWebhookSecretInput.trim()) {
        payload.stripeWebhookSecret = stripeWebhookSecretInput.trim();
      }

      const res = await apiRequest<any>('/sales-rep/payment-settings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSaveSuccessMessage(res.message || 'Paramètres sauvegardés avec succès !');
      setStripeSecretKeyInput('');
      setStripeWebhookSecretInput('');
      await fetchSettings();
      setTimeout(() => setSaveSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleConnectStripe = async () => {
    setSaving(true);
    try {
      const res = await apiRequest<any>('/sales-rep/stripe-connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'onboard' }),
      });
      if (res && res.stripeConnectStatus) {
        setSettings((prev) => ({
          ...prev,
          stripeConnectStatus: res.stripeConnectStatus,
          stripeAccountId: res.accountId || prev.stripeAccountId,
        }));
        setSaveSuccessMessage('Compte Stripe Connect configuré avec succès !');
        setTimeout(() => setSaveSuccessMessage(''), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur connexion Stripe Connect');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter ce compte Stripe ?')) return;
    setSaving(true);
    try {
      await apiRequest('/sales-rep/stripe-connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'disconnect' }),
      });
      await fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la déconnexion');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiRequest<any>('/sales-rep/stripe-connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'test_connection' }),
      });
      setTestResult({
        success: true,
        message: `${res.message} (Mode: ${res.details?.mode})`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Échec du test de connexion Stripe / WoxxPay',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-12 text-center shadow-brutal">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
        <p className="text-xs font-black text-slate-700">Chargement de votre passerelle WoxxPay...</p>
      </div>
    );
  }

  const isConnected = settings.stripeConnectStatus === 'CONNECTED' || (!!settings.stripePublishableKey && settings.hasStripeSecretKey);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* BANNIÈRE D'EN-TÊTE */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-600" /> Passerelle Stripe & WoxxPay
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Configurez votre compte Stripe et vos paramètres de versement des commissions WoxxPay.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-slate-900 rounded-xl font-black text-xs shadow-brutal-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${testing ? 'animate-bounce text-amber-600' : 'text-amber-700'}`} />
            <span>{testing ? 'Test en cours...' : 'Tester la connexion'}</span>
          </button>
        </div>
      </div>

      {/* MESSAGES D'ALERTE / FEEDBACK */}
      {saveSuccessMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-900 p-4 rounded-2xl shadow-brutal-xs flex items-center gap-3 text-xs font-black text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {testResult && (
        <div
          className={`p-4 rounded-2xl border-2 shadow-brutal-xs flex items-center gap-3 text-xs font-black ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-900 text-emerald-950'
              : 'bg-rose-50 border-rose-900 text-rose-950'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* STATUT STRIPE CONNECT */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-xl font-black shrink-0 ${
                isConnected ? 'bg-emerald-400' : 'bg-slate-200'
              }`}
            >
              {isConnected ? '⚡' : '🔌'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-950">Stripe Connect WoxxPay</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    isConnected
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-amber-100 text-amber-900 border-amber-400'
                  }`}
                >
                  {isConnected ? 'Compte Connecté' : 'Non Connecté'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                {isConnected
                  ? `Identifiant : ${settings.stripeAccountId || 'Mode clés API personnalisées'}`
                  : 'Liez votre compte Stripe pour encaisser les règlements et commissions directement.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <button
                type="button"
                onClick={handleDisconnectStripe}
                disabled={saving}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-slate-900 rounded-xl text-xs font-black shadow-brutal-xs transition cursor-pointer"
              >
                Déconnecter
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectStripe}
                disabled={saving}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white border-2 border-slate-900 rounded-xl text-xs font-black shadow-brutal-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Connecter avec Stripe Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FORMULAIRE DE CONFIGURATION DÉTAILLÉ */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* SECTION CLÉS API STRIPE */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-600" /> Clés API Stripe (Marchand / Développeur)
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Renseignez vos clés API Stripe pour une configuration manuelle ou un environnement dédié.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Clé Publique Stripe (Publishable Key)
                </label>
                <input
                  type="text"
                  placeholder="pk_test_51..."
                  value={settings.stripePublishableKey}
                  onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Clé Secrète Stripe (Secret Key)
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    placeholder={settings.hasStripeSecretKey ? settings.maskedStripeSecretKey : 'sk_test_51...'}
                    value={stripeSecretKeyInput}
                    onChange={(e) => setStripeSecretKeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {settings.hasStripeSecretKey && !stripeSecretKeyInput && (
                  <p className="text-[10px] text-emerald-700 font-bold mt-1">
                    ✓ Clé secrète actuellement enregistrée et protégée.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Webhook Signing Secret (Optionnel)
                </label>
                <div className="relative">
                  <input
                    type={showWebhookSecret ? 'text' : 'password'}
                    placeholder={settings.hasStripeWebhookSecret ? settings.maskedStripeWebhookSecret : 'whsec_...'}
                    value={stripeWebhookSecretInput}
                    onChange={(e) => setStripeWebhookSecretInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION VIREMENT COMMISSION & IBAN */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Coordonnées Bancaires (Versements WoxxPay)
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Coordonnées utilisées pour le virement de vos commissions et les paiements directs.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Titulaire du Compte (Bénéficiaire)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jean Dupont ou Agence Conseil SAS"
                  value={settings.bankAccountHolder}
                  onChange={(e) => setSettings({ ...settings, bankAccountHolder: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  IBAN (Numéro de Compte International)
                </label>
                <input
                  type="text"
                  placeholder="FR76 3000 6000 0112 3456 7890 189"
                  value={settings.bankIban}
                  onChange={(e) => setSettings({ ...settings, bankIban: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                    BIC / SWIFT
                  </label>
                  <input
                    type="text"
                    placeholder="BNPAFR2X"
                    value={settings.bankBic}
                    onChange={(e) => setSettings({ ...settings, bankBic: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                    Commission (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={settings.defaultCommissionRate}
                      onChange={(e) =>
                        setSettings({ ...settings, defaultCommissionRate: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-8"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION ENVIRONNEMENT & VALIDATION */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="liveMode"
              checked={settings.woxxpayLiveMode}
              onChange={(e) => setSettings({ ...settings, woxxpayLiveMode: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="liveMode" className="text-xs font-bold text-slate-900 cursor-pointer">
              <span className="font-black block">Activer le mode Production Live (Transactions réelles)</span>
              <span className="text-[11px] text-slate-500 font-normal">
                Décochez pour conserver le mode Test / Sandbox (cartes de test autorisées).
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-400 hover:bg-emerald-500 text-slate-950 border-2 border-slate-900 rounded-2xl font-black text-xs shadow-brutal-xs hover:shadow-brutal transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{saving ? 'Enregistrement...' : 'Enregistrer la configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
