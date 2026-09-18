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
    return <div className="p-8 text-slate-400">Chargement des paramètres fiscaux...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0D121F] p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cyan-400" /> Structure Fiscale & Facturation
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configurez votre régime fiscal (Micro-entreprise sans TVA ou Société assujettie) pour générer des factures conformes aux lois françaises.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Choix Régime Fiscal */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm uppercase font-bold text-cyan-400 tracking-wider">
            1. Régime Fiscal de l'Entreprise
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              onClick={() => handleTaxTypeChange('MICRO_ENTERPRISE')}
              className={`p-5 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                taxType === 'MICRO_ENTERPRISE'
                  ? 'bg-cyan-500/10 border-cyan-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">Micro-Entreprise / Auto-Entrepreneur</span>
                  <input
                    type="radio"
                    name="tax_type"
                    checked={taxType === 'MICRO_ENTERPRISE'}
                    onChange={() => {}}
                    className="accent-cyan-400"
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Franchise en base de TVA (Art. 293 B du Code Général des Impôts). Aucune TVA n'est facturée aux clients.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 p-2 rounded-lg">
                Mention auto : "Franchise en base de TVA, art. 293 B du CGI"
              </div>
            </label>

            <label
              onClick={() => handleTaxTypeChange('SAS_SARL_WITH_VAT')}
              className={`p-5 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                taxType === 'SAS_SARL_WITH_VAT'
                  ? 'bg-cyan-500/10 border-cyan-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">Société avec TVA (SAS, SARL, SASU...)</span>
                  <input
                    type="radio"
                    name="tax_type"
                    checked={taxType === 'SAS_SARL_WITH_VAT'}
                    onChange={() => {}}
                    className="accent-cyan-400"
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assujetti à la TVA française (taux normal de 20%). Le montant HT, TVA et TTC apparaissent séparément sur les factures.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 p-2 rounded-lg">
                TVA standard 20.0% appliquée
              </div>
            </label>
          </div>

          {taxType === 'SAS_SARL_WITH_VAT' && (
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Taux de TVA (%)</label>
              <input
                type="number"
                step="0.1"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                className="w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Mention Légale Imposée sur Factures
            </label>
            <input
              type="text"
              value={legalNotice}
              onChange={(e) => setLegalNotice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Coordonnées de l'Entreprise */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm uppercase font-bold text-cyan-400 tracking-wider">
            2. Coordonnées Officielles de l'Émetteur
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Raison Sociale / Nom</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Numéro SIRET</label>
              <input
                type="text"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                placeholder="123 456 789 00012"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">N° TVA Intracommunautaire</label>
              <input
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="FR12345678900 (si applicable)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email de Contact Facturation</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="facturation@woxxapp.de"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Adresse Complète du Siège</label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="10 Rue de la Paix, 75001 Paris, France"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between bg-[#0D121F] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Les modifications s'appliqueront immédiatement à toutes les nouvelles factures.</span>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Paramètres enregistrés !
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer la Configuration'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
