'use client';

import React, { useState, useEffect } from 'react';
import { Check, CheckCircle2, Globe, KeyRound, ArrowRight, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { WizardFormData } from './wizardTypes';

interface StepProvisioningProps {
  formData: WizardFormData;
  onFinish: () => void;
  provisionResult?: any;
}

export function StepProvisioning({ formData, onFinish, provisionResult }: StepProvisioningProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { title: 'Création du Namespace Kubernetes isolé', detail: `tenant-${formData.subdomain}` },
    { title: 'Attribution du stockage persistant (PVC)', detail: 'Volume SQLite & Médias montés' },
    { title: 'Configuration du thème & Activation des modules', detail: `${formData.selectedModules.length + 1} modules initialisés` },
    { title: 'Configuration de l\'Ingress NGINX & SSL', detail: `${formData.subdomain}.woxxapp.de` },
    { title: 'Boutique en ligne & Opérationnelle !', detail: 'Prête à accueillir vos clients' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [steps.length]);

  const isDone = currentStepIndex === steps.length - 1;
  const storeUrl = `https://${formData.subdomain}.woxxapp.de`;
  const localStoreUrl = `http://${formData.subdomain}.127.0.0.1.nip.io`;

  return (
    <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 border-2 border-slate-900 shadow-brutal flex items-center justify-center text-3xl">
        {isDone ? '🎉' : '🚀'}
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-950">
          {isDone ? 'Félicitations ! Votre boutique est déployée' : 'Déploiement de votre boutique sur Kubernetes'}
        </h2>
        <p className="text-xs text-slate-500 font-bold mt-1">
          {isDone
            ? 'Votre site est maintenant en ligne, sécurisé avec certificat SSL et prêt pour la vente.'
            : 'Veuillez patienter quelques secondes pendant la configuration des conteneurs et du routage.'}
        </p>
      </div>

      {/* Progression des étapes */}
      <div className="max-w-md mx-auto space-y-3 text-left">
        {steps.map((step, idx) => {
          const isFinished = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex && !isDone;

          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${
                isFinished
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
                  : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black ${
                    isFinished
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {isFinished ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-xs">{step.title}</h4>
                  <span className="text-[10px] font-mono opacity-75">{step.detail}</span>
                </div>
              </div>

              {isCurrent && (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Boutons d'action une fois terminé */}
      {isDone && (
        <div className="pt-4 space-y-3 max-w-md mx-auto animate-in zoom-in-95 duration-300">
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 font-black text-sm text-slate-950 flex items-center justify-center gap-2 transition-all shadow-brutal hover:-translate-y-0.5 active:translate-y-0"
          >
            <Globe className="w-4 h-4" />
            <span>Visiter ma boutique en direct</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>

          <button
            type="button"
            onClick={onFinish}
            className="w-full py-3 px-6 rounded-2xl border-2 border-slate-900 bg-white hover:bg-slate-100 font-bold text-xs text-slate-800 flex items-center justify-center gap-2 transition-all shadow-brutal-xs"
          >
            <span>Revenir au tableau de bord</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
