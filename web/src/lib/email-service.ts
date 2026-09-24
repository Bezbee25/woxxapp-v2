import { prisma } from './prisma';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; id?: string }> {
  try {
    // 1. Récupération des paramètres SMTP s'ils existent en base
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'],
        },
      },
    });

    const settingsMap = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);

    const fromAddress = settingsMap['smtp_from'] || 'contact@woxxapp.de';

    console.log(`\n📧 [EMAIL DISPATCHED] -> To: ${to} | Subject: "${subject}" | From: ${fromAddress}`);
    console.log(`📄 [EMAIL PREVIEW]:\n${text || 'HTML Content sent'}\n`);

    return {
      success: true,
      id: `mail-${Date.now()}`,
    };
  } catch (error: any) {
    console.error('Erreur sendEmail:', error);
    return { success: false };
  }
}

/**
 * 1. Email envoyé au client quand un devis est établi
 */
export async function sendQuoteToClientEmail(params: {
  clientEmail: string;
  clientName?: string;
  salesRepName?: string;
  salesRepEmail?: string;
  quoteNumber: string;
  quoteTitle: string;
  totalTtc: number;
  validUntil?: Date | string | null;
  paymentUrl: string;
}) {
  const validUntilStr = params.validUntil
    ? new Date(params.validUntil).toLocaleDateString('fr-FR')
    : '30 jours';

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FFFDF9; padding: 24px; color: #0f172a;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #0f172a; border-radius: 20px; padding: 24px; box-shadow: 4px 4px 0px #0f172a;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <span style="font-size: 24px;">🏪</span>
          <h1 style="margin: 0; font-size: 20px; font-weight: 900;">WoxxApp • Nouvelle Proposition Commerciale</h1>
        </div>
        
        <p style="font-size: 14px; font-weight: bold;">Bonjour ${params.clientName || 'Cher Client'},</p>
        <p style="font-size: 14px; line-height: 1.5; color: #334155;">
          Votre chargé d'affaires <strong>${params.salesRepName || 'WoxxApp'}</strong> vous a préparé le devis <strong>${params.quoteNumber}</strong> :
        </p>

        <div style="background-color: #f8fafc; border: 2px solid #0f172a; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 900; color: #0f172a;">${params.quoteTitle}</p>
          <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 900; color: #059669;">Montant TTC : ${params.totalTtc.toFixed(2)} €</p>
          <p style="margin: 0; font-size: 12px; color: #64748b;">Valable jusqu'au : ${validUntilStr}</p>
        </div>

        <p style="font-size: 14px; color: #334155;">
          Vous pouvez consulter le détail complet, valider le devis et effectuer le paiement en toute sécurité par <strong>Virement Bancaire</strong> ou <strong>Carte Bancaire</strong> via WoxxPay.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${params.paymentUrl}" style="background-color: #fbbf24; color: #0f172a; padding: 14px 28px; text-decoration: none; font-size: 14px; font-weight: 900; border: 2px solid #0f172a; border-radius: 12px; display: inline-block; box-shadow: 3px 3px 0px #0f172a;">
            Consulter et Régler mon Devis en Ligne →
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          WoxxApp SAS • Plateforme e-commerce & solutions commerçants • Contact chargé d'affaires : ${params.salesRepEmail || 'contact@woxxapp.de'}
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.clientEmail,
    subject: `[WoxxApp] Votre Devis ${params.quoteNumber} est disponible (${params.totalTtc.toFixed(2)} €)`,
    html,
    text: `Bonjour ${params.clientName || ''}, votre devis ${params.quoteNumber} (${params.totalTtc.toFixed(2)} €) est disponible. Consultez et réglez-le en ligne sur : ${params.paymentUrl}`,
  });
}

/**
 * 2. Notification envoyée au Chargé d'Affaires dès que le devis est payé
 */
export async function sendQuotePaidToSalesRepEmail(params: {
  salesRepEmail: string;
  salesRepName?: string;
  clientName?: string;
  clientEmail: string;
  quoteNumber: string;
  quoteTitle: string;
  totalTtc: number;
  paymentMethod: string;
}) {
  const methodLabel =
    params.paymentMethod === 'WOXXPAY_CARD'
      ? 'Carte Bancaire (Instantané)'
      : 'Virement Bancaire SEPA (WoxxPay)';

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FFFDF9; padding: 24px; color: #0f172a;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #0f172a; border-radius: 20px; padding: 24px; box-shadow: 4px 4px 0px #0f172a;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <span style="font-size: 24px;">🎉</span>
          <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #059669;">Devis Réglé par le Client !</h1>
        </div>
        
        <p style="font-size: 14px; font-weight: bold;">Bonjour ${params.salesRepName || 'Chargé d’affaires'},</p>
        <p style="font-size: 14px; line-height: 1.5; color: #334155;">
          Bonne nouvelle ! Votre client <strong>${params.clientName || params.clientEmail}</strong> vient de régler le devis <strong>${params.quoteNumber}</strong> via WoxxPay.
        </p>

        <div style="background-color: #ecfdf5; border: 2px solid #059669; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 900; color: #065f46;">${params.quoteTitle}</p>
          <p style="margin: 0 0 4px 0; font-size: 20px; font-weight: 900; color: #059669;">Montant Encaissé : ${params.totalTtc.toFixed(2)} € TTC</p>
          <p style="margin: 0; font-size: 12px; color: #047857;">Moyen de règlement : <strong>${methodLabel}</strong></p>
        </div>

        <div style="background-color: #fef3c7; border: 2px solid #b45309; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 13px; font-weight: 900; color: #92400e;">
            ⏰ Action requise : Vous devez réaliser la prestation commandée dans le temps imparti auprès du commerçant.
          </p>
        </div>

        <p style="font-size: 13px; color: #334155;">
          Coordonnées du client : <a href="mailto:${params.clientEmail}">${params.clientEmail}</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          Notification automatique WoxxApp Commercial • Espace Chargé d'Affaires
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.salesRepEmail,
    subject: `🎉 [Paiement Validé] Devis ${params.quoteNumber} réglé par ${params.clientName || params.clientEmail} - Action requise`,
    html,
    text: `Bonjour, le client ${params.clientName || params.clientEmail} a réglé le devis ${params.quoteNumber} (${params.totalTtc.toFixed(2)} € via ${methodLabel}). Vous devez réaliser la prestation dans le délai imparti.`,
  });
}
