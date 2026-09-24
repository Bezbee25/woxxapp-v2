'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Key,
  Download,
  Phone,
  MessageSquare,
  Calendar,
  ExternalLink,
  Sparkles,
  Mail,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';

interface AssignedSalesRep {
  id: string;
  email: string;
  fullName: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  whatsappNumber: string | null;
  calendlyUrl: string | null;
  bio: string | null;
}

export function ClientAccountTab() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [salesRep, setSalesRep] = useState<AssignedSalesRep | null>(null);

  useEffect(() => {
    const fetchSalesRep = async () => {
      try {
        const data = await apiRequest<{ salesRep: AssignedSalesRep | null }>('/account/sales-rep');
        if (data?.salesRep) {
          setSalesRep(data.salesRep);
        }
      } catch (err) {
        console.warn('Pas de conseiller assigné ou erreur:', err);
      }
    };
    fetchSalesRep();
  }, []);

  const handleExportGdpr = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/gdpr/export/my');
      if (!res.ok) throw new Error('Erreur lors du téléchargement');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-donnees-${user?.email || 'compte'}.json`;
      a.click();
    } catch (err: any) {
      alert(err.message || 'Erreur export RGPD');
    } finally {
      setDownloading(false);
    }
  };

  const cleanWhatsapp = salesRep?.whatsappNumber?.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-600" /> Mon Compte & Profil
        </h2>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Informations de votre compte commerçant et préférences de sécurité.
        </p>
      </div>

      {/* CONSEILLER COMMERCIAL DÉDIÉ (SI ASSIGNÉ) */}
      {salesRep && (
        <div className="bg-amber-50 border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-900 tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Votre Chargé d'Affaires Dédié</span>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-brutal-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-200 border-2 border-slate-900 shadow-brutal-xs overflow-hidden flex items-center justify-center shrink-0">
                {salesRep.avatarUrl ? (
                  <img
                    src={salesRep.avatarUrl}
                    alt={salesRep.fullName || 'Commercial'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-black text-slate-900">
                    {(salesRep.fullName || 'CA').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-black text-slate-950">
                  {salesRep.fullName || 'Conseiller Commercial'}
                </h4>
                <p className="text-xs text-purple-700 font-bold">
                  {salesRep.companyName || 'WoxxApp Partenaire'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">{salesRep.email}</p>
                {salesRep.bio && (
                  <p className="text-xs text-slate-600 italic mt-1 max-w-md">
                    "{salesRep.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* BOUTONS D'ÉCHANGE RAPIDE */}
            <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto shrink-0">
              {salesRep.phoneNumber && (
                <a
                  href={`tel:${salesRep.phoneNumber}`}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal-xs transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler</span>
                </a>
              )}

              {cleanWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal-xs transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              {salesRep.calendlyUrl && (
                <a
                  href={salesRep.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-brutal-xs transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Prendre RDV</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" /> Identité du Compte
          </h3>

          <div className="space-y-3 text-xs font-bold">
            <div>
              <span className="text-slate-500 font-extrabold uppercase text-[10px] block">
                Adresse Email
              </span>
              <p className="text-slate-950 mt-0.5">{user?.email}</p>
            </div>

            <div>
              <span className="text-slate-500 font-extrabold uppercase text-[10px] block">
                Nom complet ou Société
              </span>
              <p className="text-slate-950 mt-0.5">{user?.full_name || 'Non renseigné'}</p>
            </div>

            <div>
              <span className="text-slate-500 font-extrabold uppercase text-[10px] block">
                Type de compte
              </span>
              <span className="inline-flex mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-600" /> Vos Données & RGPD
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Conformément au RGPD, vous disposez d'un droit d'accès et de portabilité sur l'ensemble de vos données.
          </p>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleExportGdpr}
              disabled={downloading}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-black rounded-xl border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Génération du fichier...' : 'Exporter toutes mes données (JSON)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

