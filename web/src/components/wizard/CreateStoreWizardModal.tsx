'use client';

import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { WizardStep, WizardFormData } from './wizardTypes';
import { StepSubdomain } from './StepSubdomain';
import { StepTheme } from './StepTheme';
import { StepModules } from './StepModules';
import { StepRecap } from './StepRecap';
import { StepProvisioning } from './StepProvisioning';
import { apiRequest } from '@/lib/api';

interface CreateStoreWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM_DATA: WizardFormData = {
  commerceName: '',
  subdomain: '',
  customDomain: '',
  themeId: 'mode',
  selectedModules: ['ecommerce', 'accounting', 'woxxpay'],
  billingCycle: 'monthly',
};

export function CreateStoreWizardModal({ isOpen, onClose, onSuccess }: CreateStoreWizardModalProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provisionResult, setProvisionResult] = useState<any>(null);

  if (!isOpen) return null;

  const updateFormData = (updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleDeploy = async () => {
    setError(null);
    setLoading(true);

    try {
      // Déployer la boutique via l'API WoxxApp
      const res = await apiRequest<any>('/tenants', {
        method: 'POST',
        body: JSON.stringify({
          commerceName: formData.commerceName.trim(),
          subdomain: formData.subdomain.trim().toLowerCase(),
          customDomain: formData.customDomain.trim() || undefined,
          modules: formData.selectedModules,
          theme: formData.themeId,
          billingCycle: formData.billingCycle,
        }),
      });

      setProvisionResult(res);
      setStep(5); // Passer à l'écran de provisionnement animé
    } catch (err: any) {
      setError(err.message || 'Erreur lors du déploiement de la boutique.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
    // Réinitialiser pour la prochaine ouverture
    setStep(1);
    setFormData(INITIAL_FORM_DATA);
    setProvisionResult(null);
  };

  const stepLabels = [
    { num: 1, label: 'Adresse' },
    { num: 2, label: 'Thème & Démo' },
    { num: 3, label: 'Modules & Tarifs' },
    { num: 4, label: 'Récapitulatif' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop sombre flouté */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={step === 5 ? undefined : onClose}
      />

      <div className="relative w-full max-w-4xl bg-white border-2 border-slate-900 rounded-3xl shadow-brutal-lg p-5 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Bouton de fermeture */}
        {step !== 5 && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shadow-brutal-xs"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header & Fil d'Ariane des étapes */}
        {step <= 4 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-xl font-black">
                ✨
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950">
                  Créer et Lancer mon Site Woxx
                </h2>
                <p className="text-xs text-slate-500 font-bold">
                  Assistant interactif de configuration et de déploiement en 4 étapes.
                </p>
              </div>
            </div>

            {/* Barre de progression visuelle */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {stepLabels.map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;

                return (
                  <div key={s.num} className="space-y-1.5">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-amber-400 border border-slate-900 ring-2 ring-amber-300'
                          : isCompleted
                          ? 'bg-slate-900'
                          : 'bg-slate-200'
                      }`}
                    />
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ${
                          isActive
                            ? 'bg-amber-400 text-slate-950'
                            : isCompleted
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {s.num}
                      </span>
                      <span
                        className={`text-[11px] font-bold truncate ${
                          isActive ? 'text-slate-950 font-black' : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message d'erreur global */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-600 text-rose-800 text-xs font-bold mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Contenu de chaque étape */}
        {step === 1 && (
          <StepSubdomain
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepTheme
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepModules
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setStep(4)}
            onPrev={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepRecap
            formData={formData}
            onDeploy={handleDeploy}
            onPrev={() => setStep(3)}
            loading={loading}
          />
        )}

        {step === 5 && (
          <StepProvisioning
            formData={formData}
            onFinish={handleFinish}
            provisionResult={provisionResult}
          />
        )}
      </div>
    </div>
  );
}
