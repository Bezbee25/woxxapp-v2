import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { StoreManagerClient } from '@/lib/store-manager-client';
import { calculateModulesOrder, getSystemPricingAndTaxSettings } from '@/lib/modules-catalog';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { tenantId } = await params;
    const body = await req.json();
    const { modules, billingCycle = 'monthly', paymentMethod = 'WOXXPAY_CARD' } = body;

    if (!Array.isArray(modules)) {
      return NextResponse.json({ error: 'modules doit être un tableau' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [{ id: tenantId }, { subdomain: tenantId }],
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });
    }

    // Seul le propriétaire ou un ADMIN peut commander des modules pour cette boutique
    if (user.role !== 'ADMIN' && tenant.userId !== user.id) {
      return NextResponse.json(
        { error: 'Vous n’êtes pas autorisé à modifier les modules de cette boutique' },
        { status: 403 }
      );
    }

    // Normalisation des modules : toujours inclure 'site_web'
    const cleanModules = Array.from(new Set(['site_web', ...modules]));
    if (cleanModules.includes('ecommerce')) {
      if (!cleanModules.includes('accounting')) cleanModules.push('accounting');
      if (!cleanModules.includes('woxxpay')) cleanModules.push('woxxpay');
    }

    // Récupération de la fiscalité et des prix configurés par l'Admin
    const { pricingMap, taxSettings } = await getSystemPricingAndTaxSettings();

    // Calcul de la commande
    const orderCalc = calculateModulesOrder(cleanModules, billingCycle, pricingMap, taxSettings);

    // Génération du numéro de facture
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `FAC-${dateStr}-${randSuffix}`;

    const invoiceLegalNotice = taxSettings.isVatExempt
      ? `${taxSettings.legalNotice}. Abonnement SaaS WoxxApp (${billingCycle === 'yearly' ? 'Annuel' : 'Mensuel'}) pour la boutique ${tenant.commerceName} (${tenant.subdomain}). Règlement validé par ${paymentMethod}.`
      : `${taxSettings.legalNotice} (TVA ${taxSettings.vatRate}%). Abonnement SaaS WoxxApp (${billingCycle === 'yearly' ? 'Annuel' : 'Mensuel'}) pour la boutique ${tenant.commerceName} (${tenant.subdomain}). Règlement validé par ${paymentMethod}.`;

    // 1. Création de la facture acquittée avec statut TVA exact
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId: user.id,
        totalHt: orderCalc.totalHt,
        totalVat: orderCalc.totalVat,
        totalTtc: orderCalc.totalTtc,
        vatRate: orderCalc.vatRate,
        isVatExempt: orderCalc.isVatExempt,
        status: 'PAID',
        legalNotice: invoiceLegalNotice,
      },
    });

    // 2. Création ou mise à jour de l'abonnement
    const periodDays = billingCycle === 'yearly' ? 365 : 30;
    const currentPeriodEnd = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000);

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: user.id },
    });

    if (existingSub) {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          billingCycle,
          status: 'active',
          currentPeriodEnd,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          billingCycle,
          status: 'active',
          currentPeriodEnd,
        },
      });
    }

    // 3. Mise à jour de la boutique dans WoxxApp
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        modules: JSON.stringify(cleanModules),
      },
    });

    // 4. Synchronisation immédiate avec Kubernetes via Store Manager
    await StoreManagerClient.updateModules(tenant.id, cleanModules);

    return NextResponse.json({
      success: true,
      message: 'Modules commandés, facture générée et boutique mise à jour avec succès.',
      invoice,
      tenant: {
        ...updatedTenant,
        modules: cleanModules,
      },
      order: orderCalc,
    });
  } catch (error: any) {
    console.error('Erreur POST /api/tenants/[tenantId]/purchase-modules:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la commande des modules' },
      { status: 500 }
    );
  }
}
