'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export function CompanyTaxTab() {
  const [taxType, setTaxType] = useState('MICRO_ENTERPRISE');
  const [vatRate, setVatRate] = useState('20.0');
  const [legalNotice, setLegalNotice] = useState('Franchise en base de TVA, art. 293 B du CGI');
  const [siret, setSiret] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [companyName, setCompanyName] = useState('WoxxApp');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    apiRequest<Record<string, string>>('/admin/settings')
      .then((settings) => {
        if (settings) {
          if (settings.company_tax_type) setTaxType(settings.company_tax_type);
          if (settings.company_vat_rate) setVatRate(settings.company_vat_rate);
          if (settings.company_legal_notice) setLegalNotice(settings.company_legal_notice);
          if (settings.company_siret) setSiret(settings.company_siret);
          if (settings.company_vat_number) setVatNumber(settings.company_vat_number);
          if (settings.company_name) setCompanyName(settings.company_name);
          if (settings.company_address) setCompanyAddress(settings.company_address);
          if (settings.company_email) setCompanyEmail(settings.company_email);
        }
      })
      .catch((err) => console.error('Erreur chargement settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleTaxTypeChange = (newType: string) => {
    setTaxType(newType);
    if (newType === 'MICRO_ENTERPRISE') {
      setLegalNotice('Franchise en base de TVA, art. 293 B du CGI');
    } else {
      setLegalNotice('TVA acquittée sur les débits / Régime général de TVA');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          company_tax_type: taxType,
          company_vat_rate: vatRate,
          company_legal_notice: legalNotice,
          company_siret: siret,
          company_vat_number: vatNumber,
          company_name: companyName,
          company_address: companyAddress,
          company_email: companyEmail,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur enregistrement fiscalité');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold">Chargement des paramètres fiscaux...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-brutal">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" /> Structure Fiscale & Facturation
        </h2>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Configurez votre régime fiscal (Micro-entreprise sans TVA ou Société assujettie) pour générer des factures conformes aux lois françaises.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Choix Régime Fiscal */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-4 shadow-brutal">
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">
            1. Régime Fiscal de l'Entreprise
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              onClick={() => handleTaxTypeChange('MICRO_ENTERPRISE')}
              className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition ${
                taxType === 'MICRO_ENTERPRISE'
                  ? 'bg-amber-50 border-slate-900 shadow-brutal-xs'
                  : 'bg-white border-slate-200 hover:border-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-slate-950">Micro-Entreprise / Auto-Entrepreneur</span>
                  <input
                    type="radio"
                    name="tax_type"
                    checked={taxType === 'MICRO_ENTERPRISE'}
                    onChange={() => {}}
                    className="accent-slate-900"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Franchise en base de TVA (Art. 293 B du CGI). Aucune TVA n'est facturée aux clients.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-mono font-bold text-slate-900 bg-amber-200 p-2.5 rounded-xl border border-slate-900">
                Mention légale : "Franchise en base de TVA, art. 293 B du CGI"
              </div>
            </label>

            <label
              onClick={() => handleTaxTypeChange('SAS_SARL_WITH_VAT')}
              className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition ${
                taxType === 'SAS_SARL_WITH_VAT'
                  ? 'bg-blue-50 border-slate-900 shadow-brutal-xs'
                  : 'bg-white border-slate-200 hover:border-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-slate-950">Société avec TVA (SAS, SARL, SASU...)</span>
                  <input
                    type="radio"
                    name="tax_type"
                    checked={taxType === 'SAS_SARL_WITH_VAT'}
                    onChange={() => {}}
                    className="accent-slate-900"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Assujetti à la TVA française (taux normal de 20%). Les montants HT, TVA et TTC sont dissociés.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-mono font-bold text-blue-900 bg-blue-100 p-2.5 rounded-xl border border-blue-300">
                TVA standard 20.0% appliquée
              </div>
            </label>
          </div>

          {taxType === 'SAS_SARL_WITH_VAT' && (
            <div className="pt-2">
              <label className="block text-xs font-black text-slate-900 mb-1">Taux de TVA (%)</label>
              <input
                type="number"
                step="0.1"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                className="w-48 px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">
              Mention Légale Imposée sur Factures
            </label>
            <input
              type="text"
              value={legalNotice}
              onChange={(e) => setLegalNotice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Coordonnées de l'Entreprise */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-4 shadow-brutal">
          <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider">
            2. Coordonnées Officielles de l'Émetteur
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">Raison Sociale / Nom</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">Numéro SIRET</label>
              <input
                type="text"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                placeholder="123 456 789 00012"
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">N° TVA Intracommunautaire</label>
              <input
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="FR12345678900"
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">Email de Contact Facturation</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="facturation@woxxapp.de"
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-900 mb-1">Adresse Complète du Siège</label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="10 Rue de la Paix, 75001 Paris, France"
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-brutal">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Les modifications s'appliqueront immédiatement à toutes les nouvelles factures.</span>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 font-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Paramètres enregistrés !
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 shadow-brutal-xs transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer la Configuration'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
