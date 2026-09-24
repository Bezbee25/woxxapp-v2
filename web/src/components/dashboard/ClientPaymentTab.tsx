'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Lock,
  Store,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ConnectedTenant {
  id: string;
  commerceName: string;
  subdomain: string;
  status: string;
  k8sStatus: string;
}

interface ClientPaymentSettings {
  stripeAccountId: string;
  stripeConnectStatus: 'NOT_CONNECTED' | 'PENDING' | 'CONNECTED' | 'RESTRICTED';
  woxxpayLiveMode: boolean;
  tenants: ConnectedTenant[];
}

export function ClientPaymentTab() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [settings, setSettings] = useState<ClientPaymentSettings>({
    stripeAccountId: '',
    stripeConnectStatus: 'NOT_CONNECTED',
    woxxpayLiveMode: false,
    tenants: [],
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<ClientPaymentSettings>('/account/payment-settings');
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

  // Détection du retour Stripe Connect OAuth
  useEffect(() => {
    const stripeConnect = searchParams?.get('stripe_connect');
    const returnedAccountId = searchParams?.get('stripe_account_id');

    if (stripeConnect === 'success') {
      const accountId = returnedAccountId || settings.stripeAccountId || `acct_client_${Date.now()}`;
      
      apiRequest<any>('/account/stripe-connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'onboard', accountId }),
      })
        .then((res) => {
          setSettings((prev) => ({
            ...prev,
            stripeConnectStatus: 'CONNECTED',
            stripeAccountId: res.accountId || accountId,
          }));
          setSuccessMessage('Votre compte Stripe Connect a été lié avec succès et propagé sur toutes vos boutiques !');
          
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('stripe_connect');
            url.searchParams.delete('stripe_account_id');
            url.searchParams.delete('payment_account_id');
            window.history.replaceState({}, '', url.toString());
          }
        })
        .catch((err) => console.error('Erreur callback Stripe Connect:', err));
    }
  }, [searchParams]);

  const handleConnectStripe = async () => {
    setSaving(true);
    setSuccessMessage('');
    setTestResult(null);
    try {
      const res = await apiRequest<any>('/account/stripe-connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'onboard' }),
      });
      if (res && res.stripeConnectStatus) {
        setSettings((prev) => ({
          ...prev,
          stripeConnectStatus: res.stripeConnectStatus,
          stripeAccountId: res.accountId || prev.stripeAccountId,
        }));
        setSuccessMessage('Votre compte Stripe a été connecté avec succès à la plateforme WoxxPay !');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la connexion Stripe Connect');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (!confirm('Êtes-vous sûr de vouloir dissocier votre compte Stripe ? Vos boutiques ne pourront plus encaisser les règlements par carte bancaire tant qu’un compte n’est pas reconnecté.')) {
      return;
    }
    setSaving(true);
    setTestResult(null);
    try {
      await apiRequest('/account/stripe-connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'disconnect' }),
      });
      await fetchSettings();
      setSuccessMessage('Compte Stripe dissocié.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la déconnexion');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLiveMode = async (live: boolean) => {
    setSaving(true);
    try {
      await apiRequest('/account/payment-settings', {
        method: 'POST',
        body: JSON.stringify({
          ...settings,
          woxxpayLiveMode: live,
        }),
      });
      setSettings((prev) => ({ ...prev, woxxpayLiveMode: live }));
      setSuccessMessage(live ? 'Mode Production Live activé !' : 'Mode Test / Sandbox activé.');
      setTimeout(() => setSuccessMessage(''), 4000);
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
      const res = await apiRequest<any>('/account/stripe-connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'test_connection' }),
      });
      setTestResult({
        success: true,
        message: res.message || 'Connexion Stripe opérationnelle !',
        details: res.details,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Échec du test de connexion Stripe.',
      });
    } finally {
      setTesting(false);
    }
  };

  const isConnected = settings.stripeConnectStatus === 'CONNECTED';

  return (
    <div className="space-y-6">
      {/* EN-TÊTE DE LA PAGE */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-slate-900 text-[10px] font-black uppercase tracking-wider">
              Encaissement Centralisé
            </span>
            <span className="text-slate-400 font-bold">•</span>
            <span className="text-xs font-bold text-slate-500">WoxxPay v2</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 mt-1 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-emerald-600" />
            Paiements & Stripe Connect
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Liez votre compte bancaire Stripe une seule fois. Vos boutiques existantes et futures encaissent automatiquement vos ventes en toute sécurité.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading || saving}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* MESSAGE DE SUCCÈS */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-slate-900 shadow-brutal-xs flex items-center gap-3 text-xs font-black text-emerald-950 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* CARTE PRINCIPALE : STATUT STRIPE CONNECT */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-300 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-xl font-black shrink-0">
              💳
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">Compte Stripe Connect</h3>
              <p className="text-xs text-slate-500 font-medium">
                Passerelle de paiement sécurisée WoxxPay (virement direct sur votre compte)
              </p>
            </div>
          </div>

          <div>
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 border-2 border-slate-900 font-black text-xs shadow-brutal-xs">
                <CheckCircle2 className="w-4 h-4" />
                Compte Stripe Actif & Lié
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 font-black text-xs shadow-brutal-xs">
                <AlertCircle className="w-4 h-4" />
                Non Connecté
              </span>
            )}
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-900 space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Identifiant Compte Stripe
                </span>
                <p className="font-mono text-xs font-black text-slate-950 truncate">
                  {settings.stripeAccountId}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-slate-900 space-y-1">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                  Encaissements & Virements
                </span>
                <p className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Activés (Automatique par Stripe)
                </p>
              </div>
            </div>

            {/* RÉSULTAT DU TEST */}
            {testResult && (
              <div
                className={`p-4 rounded-2xl border-2 border-slate-900 shadow-brutal-xs text-xs space-y-2 ${
                  testResult.success ? 'bg-emerald-50 text-emerald-950' : 'bg-rose-50 text-rose-950'
                }`}
              >
                <div className="font-black flex items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{testResult.message}</span>
                </div>
                {testResult.details && (
                  <div className="text-[11px] font-medium opacity-90 pl-6">
                    Boutiques connectées : <strong>{testResult.details.connectedStoresCount}</strong> • Mode : <strong>{testResult.details.mode}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-900 font-black text-xs shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-2 cursor-pointer"
              >
                <Zap className={`w-4 h-4 text-amber-400 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Vérification...' : 'Tester la connexion'}</span>
              </button>

              <button
                onClick={handleDisconnectStripe}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-slate-900 font-black text-xs shadow-brutal-xs transition cursor-pointer"
              >
                Dissocier mon compte Stripe
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-slate-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-800 font-medium space-y-1">
                <p className="font-bold text-slate-950">
                  Pourquoi connecter votre compte Stripe ?
                </p>
                <p>
                  Stripe Connect permet à vos clients de régler par carte bancaire sur vos boutiques en toute sécurité. Les fonds sont versés directement sur votre compte bancaire sans intermédiaire.
                </p>
              </div>
            </div>

            <button
              onClick={handleConnectStripe}
              disabled={saving}
              className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm border-2 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition flex items-center justify-center gap-3 cursor-pointer"
            >
              <CreditCard className="w-5 h-5 text-slate-950" />
              <span>{saving ? 'Connexion en cours...' : 'Connecter mon compte Stripe avec WoxxPay'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SÉLECTEUR DE MODE : TEST VS PRODUCTION */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-950">Environnement d'Encaissement</h3>
            <p className="text-xs text-slate-500 font-medium">
              Basculez entre le mode Sandbox (cartes de test) et le mode Production réel
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-100 border-2 border-slate-900 rounded-2xl">
            <button
              onClick={() => handleToggleLiveMode(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                !settings.woxxpayLiveMode
                  ? 'bg-amber-400 text-slate-950 border border-slate-900 shadow-brutal-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Mode Test (Sandbox)
            </button>
            <button
              onClick={() => handleToggleLiveMode(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                settings.woxxpayLiveMode
                  ? 'bg-emerald-400 text-slate-950 border border-slate-900 shadow-brutal-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Mode Production (Live)
            </button>
          </div>
        </div>
      </div>

      {/* LISTE DES BOUTIQUES CONNECTÉES AUTOMATIQUEMENT */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-black text-slate-950">
              Mes Boutiques Rattachées ({settings.tenants?.length || 0})
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
            Synchronisation Automatique
          </span>
        </div>

        <p className="text-xs text-slate-600 font-medium">
          Toutes les boutiques ci-dessous utilisent automatiquement cette configuration de paiement Stripe :
        </p>

        {settings.tenants && settings.tenants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {settings.tenants.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-950 truncate">
                    {t.commerceName}
                  </h4>
                  <p className="text-[11px] font-bold text-purple-700 font-mono truncate">
                    {t.subdomain}.woxxapp.de
                  </p>
                </div>

                <div className="shrink-0">
                  {isConnected ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-slate-900 text-[10px] font-black flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Stripe Actif
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-slate-900 text-[10px] font-black">
                      En attente Stripe
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center text-xs text-slate-500 font-medium">
            Vous n'avez pas encore créé de boutique. Dès qu'une boutique sera créée, elle sera immédiatement reliée à votre compte Stripe.
          </div>
        )}
      </div>

      {/* SÉCURITÉ & HERMÉTICITÉ */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-brutal space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Protection & Isolation des Flux Financiers</span>
        </div>
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          Votre compte bancaire Stripe est rattaché exclusivement à votre compte WoxxApp. Aucun commercial ou tiers accédant à l'administration de votre boutique ne peut modifier ou détourner votre compte Stripe.
        </p>
      </div>
    </div>
  );
}
