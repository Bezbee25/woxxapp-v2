'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export interface InvoiceDetails {
  id: string;
  invoiceNumber: string;
  totalHt: number;
  totalVat: number;
  totalTtc: number;
  vatRate?: number;
  isVatExempt?: boolean;
  legalNotice?: string;
  status: string;
  pdfUrl?: string;
  createdAt: string;
  user?: {
    id?: string;
    email: string;
    fullName?: string;
    companyName?: string;
    phoneNumber?: string;
  };
}

interface OfficialInvoiceModalProps {
  isOpen: boolean;
  invoice: InvoiceDetails | null;
  onClose: () => void;
}

export function OfficialInvoiceModal({
  isOpen,
  invoice,
  onClose,
}: OfficialInvoiceModalProps) {
  const [companySettings, setCompanySettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      apiRequest<Record<string, string>>('/admin/settings')
        .then((res) => {
          if (res) setCompanySettings(res);
        })
        .catch(() => {
          // Fallback par défaut si non-admin
          setCompanySettings({
            company_name: 'WoxxApp SAS',
            company_siret: '123 456 789 00012',
            company_vat_number: 'FR12345678900',
            company_address: '10 Rue de la Paix, 75001 Paris, France',
            company_email: 'contact@woxxapp.de',
            company_legal_notice: 'Franchise en base de TVA, art. 293 B du CGI',
            company_tax_type: 'MICRO_ENTERPRISE',
          });
        });
    }
  }, [isOpen]);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.open(`/api/invoices/${invoice.id}`, '_blank');
  };

  const isMicro = invoice.isVatExempt ?? (companySettings.company_tax_type === 'MICRO_ENTERPRISE' || !invoice.totalVat);
  const legalNotice = invoice.legalNotice || companySettings.company_legal_notice || (isMicro ? 'Franchise en base de TVA, art. 293 B du CGI' : 'TVA acquittée sur les débits');

  const invoiceDate = new Date(invoice.createdAt);
  const periodEnd = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-brutal w-full max-w-4xl p-6 sm:p-10 space-y-8 my-auto">
        {/* BARRE D'ACTIONS */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-slate-900 text-amber-300 rounded-xl font-mono text-xs font-black">
              FACTURE OFFICIELLE
            </span>
            <span className="font-mono text-xs font-bold text-slate-600">{invoice.invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black border-2 border-slate-900 shadow-brutal-xs hover:shadow-brutal transition flex items-center gap-1.5 cursor-pointer"
              title="Ouvrir la facture PDF propre dans un nouvel onglet"
            >
              <Download className="w-4 h-4" />
              <span>Ouvrir PDF / Imprimer 🖨️</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENU OFFICIEL DE LA FACTURE A4 */}
        <div className="space-y-8 text-slate-900 font-sans">
          {/* EN-TÊTE ÉMETTEUR & TITRE FACTURE */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6">
            <div className="space-y-1">
              <div className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                {companySettings.company_name || 'WoxxApp SAS'}
              </div>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                {companySettings.company_address || '10 Rue de la Paix, 75001 Paris, France'}
              </p>
              <div className="text-[11px] text-slate-600 font-mono space-y-0.5 pt-1">
                <div>
                  <span className="font-bold">SIRET :</span> {companySettings.company_siret || '123 456 789 00012'}
                </div>
                {companySettings.company_vat_number && (
                  <div>
                    <span className="font-bold">N° TVA :</span> {companySettings.company_vat_number}
                  </div>
                )}
                <div>
                  <span className="font-bold">Email :</span> {companySettings.company_email || 'facturation@woxxapp.de'}
                </div>
              </div>
            </div>

            <div className="text-right sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black rounded-lg uppercase tracking-wider mb-2">
                Facture Acquittée ✅
              </div>
              <div className="text-xl font-black text-slate-950 font-mono">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-bold">Date d'émission :</span>{' '}
                {invoiceDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-bold">Date de règlement :</span>{' '}
                {invoiceDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-bold">Mode de paiement :</span> Carte Bancaire (Stripe)
              </div>
            </div>
          </div>

          {/* BLOC DESTINATAIRE / CLIENT */}
          <div className="grid sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Facturé à (Client)
              </span>
              <div className="text-sm font-black text-slate-950">
                {invoice.user?.companyName || invoice.user?.fullName || 'Client Professionnel'}
              </div>
              <div className="text-xs text-slate-600 font-mono">{invoice.user?.email}</div>
              {invoice.user?.phoneNumber && (
                <div className="text-xs text-slate-600">{invoice.user.phoneNumber}</div>
              )}
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Période de Prestation
              </span>
              <div className="text-xs font-bold text-slate-900">
                Abonnement Logiciel SaaS & Modules
              </div>
              <div className="text-xs text-slate-600 font-mono">
                Du {invoiceDate.toLocaleDateString('fr-FR')} au {periodEnd.toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>

          {/* TABLEAU DES PRESTATIONS */}
          <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900 text-white uppercase font-black text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Désignation de la Prestation</th>
                  <th className="px-5 py-3.5 text-center">Qté</th>
                  <th className="px-5 py-3.5 text-right">Prix Unitaire HT</th>
                  <th className="px-5 py-3.5 text-center">Taux TVA</th>
                  <th className="px-5 py-3.5 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                <tr>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-950 text-sm">
                      Abonnement Forfait Modules SaaS WoxxApp
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Accès plateforme, hébergement Kubernetes haute disponibilité, infrastructure sécurisée et modules applicatifs activés.
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-mono font-bold">1</td>
                  <td className="px-5 py-4 text-right font-mono font-bold">{invoice.totalHt.toFixed(2)} €</td>
                  <td className="px-5 py-4 text-center font-mono">
                    {isMicro ? '0.00 % (Exo)' : `${invoice.vatRate || 20.0}%`}
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-black">{invoice.totalHt.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTAL & SYNTHÈSE COMPTABLE */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
            {/* Mention Fiscale Légale Encadrée */}
            <div className="flex-1 space-y-2">
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-slate-900 text-xs font-bold text-slate-900 space-y-1">
                <span className="font-black block uppercase text-[10px] text-slate-500 tracking-wider">
                  Régime Fiscal & Mentions Légales
                </span>
                <p className="font-mono text-xs font-black text-slate-950">{legalNotice}</p>
                <p className="text-[10px] text-slate-600 font-normal">
                  Règlement intégral reçu. Aucun escompte pour paiement anticipé.
                </p>
              </div>

              <p className="text-[10px] text-slate-500 leading-snug">
                En cas de retard de paiement, indemnité forfaitaire légale pour frais de recouvrement de 40 € (Code de commerce, art. D. 441-5).
              </p>
            </div>

            {/* Total Chiffré */}
            <div className="w-full sm:w-72 bg-slate-900 text-white p-5 rounded-2xl space-y-2.5 font-mono">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Total Net HT :</span>
                <span>{invoice.totalHt.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>TVA ({isMicro ? '0.00%' : `${invoice.vatRate || 20}%`}) :</span>
                <span>{invoice.totalVat.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-base font-black text-amber-300 pt-2.5 border-t border-slate-700">
                <span>TOTAL {isMicro ? 'NET À PAYER' : 'TTC'} :</span>
                <span>{invoice.totalTtc.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* PIED DE PAGE LÉGAL */}
          <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-1">
            <p>
              <span className="font-bold">{companySettings.company_name || 'WoxxApp SAS'}</span> — SIRET : {companySettings.company_siret || '123 456 789 00012'} — Siège social : {companySettings.company_address || '10 Rue de la Paix, 75001 Paris'}
            </p>
            <p>Document généré électroniquement et certifié conforme aux normes fiscales françaises.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
