import { prisma } from './prisma';

/**
 * Exporte toutes les données personnelles d'un utilisateur sous forme d'objet structuré (RGPD Art. 20)
 */
export async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenants: true,
      subscriptions: true,
      invoices: true,
    },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  return {
    rgpd_notice: 'Exportation de données personnelles conforme à l’Article 20 du RGPD.',
    exported_at: new Date().toISOString(),
    profile: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    tenants: user.tenants.map(t => ({
      id: t.id,
      commerceName: t.commerceName,
      subdomain: t.subdomain,
      customDomain: t.customDomain,
      status: t.status,
      modules: JSON.parse(t.modules || '[]'),
      createdAt: t.createdAt,
    })),
    subscriptions: user.subscriptions.map(s => ({
      id: s.id,
      billingCycle: s.billingCycle,
      status: s.status,
      currentPeriodEnd: s.currentPeriodEnd,
      createdAt: s.createdAt,
    })),
    invoices: user.invoices.map(i => ({
      invoiceNumber: i.invoiceNumber,
      totalHt: i.totalHt,
      totalVat: i.totalVat,
      totalTtc: i.totalTtc,
      vatRate: i.vatRate,
      isVatExempt: i.isVatExempt,
      legalNotice: i.legalNotice,
      status: i.status,
      createdAt: i.createdAt,
    })),
  };
}

/**
 * Supprime/Anonymise un compte utilisateur conformément au RGPD Art. 17 tout en
 * respectant l'Article L123-22 du Code de Commerce (conservation décennale des factures).
 */
export async function anonymizeAndCloseAccount(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { tenants: true },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // 1. Suspendre ou libérer les tenants
  await prisma.tenant.updateMany({
    where: { userId },
    data: {
      status: 'SUSPENDED',
    },
  });

  // 2. Anonymisation irréversible du profil User
  const anonymizedEmail = `anonymized-${user.id.slice(0, 8)}@deleted.woxxapp.de`;
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      email: anonymizedEmail,
      fullName: 'Utilisateur Anonymisé (RGPD Art. 17)',
      password: null,
      googleId: null,
      isActive: false,
      anonymizedAt: new Date(),
    },
  });

  return {
    success: true,
    message: 'Compte anonymisé avec succès. Les pièces comptables sont archivées conformément à l’Art. L123-22 du Code de Commerce.',
    user: updatedUser,
  };
}

/**
 * Génère un export CSV des factures pour l'archive fiscale (10 ans).
 */
export async function generateFiscalArchiveCsv(fromYear?: number) {
  const whereClause: any = {};
  if (fromYear) {
    whereClause.createdAt = {
      gte: new Date(`${fromYear}-01-01T00:00:00.000Z`),
    };
  }

  const invoices = await prisma.invoice.findMany({
    where: whereClause,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    'Numero_Facture',
    'Date_Emission',
    'Client_ID',
    'Client_Email',
    'Montant_HT',
    'Montant_TVA',
    'Taux_TVA',
    'Montant_TTC',
    'Exoneration_TVA',
    'Mention_Legale',
    'Statut',
  ];

  const rows = invoices.map(inv => [
    inv.invoiceNumber,
    inv.createdAt.toISOString(),
    inv.userId,
    inv.user?.email || 'N/A',
    inv.totalHt.toFixed(2),
    inv.totalVat.toFixed(2),
    `${inv.vatRate}%`,
    inv.totalTtc.toFixed(2),
    inv.isVatExempt ? 'OUI' : 'NON',
    `"${(inv.legalNotice || '').replace(/"/g, '""')}"`,
    inv.status,
  ]);

  return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
}
