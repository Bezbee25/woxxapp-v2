import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StoreManagerClient } from '@/lib/store-manager-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId } = body;

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId obligatoire' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });
    }

    const modules: string[] = JSON.parse(tenant.modules || '[]');

    // Appel à l'orchestrateur K8s Store Manager
    const k8sResult = await StoreManagerClient.provisionStore({
      storeId: tenant.id,
      subdomain: tenant.subdomain,
      storeKey: tenant.tenantApiKey,
      storeName: tenant.commerceName,
      modules,
      customDomain: tenant.customDomain || undefined,
    });

    if (!k8sResult.success) {
      return NextResponse.json({ error: k8sResult.error || 'Erreur lors du déploiement' }, { status: 500 });
    }

    // Mise à jour de l'état du tenant en base
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        status: 'ACTIVE',
        k8sStatus: 'DEPLOYED',
        k8sNamespace: `tenant-${tenant.subdomain}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Boutique ${tenant.subdomain}.woxxapp.de déployée avec succès`,
      tenant: updatedTenant,
      k8s: k8sResult.data,
    });
  } catch (error: any) {
    console.error('Erreur provisioning route:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
