'use client';

import React, { useState, useEffect } from 'react';
import { X, Store, Globe, Check, AlertCircle, Sparkles, ShoppingBag, Truck, ArrowRight, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateStoreModal({ isOpen, onClose, onSuccess }: CreateStoreModalProps) {
  const [commerceName, setCommerceName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [subdomainStatus, setSubdomainStatus] = useState<{
    available: boolean;
    reason?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-génération du sous-domaine à partir du nom du commerce
  const handleNameChange = (name: string) => {
    setCommerceName(name);
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSubdomain(slug);
  };

  // Vérification de la disponibilité du sous-domaine avec debounce
  useEffect(() => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainStatus(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingSubdomain(true);
      try {
        const res = await apiRequest<{ available: boolean; reason?: string }>(
          `/tenants/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`
        );
        setSubdomainStatus(res);
      } catch (err: any) {
        setSubdomainStatus({ available: false, reason: 'Erreur lors du test' });
      } finally {
        setCheckingSubdomain(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [subdomain]);

  if (!isOpen) return null;

  const toggleModule = (mod: string) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subdomainStatus && !subdomainStatus.available) {
      setError('Veuillez choisir un sous-domaine disponible.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await apiRequest('/tenants', {
        method: 'POST',
        body: JSON.stringify({
          commerceName,
          subdomain,
          customDomain: customDomain || undefined,
          modules: selectedModules,
        }),
      });

      onSuccess();
      onClose();
      // Reset form
      setCommerceName('');
      setSubdomain('');
      setCustomDomain('');
      setSelectedModules([]);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la boutique');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-900 rounded-3xl shadow-brutal-lg p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shadow-brutal-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black">
            🏪
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Créer une nouvelle boutique</h2>
            <p className="text-xs text-slate-500 font-bold">
              Déployez instantanément votre site e-commerce et son backoffice sur Kubernetes.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border-2 border-rose-600 text-rose-800 text-xs font-bold mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Nom de votre commerce *
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Boulangerie artisanale Dupont"
                  value={commerceName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Sous-domaine Woxx (.woxxapp.de) *
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="boulangerie-dupont"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                  }
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checkingSubdomain && (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  )}
                  {!checkingSubdomain && subdomainStatus && subdomainStatus.available && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                  {!checkingSubdomain && subdomainStatus && !subdomainStatus.available && (
                    <X className="w-4 h-4 text-rose-600" />
                  )}
                </div>
              </div>
              {subdomainStatus && (
                <p
                  className={`text-[11px] font-bold mt-1 ${
                    subdomainStatus.available ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {subdomainStatus.available
                    ? `✓ https://${subdomain}.woxxapp.de est disponible`
                    : subdomainStatus.reason}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">
              Nom de domaine personnalisé (Optionnel)
            </label>
            <input
              type="text"
              placeholder="Ex: www.boulangerie-dupont.fr"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value.trim().toLowerCase())}
              className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:shadow-brutal-xs"
            />
          </div>

          {/* SÉLECTION DES MODULES OPTIONNELS */}
          <div>
            <label className="block text-xs font-black text-slate-900 mb-2">
              Modules et fonctionnalités à activer
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <div
                onClick={() => toggleModule('ecommerce')}
                className={`p-3.5 rounded-2xl border-2 border-slate-900 cursor-pointer transition flex items-start gap-3 ${
                  selectedModules.includes('ecommerce')
                    ? 'bg-blue-50 border-blue-900 shadow-brutal-xs'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 border border-slate-900 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-blue-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Vente de Produits</span>
                    <input
                      type="checkbox"
                      checked={selectedModules.includes('ecommerce')}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Catalogue, paiement Stripe CB, panier et gestion de stocks.
                  </p>
                </div>
              </div>

              <div
                onClick={() => toggleModule('shipping')}
                className={`p-3.5 rounded-2xl border-2 border-slate-900 cursor-pointer transition flex items-start gap-3 ${
                  selectedModules.includes('shipping')
                    ? 'bg-indigo-50 border-indigo-900 shadow-brutal-xs'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 border border-slate-900 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-indigo-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Transport & Envoi</span>
                    <input
                      type="checkbox"
                      checked={selectedModules.includes('shipping')}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Colissimo, Mondial Relay, étiquettes d'expédition automatiques.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border-2 border-slate-900 text-xs font-black bg-white hover:bg-slate-100 text-slate-800 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={Boolean(loading || (subdomainStatus && !subdomainStatus.available))}
              className="px-6 py-2.5 rounded-xl border-2 border-slate-900 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-brutal hover:shadow-brutal-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Déploiement en cours...</span>
                </>
              ) : (
                <>
                  <span>Créer et déployer ma boutique</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
