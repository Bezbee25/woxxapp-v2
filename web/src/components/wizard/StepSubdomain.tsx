'use client';

import React, { useState, useEffect } from 'react';
import { Store, Globe, Check, AlertCircle, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { WizardFormData, SubdomainCheckResult } from './wizardTypes';

interface StepSubdomainProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
}

export function StepSubdomain({ formData, updateFormData, onNext }: StepSubdomainProps) {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<SubdomainCheckResult | null>(null);
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);

  // Auto-génération du sous-domaine à partir du nom
  const handleNameChange = (name: string) => {
    updateFormData({ commerceName: name });
    if (!hasManuallyEditedSlug) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      updateFormData({ subdomain: slug });
    }
  };

  const handleSubdomainChange = (raw: string) => {
    setHasManuallyEditedSlug(true);
    const slug = raw
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    updateFormData({ subdomain: slug });
  };

  // Vérification de la disponibilité du sous-domaine avec debounce
  useEffect(() => {
    const sub = formData.subdomain.trim();
    if (!sub || sub.length < 3) {
      setStatus(null);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await apiRequest<SubdomainCheckResult>(
          `/tenants/check-subdomain?subdomain=${encodeURIComponent(sub)}`
        );
        
        // Génération de suggestions si non disponible
        if (!res.available) {
          const suggestions = [
            `${sub}-shop`,
            `${sub}-boutique`,
            `${sub}-paris`,
            `${sub}-artisan`,
          ];
          setStatus({ ...res, suggestions });
        } else {
          setStatus(res);
        }
      } catch (err) {
        setStatus({
          available: false,
          reason: 'Impossible de contacter le serveur de validation.',
        });
      } finally {
        setChecking(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.subdomain]);

  const canProceed =
    formData.commerceName.trim().length >= 2 &&
    formData.subdomain.trim().length >= 3 &&
    status?.available === true &&
    !checking;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Étape 1 sur 4 • Identité & Adresse Web</span>
        </div>
        <p className="text-xs text-amber-800 font-medium">
          Choisissez le nom public de votre commerce et réservez instantanément votre adresse sur l&apos;infrastructure WoxxApp.
        </p>
      </div>

      <div className="space-y-4">
        {/* Nom du commerce */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase tracking-wider">
            1. Nom de votre commerce ou atelier *
          </label>
          <div className="relative">
            <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Ex: Boulangerie artisanale Louise, L'Atelier du Cuir..."
              value={formData.commerceName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm font-bold bg-slate-50 border-2 border-slate-900 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Sous-domaine */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              2. Adresse web (Sous-domaine réservé) *
            </label>
            {checking && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                Vérification en cours...
              </span>
            )}
          </div>

          <div className="flex items-center rounded-2xl border-2 border-slate-900 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-amber-400 focus-within:bg-white transition-all shadow-inner">
            <div className="pl-3.5 pr-2 text-slate-400 font-mono text-xs font-bold">https://</div>
            <input
              type="text"
              required
              placeholder="louise"
              value={formData.subdomain}
              onChange={(e) => handleSubdomainChange(e.target.value)}
              className="w-full py-3 text-sm font-mono font-black text-slate-900 bg-transparent focus:outline-none"
            />
            <div className="px-3 py-3 bg-slate-200/70 border-l-2 border-slate-900 text-slate-700 text-xs font-black font-mono select-none">
              .woxxapp.de
            </div>
          </div>

          {/* Feedback de disponibilité */}
          {status && (
            <div className="mt-2.5">
              {status.available ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs font-bold animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Super ! L&apos;adresse <strong>https://{formData.subdomain}.woxxapp.de</strong> est libre et réservée pour vous.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-bold animate-in fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{status.reason || 'Ce sous-domaine n\'est pas disponible.'}</span>
                  </div>
                  {status.suggestions && status.suggestions.length > 0 && (
                    <div>
                      <span className="text-[11px] text-slate-600 font-bold block mb-1.5">
                        💡 Suggestions disponibles :
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {status.suggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => {
                              updateFormData({ subdomain: sug });
                              setHasManuallyEditedSlug(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 hover:bg-amber-100 hover:border-amber-400 text-slate-900 font-mono text-[11px] font-bold transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Domaine personnalisé (optionnel) */}
        <div className="pt-2 border-t border-slate-200">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Nom de domaine personnalisé (Optionnel)
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ex: www.boulangerie-louise.fr"
              value={formData.customDomain}
              onChange={(e) => updateFormData({ customDomain: e.target.value })}
              className="w-full pl-10 pr-4 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Vous pourrez brancher votre propre nom de domaine .fr / .com à tout moment depuis vos réglages DNS.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-3 rounded-2xl border-2 border-slate-900 font-black text-sm flex items-center gap-2 transition-all shadow-brutal-xs ${
            canProceed
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Continuer vers le choix du thème</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
