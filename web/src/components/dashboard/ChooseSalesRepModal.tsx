'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  User,
  Phone,
  MessageSquare,
  Building,
  RefreshCw,
  ExternalLink,
  Shield,
  Calendar,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface AvailableSalesRep {
  id: string;
  email: string;
  fullName: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  whatsappNumber: string | null;
  calendlyUrl: string | null;
  bio: string | null;
  role: string;
}

interface ChooseSalesRepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (salesRep: AvailableSalesRep) => void;
  currentSalesRepId?: string | null;
}

export function ChooseSalesRepModal({
  isOpen,
  onClose,
  onSuccess,
  currentSalesRepId,
}: ChooseSalesRepModalProps) {
  const [salesReps, setSalesReps] = useState<AvailableSalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSalesReps();
    }
  }, [isOpen]);

  const fetchSalesReps = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<AvailableSalesRep[]>('/sales-rep/available');
      setSalesReps(data || []);
    } catch (err: any) {
      console.error('Erreur chargement conseillers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = async (salesRep: AvailableSalesRep) => {
    setSelectingId(salesRep.id);
    try {
      const res = await apiRequest<any>('/account/sales-rep/choose', {
        method: 'POST',
        body: JSON.stringify({ salesRepId: salesRep.id }),
      });
      alert(res.message || `Vous êtes désormais accompagné par ${salesRep.fullName || salesRep.email}`);
      onSuccess(salesRep);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du choix du conseiller');
    } finally {
      setSelectingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white border-2 border-slate-900 rounded-3xl shadow-brutal-lg p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shadow-brutal-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-brutal-xs flex items-center justify-center text-2xl font-black">
            🤝
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Choisissez votre Conseiller Dédié</h2>
            <p className="text-xs text-slate-500 font-bold">
              Un interlocuteur privilégié pour concevoir vos devis, intégrer vos boutiques et vous accompagner.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
            <p className="text-xs font-black text-slate-700">Recherche des conseillers disponibles...</p>
          </div>
        ) : salesReps.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border-2 border-slate-900 rounded-2xl">
            <p className="text-xs font-bold text-slate-700">
              Aucun chargé d'affaires n'est actuellement disponible. L'équipe support WoxxApp reste à votre disposition.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {salesReps.map((rep) => {
              const isSelected = rep.id === currentSalesRepId;
              const isProcessing = selectingId === rep.id;

              return (
                <div
                  key={rep.id}
                  className={`p-5 rounded-2xl border-2 transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50 border-amber-900 shadow-brutal-xs ring-2 ring-amber-400'
                      : 'bg-white border-slate-900 hover:bg-slate-50 shadow-brutal-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-slate-900 shadow-brutal-xs overflow-hidden flex items-center justify-center shrink-0">
                        {rep.avatarUrl ? (
                          <img src={rep.avatarUrl} alt={rep.fullName || 'CA'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-black text-slate-900">
                            {(rep.fullName || 'CA').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-slate-950 truncate">
                            {rep.fullName || 'Conseiller Commercial'}
                          </h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 rounded-full text-[9px] font-black uppercase">
                              Actuel
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-700 font-bold truncate">
                          {rep.companyName || 'WoxxApp Partenaire'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{rep.email}</p>
                      </div>
                    </div>

                    {rep.bio && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200 line-clamp-2">
                        "{rep.bio}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-500 pt-1">
                      {rep.phoneNumber && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded-md border border-blue-200 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" /> Direct
                        </span>
                      )}
                      {rep.whatsappNumber && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded-md border border-emerald-200 flex items-center gap-1">
                          <MessageSquare className="w-2.5 h-2.5" /> WhatsApp
                        </span>
                      )}
                      {rep.calendlyUrl && (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-900 rounded-md border border-purple-200 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" /> RDV Visio
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isSelected || isProcessing}
                      onClick={() => handleChoose(rep)}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs border-2 border-slate-900 transition flex items-center justify-center gap-2 cursor-pointer shadow-brutal-xs ${
                        isSelected
                          ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      }`}
                    >
                      {isProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : isSelected ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Votre conseiller actuel</span>
                        </>
                      ) : (
                        <span>Choisir ce conseiller</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
