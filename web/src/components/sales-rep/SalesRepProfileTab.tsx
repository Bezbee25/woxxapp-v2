'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Image as ImageIcon,
  Building2,
  Phone,
  MessageSquare,
  Calendar,
  Save,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Upload,
  CheckCircle2,
  Receipt,
  Mail,
  MapPin,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface SalesRepProfile {
  id: string;
  email: string;
  fullName: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  whatsappNumber: string | null;
  calendlyUrl: string | null;
  bio: string | null;
  taxType: 'MICRO_ENTERPRISE' | 'SAS_SARL_WITH_VAT';
  vatRate: string;
  legalNotice: string;
  siret: string;
  vatNumber: string;
  companyAddress: string;
  companyEmail: string;
}

export function SalesRepProfileTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState<SalesRepProfile>({
    id: '',
    email: '',
    fullName: '',
    companyName: '',
    avatarUrl: '',
    phoneNumber: '',
    whatsappNumber: '',
    calendlyUrl: '',
    bio: '',
    taxType: 'MICRO_ENTERPRISE',
    vatRate: '20.0',
    legalNotice: 'Franchise en base de TVA, art. 293 B du CGI',
    siret: '',
    vatNumber: '',
    companyAddress: '',
    companyEmail: '',
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<SalesRepProfile>('/sales-rep/profile');
      if (data) {
        setForm({
          id: data.id || '',
          email: data.email || '',
          fullName: data.fullName || '',
          companyName: data.companyName || '',
          avatarUrl: data.avatarUrl || '',
          phoneNumber: data.phoneNumber || '',
          whatsappNumber: data.whatsappNumber || '',
          calendlyUrl: data.calendlyUrl || '',
          bio: data.bio || '',
          taxType: data.taxType || 'MICRO_ENTERPRISE',
          vatRate: data.vatRate || '20.0',
          legalNotice: data.legalNotice || (data.taxType === 'SAS_SARL_WITH_VAT' ? 'TVA acquittée sur les débits' : 'Franchise en base de TVA, art. 293 B du CGI'),
          siret: data.siret || '',
          vatNumber: data.vatNumber || '',
          companyAddress: data.companyAddress || '',
          companyEmail: data.companyEmail || data.email || '',
        });
      }
    } catch (err: any) {
      console.error('Erreur chargement profil commercial:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleTaxTypeChange = (newType: 'MICRO_ENTERPRISE' | 'SAS_SARL_WITH_VAT') => {
    setForm((prev) => ({
      ...prev,
      taxType: newType,
      legalNotice:
        newType === 'MICRO_ENTERPRISE'
          ? 'Franchise en base de TVA, art. 293 B du CGI'
          : 'TVA acquittée sur les débits / Régime général de TVA',
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('L’image est trop volumineuse (maximum 2 Mo).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    try {
      const res = await apiRequest<any>('/sales-rep/profile', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setSuccessMessage(res.message || 'Profil et fiscalité enregistrés avec succès !');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-12 text-center shadow-brutal">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
        <p className="text-xs font-black text-slate-700">Chargement de votre profil commercial...</p>
      </div>
    );
  }

  const cleanWhatsapp = form.whatsappNumber?.replace(/[^0-9]/g, '');
  const isMicro = form.taxType === 'MICRO_ENTERPRISE';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* BANNIÈRE D'EN-TÊTE */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-purple-600" /> Entreprise, Fiscalité & Identité Commerciale
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Configurez vos informations légales, votre régime de TVA (Micro sans TVA ou Société avec TVA) et vos coordonnées de devis.
          </p>
        </div>

        {successMessage && (
          <div className="px-4 py-2 bg-emerald-50 border-2 border-emerald-900 rounded-xl text-xs font-black text-emerald-900 flex items-center gap-2 shadow-brutal-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* COLONNE GAUCHE & MILIEU : FORMULAIRE COMPLET */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* SECTION 1 : RÉGIME FISCAL & TVA */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-600" /> 1. Régime Fiscal & TVA de votre Activité
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Ce paramétrage détermine si vos devis et factures appliquent la TVA ou la franchise en base (CGI 293 B).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                onClick={() => handleTaxTypeChange('MICRO_ENTERPRISE')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition ${
                  isMicro
                    ? 'bg-amber-50 border-slate-900 shadow-brutal-xs'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-xs text-slate-950">Micro-Entreprise / Auto-Entrepreneur</span>
                    <input
                      type="radio"
                      name="tax_type"
                      checked={isMicro}
                      onChange={() => {}}
                      className="accent-slate-900"
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Franchise en base de TVA (Art. 293 B du CGI). Aucune TVA facturée à vos clients.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono font-bold text-slate-900 bg-amber-200 p-2 rounded-lg border border-slate-900">
                  TVA 0% • Mention légale CGI 293 B
                </div>
              </label>

              <label
                onClick={() => handleTaxTypeChange('SAS_SARL_WITH_VAT')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition ${
                  !isMicro
                    ? 'bg-blue-50 border-slate-900 shadow-brutal-xs'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-xs text-slate-950">Société avec TVA (SAS, SARL, SASU...)</span>
                    <input
                      type="radio"
                      name="tax_type"
                      checked={!isMicro}
                      onChange={() => {}}
                      className="accent-slate-900"
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Assujetti à la TVA. Les montants HT, TVA et TTC sont ventilés sur vos devis.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono font-bold text-blue-900 bg-blue-100 p-2 rounded-lg border border-blue-300">
                  TVA applicable (20.0% standard)
                </div>
              </label>
            </div>

            {!isMicro && (
              <div className="pt-2">
                <label className="block text-xs font-black text-slate-900 mb-1">Taux de TVA (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.vatRate}
                  onChange={(e) => setForm({ ...form, vatRate: e.target.value })}
                  className="w-40 px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Mention Légale Imposée sur Devis & Factures
              </label>
              <input
                type="text"
                value={form.legalNotice}
                onChange={(e) => setForm({ ...form, legalNotice: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* SECTION 2 : COORDONNÉES OFFICIELLES DE L'ENTREPRISE */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> 2. Coordonnées Officielles de l'Émetteur
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Raison Sociale / Nom d'Agence *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Studio Digital Ouest"
                  value={form.companyName || ''}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Numéro SIRET
                </label>
                <input
                  type="text"
                  placeholder="123 456 789 00012"
                  value={form.siret}
                  onChange={(e) => setForm({ ...form, siret: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  N° TVA Intracommunautaire
                </label>
                <input
                  type="text"
                  placeholder="FR12345678900"
                  value={form.vatNumber}
                  onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Email de Facturation / Contact
                </label>
                <input
                  type="email"
                  placeholder="contact@mon-agence.fr"
                  value={form.companyEmail}
                  onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Adresse Complète du Siège
                </label>
                <input
                  type="text"
                  placeholder="10 Rue de la République, 69002 Lyon"
                  value={form.companyAddress}
                  onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3 : IDENTITÉ COMMERCIALE & CANAUX DIRECTS */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600" /> 3. Identité Commerciale & Contact Client
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4 pb-2 border-b border-slate-100">
              <div className="w-20 h-20 rounded-2xl bg-amber-100 border-2 border-slate-900 shadow-brutal-xs overflow-hidden flex items-center justify-center shrink-0">
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-2xl font-black text-amber-900">
                    {(form.fullName || form.email || 'CA').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 w-full">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Logo / Photo du Conseiller
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-950 border-2 border-slate-900 rounded-xl text-xs font-black shadow-brutal-xs flex items-center gap-1.5 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choisir image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {form.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, avatarUrl: '' })}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-slate-900 rounded-xl text-xs font-bold transition"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Nom Complet du Conseiller
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  value={form.fullName || ''}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Téléphone Direct
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={form.phoneNumber || ''}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition pl-9"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  WhatsApp Commercial
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="+33612345678"
                    value={form.whatsappNumber || ''}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition pl-9"
                  />
                  <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Lien de Prise de RDV (Calendly / Meet)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://calendly.com/mon-agence"
                    value={form.calendlyUrl || ''}
                    onChange={(e) => setForm({ ...form, calendlyUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition pl-9"
                  />
                  <Calendar className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                  Message d'Accueil / Bio pour vos Clients
                </label>
                <textarea
                  rows={2}
                  placeholder="Conseiller e-commerce dédié à la réussite de votre boutique Woxx. Accompagnement sur-mesure."
                  value={form.bio || ''}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-medium text-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-slate-900 rounded-2xl font-black text-xs shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Enregistrement...' : 'Enregistrer mon Entreprise & Fiscalité'}</span>
            </button>
          </div>
        </form>

        {/* COLONNE DROITE : APERÇU EN DIRECT DU DEVIS CLIENT */}
        <div className="space-y-4">
          <div className="bg-amber-50 border-2 border-slate-900 rounded-3xl p-6 shadow-brutal space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-900 tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Aperçu En-Tête Devis Client</span>
            </div>

            {/* CARTE VIRTUELLE CLIENT */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-brutal-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-slate-900 shadow-brutal-xs overflow-hidden flex items-center justify-center shrink-0">
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-black text-slate-900">
                      {(form.fullName || 'CA').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-slate-950 truncate">
                    {form.fullName || 'Conseiller Commercial'}
                  </h4>
                  <p className="text-[11px] text-purple-700 font-bold truncate">
                    {form.companyName || 'Mon Agence Commerciale'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{form.companyEmail || form.email}</p>
                </div>
              </div>

              {/* MENTIONS FISCALES DEVIS */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] space-y-1 text-slate-700">
                <div className="font-bold flex items-center justify-between">
                  <span>SIRET :</span>
                  <span className="font-mono text-slate-950">{form.siret || 'Non renseigné'}</span>
                </div>
                {!isMicro && form.vatNumber && (
                  <div className="font-bold flex items-center justify-between">
                    <span>N° TVA :</span>
                    <span className="font-mono text-slate-950">{form.vatNumber}</span>
                  </div>
                )}
                {form.companyAddress && (
                  <div className="truncate text-slate-500 font-medium">
                    📍 {form.companyAddress}
                  </div>
                )}
                <div className="pt-1 text-[9px] font-mono font-bold text-amber-900 border-t border-slate-200">
                  {isMicro ? 'TVA 0% (Franchise CGI 293 B)' : `TVA appliquée (${form.vatRate}%)`}
                </div>
              </div>

              {/* CANAUX DIRECTS */}
              <div className="space-y-1.5 pt-1">
                {form.phoneNumber && (
                  <div className="text-[11px] font-bold text-blue-900 bg-blue-50 p-2 rounded-lg border border-blue-200 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{form.phoneNumber}</span>
                  </div>
                )}
                {cleanWhatsapp && (
                  <div className="text-[11px] font-bold text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Activé</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

