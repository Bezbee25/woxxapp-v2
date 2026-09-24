'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Lock,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface PaymentSettings {
  stripeAccountId: string;
  stripeConnectStatus: 'NOT_CONNECTED' | 'PENDING' | 'CONNECTED' | 'RESTRICTED';
  defaultCommissionRate: number;
  woxxpayLiveMode: boolean;
}

export function SalesRepPaymentTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const [settings, setSettings] = useState<PaymentSettings>({
    stripeAccountId: '',
    stripeConnectStatus: 'NOT_CONNECTED',
    defaultCommissionRate: 20.0,
    woxxpayLiveMode: false,
  });

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

  const handleConnectStripe = async () => {
    setSaving(true);
    setSaveSuccessMessage('');
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
        setSaveSuccessMessage('Votre compte Stripe a été connecté avec succès à la plateforme WoxxPay !');
        setTimeout(() => setSaveSuccessMessage(''), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la connexion Stripe Connect');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (!confirm('Êtes-vous sûr de vouloir dissocier votre compte Stripe de la plateforme ? Vos prochains règlements ne pourront plus être versés automatiquement.')) {
      return;
    }
    setSaving(true);
    try {
      await apiRequest('/sales-rep/stripe-connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'disconnect' }),
      });
      await fetchSettings();
      setSaveSuccessMessage('Compte Stripe déconnecté.');
      setTimeout(() => setSaveSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la déconnexion');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLiveMode = async (live: boolean) => {
    setSaving(true);
    try {
      await apiRequest('/sales-rep/payment-settings', {
        method: 'POST',
        body: JSON.stringify({
          ...settings,
          woxxpayLiveMode: live,
        }),
      });
      setSettings((prev) => ({ ...prev, woxxpayLiveMode: live }));
      setSaveSuccessMessage(live ? 'Mode Production Live activé !' : 'Mode Test / Sandbox activé.');
      setTimeout(() => setSaveSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour du mode');
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
        message: `${res.message} (Environnement: ${res.details?.mode})`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Échec du test de synchronisation Stripe / WoxxPay',
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

  const isConnected = settings.stripeConnectStatus === 'CONNECTED';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* BANNIÈRE D'EN-TÊTE */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-600" /> Règlements & Stripe Connect WoxxPay
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Connectez votre compte Stripe directement à la plateforme WoxxPay pour percevoir automatiquement vos 80% nets sur chaque devis réglé.
          </p>
        </div>

        {isConnected && (
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-slate-900 rounded-xl font-black text-xs shadow-brutal-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${testing ? 'animate-bounce text-amber-600' : 'text-amber-700'}`} />
            <span>{testing ? 'Vérification...' : 'Tester le flux'}</span>
          </button>
        )}
      </div>

      {/* FEEDBACK MESSAGES */}
      {saveSuccessMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-900 p-4 rounded-2xl shadow-brutal-xs flex items-center gap-3 text-xs font-black text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {testResult && (
        <div
          className={`p-4 rounded-2xl border-2 shadow-brutal-xs flex items-center gap-3 text-xs font-black animate-in fade-in ${
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

      {/* PANNEAU PRINCIPAL DE CONNEXION STRIPE CONNECT */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black shrink-0 ${
                isConnected ? 'bg-emerald-400' : 'bg-slate-200'
              }`}
            >
              {isConnected ? '⚡' : '🔗'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-950">Liaison de Compte Stripe Connect</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                    isConnected
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-amber-100 text-amber-900 border-amber-400'
                  }`}
                >
                  {isConnected ? 'Compte Connecté & Actif' : 'Non Connecté'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {isConnected
                  ? `Compte Stripe associé : ${settings.stripeAccountId} (Paiements et virements automatiques activés)`
                  : 'Associez votre compte Stripe existant en 1 clic pour recevoir vos virements sans aucune saisie de clés API ni d’IBAN.'}
              </p>
            </div>
          </div>

          <div>
            {isConnected ? (
              <button
                type="button"
                onClick={handleDisconnectStripe}
                disabled={saving}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-slate-900 rounded-xl text-xs font-black shadow-brutal-xs transition cursor-pointer disabled:opacity-50"
              >
                Dissocier le compte
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectStripe}
                disabled={saving}
                className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white border-2 border-slate-900 rounded-2xl text-xs font-black shadow-brutal hover:shadow-brutal-lg transition flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Connecter mon compte Stripe à WoxxPay</span>
              </button>
            )}
          </div>
        </div>

        {/* EXPLICATION DU FONCTIONNEMENT STRIPE CONNECT & REVERSEMENT */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-black text-slate-500 tracking-wider">
            Fonctionnement des flux financiers WoxxPay :
          </h4>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-400 flex items-center justify-center font-black text-blue-900 text-sm">
                1
              </div>
              <h5 className="font-black text-xs text-slate-950">Règlement Client</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Votre client règle votre devis en ligne par CB ou Virement sur la passerelle sécurisée WoxxPay.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-200 border border-purple-400 flex items-center justify-center font-black text-purple-900 text-sm">
                2
              </div>
              <h5 className="font-black text-xs text-purple-950">Frais Plateforme (20%)</h5>
              <p className="text-[11px] text-purple-800 leading-relaxed font-medium">
                20% de commission sont automatiquement alloués à la plateforme WoxxApp pour l'infrastructure et l'hébergement.
              </p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-200 border border-emerald-500 flex items-center justify-center font-black text-emerald-950 text-sm">
                3
              </div>
              <h5 className="font-black text-xs text-emerald-950">Virement Net (80%)</h5>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                <strong>80% du montant</strong> sont automatiquement transférés sur votre compte Stripe Connect et versés sur votre banque.
              </p>
            </div>
          </div>
        </div>

        {/* SÉLECTION ENVIRONNEMENT TEST VS LIVE */}
        <div className="pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="liveModeToggle"
              checked={settings.woxxpayLiveMode}
              onChange={(e) => handleToggleLiveMode(e.target.checked)}
              disabled={saving}
              className="w-5 h-5 rounded border-2 border-slate-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="liveModeToggle" className="text-xs font-bold text-slate-900 cursor-pointer">
              <span className="font-black block">Activer le mode Production Live (Paiements Réels)</span>
              <span className="text-[11px] text-slate-500 font-normal">
                Si désactivé, le système fonctionne en mode Test Sandbox avec cartes bancaires d'essai.
              </span>
            </label>
          </div>

          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sécurité certifiée PCI-DSS & RGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
}

