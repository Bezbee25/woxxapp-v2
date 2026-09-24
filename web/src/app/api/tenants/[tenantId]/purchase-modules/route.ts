import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { StoreManagerClient } from '@/lib/store-manager-client';
import {
  calculateModulesOrder,
  calculateProrataOrder,
  getSystemPricingAndTaxSettings,
  parseTenantModules
} from '@/lib/modules-catalog';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { tenantId } = await params;
    const body = await req.json();
    const {
      modules,
      unrenewedModules: reqUnrenewed = [],
      billingCycle = 'monthly',
      nextBillingCycle: reqNextCycle,
      paymentMethod = 'STRIPE_CARD'
    } = body;

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

    // Analyse de l'état actuel de la boutique
    const currentParsed = parseTenantModules(tenant.modules);
    const currentlyActive = currentParsed.activeModules;

    // Normalisation des modules demandés
    const cleanRequested = Array.from(new Set(['site_web', ...modules]));
    if (cleanRequested.includes('ecommerce')) {
      if (!cleanRequested.includes('accounting')) cleanRequested.push('accounting');
      if (!cleanRequested.includes('woxxpay')) cleanRequested.push('woxxpay');
    }

    // Récupération de la souscription existante
    const existingSub = await prisma.subscription.findFirst({
      where: { userId: user.id },
    });

    const activeCycle = existingSub?.billingCycle || currentParsed.billingCycle || 'monthly';
    
    // Détermination de nextBillingCycle à date anniversaire
    let finalNextCycle: 'monthly' | 'yearly' | null = reqNextCycle || null;
    if (billingCycle !== activeCycle) {
      finalNextCycle = billingCycle;
    }

    // Identification des nouveaux modules (qui n'étaient pas encore actifs)
    const newlyAddedModules = cleanRequested.filter((m) => !currentlyActive.includes(m));

    // Gestion des modules non-renouvelés
    const finalUnrenewed = Array.isArray(reqUnrenewed)
      ? reqUnrenewed.filter((m: string) => cleanRequested.includes(m) && m !== 'site_web')
      : [];

    // Récupération des prix et de la fiscalité
    const { pricingMap, taxSettings } = await getSystemPricingAndTaxSettings();

    let invoice = null;
    let orderSummary: any = null;

    // Déterminer s'il y a un paiement à effectuer
    if (newlyAddedModules.length > 0 || !existingSub) {
      // Cas 1 : Ajout de nouveaux modules sur un abonnement annuel existant -> PRORATA
      if (existingSub && existingSub.billingCycle === 'yearly' && newlyAddedModules.length > 0) {
        const prorataCalc = calculateProrataOrder(
          newlyAddedModules,
          'yearly',
          existingSub.currentPeriodEnd,
          pricingMap,
          taxSettings
        );

        orderSummary = prorataCalc;

        if (prorataCalc.totalHt > 0) {
          const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const randSuffix = Math.floor(1000 + Math.random() * 9000);
          const invoiceNumber = `FAC-${dateStr}-${randSuffix}`;

          const invoiceNotice = `${taxSettings.legalNotice}. Extension de formule annuelle au prorata (${prorataCalc.daysRemaining}j/365j) pour les modules: ${newlyAddedModules.join(', ')} sur la boutique ${tenant.commerceName} (${tenant.subdomain}).`;

          invoice = await prisma.invoice.create({
            data: {
              invoiceNumber,
              userId: user.id,
              subscriptionId: existingSub.id,
              totalHt: prorataCalc.totalHt,
              totalVat: prorataCalc.totalVat,
              totalTtc: prorataCalc.totalTtc,
              vatRate: prorataCalc.vatRate,
              isVatExempt: prorataCalc.isVatExempt,
              status: 'PAID',
              legalNotice: invoiceNotice,
            },
          });
        }
      } else {
        // Cas 2 : Première souscription ou abonnement mensuel
        const cycle = existingSub?.billingCycle === 'yearly' ? 'yearly' : billingCycle;
        const targetModules = newlyAddedModules.length > 0 && existingSub ? newlyAddedModules : cleanRequested;
        const fullCalc = calculateModulesOrder(targetModules, cycle, pricingMap, taxSettings);

        orderSummary = fullCalc;

        if (fullCalc.totalHt > 0) {
          const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const randSuffix = Math.floor(1000 + Math.random() * 9000);
          const invoiceNumber = `FAC-${dateStr}-${randSuffix}`;

          const invoiceNotice = `${taxSettings.legalNotice}. Abonnement SaaS WoxxApp (${cycle === 'yearly' ? 'Annuel' : 'Mensuel'}) pour la boutique ${tenant.commerceName} (${tenant.subdomain}). Règlement validé par Carte Bancaire Stripe.`;

          const periodDays = cycle === 'yearly' ? 365 : 30;
          const currentPeriodEnd = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000);

          let subId = existingSub?.id;
          if (!existingSub) {
            const newSub = await prisma.subscription.create({
              data: {
                userId: user.id,
                billingCycle: cycle,
                status: 'active',
                currentPeriodEnd,
              },
            });
            subId = newSub.id;
          }

          invoice = await prisma.invoice.create({
            data: {
              invoiceNumber,
              userId: user.id,
              subscriptionId: subId,
              totalHt: fullCalc.totalHt,
              totalVat: fullCalc.totalVat,
              totalTtc: fullCalc.totalTtc,
              vatRate: fullCalc.vatRate,
              isVatExempt: fullCalc.isVatExempt,
              status: 'PAID',
              legalNotice: invoiceNotice,
            },
          });
        }
      }
    }

    // Sauvegarde des modules et de la formule dans la base de données WoxxApp
    const modulesPayload = {
      active: cleanRequested,
      unrenewed: finalUnrenewed,
      billingCycle: activeCycle,
      nextBillingCycle: finalNextCycle,
    };

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        modules: JSON.stringify(modulesPayload),
      },
    });

    // Synchronisation immédiate avec Kubernetes via Store Manager (tous les modules actifs)
    await StoreManagerClient.updateModules(tenant.id, cleanRequested);

    return NextResponse.json({
      success: true,
      message: 'Modules et formule synchronisés avec succès.',
      invoice,
      tenant: {
        ...updatedTenant,
        modules: cleanRequested,
        unrenewedModules: finalUnrenewed,
        billingCycle: activeCycle,
        nextBillingCycle: finalNextCycle,
      },
      order: orderSummary,
    });
  } catch (error: any) {
    console.error('Erreur POST /api/tenants/[tenantId]/purchase-modules:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la commande des modules' },
      { status: 500 }
    );
  }
}
