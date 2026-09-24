export interface InvoiceSellerInfo {
  companyName: string;
  legalForm?: string;
  capital?: string;
  siren?: string;
  siret?: string;
  rcsCity?: string;
  nafCode?: string;
  vatNumber?: string;
  address?: string;
  zip?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  isAutoEntrepreneur?: boolean;
  legalNotice?: string;
}

export interface InvoiceBuyerInfo {
  fullName?: string;
  companyName?: string;
  email: string;
  phoneNumber?: string;
  vatNumber?: string;
  address?: string;
}

export interface InvoiceItemInfo {
  description: string;
  quantity: number;
  unitPriceHt: number;
  totalHt: number;
  vatRate: number;
}

export interface OfficialInvoiceDocument {
  id: string;
  invoiceNumber: string;
  createdAt: Date | string;
  status: string;
  totalHt: number;
  totalVat: number;
  totalTtc: number;
  vatRate: number;
  isVatExempt: boolean;
  legalNotice?: string;
  seller: InvoiceSellerInfo;
  buyer: InvoiceBuyerInfo;
  items: InvoiceItemInfo[];
}

function escapeHtml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateOfficialInvoiceHtml(doc: OfficialInvoiceDocument): string {
  const isAuto = doc.isVatExempt || doc.seller.isAutoEntrepreneur;
  const issueDate = new Date(doc.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${escapeHtml(doc.invoiceNumber)} - ${escapeHtml(doc.seller.companyName)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 30px;
      color: #0f172a;
      background: #f8fafc;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
    }
    .invoice-sheet {
      background: #ffffff;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
    }
    .btn-print {
      background: #fbbf24;
      color: #0f172a;
      border: none;
      padding: 8px 16px;
      font-weight: 800;
      font-size: 12px;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-print:hover {
      background: #f59e0b;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .company-title {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-meta {
      text-align: right;
    }
    .doc-number {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      font-family: monospace;
    }
    .badge-paid {
      display: inline-block;
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin-bottom: 25px;
    }
    .box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      font-size: 12px;
    }
    .box-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
    }
    .notice-box {
      background: #fefce8;
      border: 1px solid #fef08a;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #854d0e;
      margin-bottom: 25px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 25px;
    }
    .totals-table {
      width: 320px;
    }
    .totals-table tr td {
      padding: 6px 12px;
    }
    .grand-total {
      background: #0f172a;
      color: #fbbf24;
      font-weight: 900;
      font-size: 16px;
      border-radius: 6px;
    }
    .legal-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 20px;
      font-size: 10px;
      color: #64748b;
      text-align: center;
      line-height: 1.6;
    }
    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }
      .no-print-bar {
        display: none !important;
      }
      .invoice-sheet {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>

  <div class="no-print-bar">
    <div style="font-weight: 800; font-size: 13px;">
      📄 Facture Officielle Pro — Document certifié conforme
    </div>
    <div>
      <button class="btn-print" onclick="window.print()">
        🖨️ Imprimer / Télécharger en PDF
      </button>
    </div>
  </div>

  <div class="invoice-sheet">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="company-title">${escapeHtml(doc.seller.companyName)}</div>
        <div style="color: #64748b; font-size: 12px;">${escapeHtml(doc.seller.legalForm || 'Société')}${doc.seller.capital ? ` au capital de ${escapeHtml(doc.seller.capital)}` : ''}</div>
        <div style="margin-top: 6px; color: #334155; font-size: 12px;">
          ${escapeHtml(doc.seller.address || '')}<br>
          ${escapeHtml(doc.seller.zip || '')} ${escapeHtml(doc.seller.city || '')} (${escapeHtml(doc.seller.country || 'France')})<br>
          Email : ${escapeHtml(doc.seller.email || '')} ${doc.seller.phone ? `• Tél : ${escapeHtml(doc.seller.phone)}` : ''}
        </div>
      </div>
      <div class="doc-meta">
        <div class="doc-number">FACTURE N° ${escapeHtml(doc.invoiceNumber)}</div>
        <div style="margin-top: 4px; color: #64748b;">Date d'émission : <strong>${escapeHtml(issueDate)}</strong></div>
        <div style="color: #64748b;">Règlement : <strong>Carte Bancaire (Stripe)</strong></div>
        <div>
          <span class="badge-paid">ACQUITTÉE ✅</span>
        </div>
      </div>
    </div>

    ${isAuto ? `
    <div class="notice-box">
      ℹ️ <strong>Régime fiscal :</strong> ${escapeHtml(doc.seller.companyName)} bénéficie de la franchise en base de TVA. <em>TVA non applicable, art. 293 B du CGI.</em>
    </div>` : ''}

    <!-- Informations Vendeur & Acheteur -->
    <div class="grid-2">
      <div class="box">
        <div class="box-title">Émetteur / Prestataire</div>
        <strong>${escapeHtml(doc.seller.companyName)}</strong><br>
        SIRET : ${escapeHtml(doc.seller.siret || '—')}<br>
        RCS : ${escapeHtml(doc.seller.rcsCity || 'Paris')} ${doc.seller.nafCode ? `• APE : ${escapeHtml(doc.seller.nafCode)}` : ''}<br>
        ${!isAuto && doc.seller.vatNumber ? `N° TVA Intracommunautaire : <strong>${escapeHtml(doc.seller.vatNumber)}</strong>` : ''}
      </div>
      <div class="box">
        <div class="box-title">Facturé à / Client</div>
        <strong>${escapeHtml(doc.buyer.fullName || doc.buyer.companyName || 'Client WoxxApp')}</strong>
        ${doc.buyer.companyName ? `<br>Société : <strong>${escapeHtml(doc.buyer.companyName)}</strong>` : ''}
        ${doc.buyer.vatNumber ? `<br>N° TVA Client : <strong>${escapeHtml(doc.buyer.vatNumber)}</strong>` : ''}
        <br>Email : ${escapeHtml(doc.buyer.email || '')}
        ${doc.buyer.phoneNumber ? `<br>Tél : ${escapeHtml(doc.buyer.phoneNumber)}` : ''}
        ${doc.buyer.address ? `<br>${escapeHtml(doc.buyer.address)}` : ''}
      </div>
    </div>

    <!-- Tableau des Prestations -->
    <table>
      <thead>
        <tr>
          <th style="width: 55%;">Désignation des Prestations & Modules SaaS</th>
          <th class="text-center" style="width: 15%;">Qté</th>
          <th class="text-right" style="width: 15%;">${isAuto ? 'Prix Unit.' : 'P.U. HT'}</th>
          <th class="text-right" style="width: 15%;">Total ${isAuto ? 'Net' : 'HT'}</th>
        </tr>
      </thead>
      <tbody>
        ${doc.items.length > 0 ? doc.items.map((it) => `
          <tr>
            <td>
              <strong>${escapeHtml(it.description)}</strong>
            </td>
            <td class="text-center font-bold">${it.quantity}</td>
            <td class="text-right">${it.unitPriceHt.toFixed(2)} €</td>
            <td class="text-right font-bold">${it.totalHt.toFixed(2)} €</td>
          </tr>
        `).join('') : `
          <tr>
            <td><strong>Abonnement SaaS WoxxApp & Activation Modules</strong></td>
            <td class="text-center font-bold">1</td>
            <td class="text-right">${doc.totalHt.toFixed(2)} €</td>
            <td class="text-right font-bold">${doc.totalHt.toFixed(2)} €</td>
          </tr>
        `}
      </tbody>
    </table>

    <!-- Totaux -->
    <div class="totals-wrapper">
      <table class="totals-table">
        ${!isAuto ? `
        <tr>
          <td>Total Hors Taxes (HT) :</td>
          <td class="text-right font-bold">${doc.totalHt.toFixed(2)} €</td>
        </tr>
        <tr>
          <td>Total TVA (${doc.vatRate}%) :</td>
          <td class="text-right font-bold">${doc.totalVat.toFixed(2)} €</td>
        </tr>` : `
        <tr>
          <td>Total Hors Taxes (HT) :</td>
          <td class="text-right font-bold">${doc.totalHt.toFixed(2)} €</td>
        </tr>
        <tr>
          <td>TVA (0% - Art. 293 B du CGI) :</td>
          <td class="text-right font-bold">0.00 €</td>
        </tr>`}
        <tr class="grand-total">
          <td style="padding: 10px 12px; font-weight: 900;">TOTAL ${isAuto ? 'NET À PAYER' : 'TTC'} :</td>
          <td class="text-right" style="padding: 10px 12px; font-size: 18px; font-weight: 900; font-family: monospace;">
            ${doc.totalTtc.toFixed(2)} €
          </td>
        </tr>
      </table>
    </div>

    <!-- Bas de page / Mentions Légales -->
    <div class="legal-footer">
      <div>
        <strong>${escapeHtml(doc.seller.companyName)}</strong> — ${escapeHtml(doc.seller.legalForm || 'Société')}${doc.seller.capital ? ` au capital de ${escapeHtml(doc.seller.capital)}` : ''} — 
        SIRET : ${escapeHtml(doc.seller.siret || '—')} — RCS ${escapeHtml(doc.seller.rcsCity || 'Paris')} — Siège : ${escapeHtml(doc.seller.address || '')}, ${escapeHtml(doc.seller.zip || '')} ${escapeHtml(doc.seller.city || '')}
      </div>
      ${isAuto ? `<div><em>Dispensé d’immatriculation au registre du commerce et des sociétés (RCS) et au répertoire des métiers (RM) — TVA non applicable, art. 293 B du CGI.</em></div>` : ''}
      <div style="margin-top: 4px;">
        Conditions de règlement : Facture acquittée par carte bancaire. En cas de retard de paiement, pénalité de 3 fois le taux d’intérêt légal + indemnité forfaitaire pour frais de recouvrement de 40 € pour les professionnels (Art. D. 441-5 C. com).
      </div>
    </div>
  </div>

</body>
</html>`;
}
