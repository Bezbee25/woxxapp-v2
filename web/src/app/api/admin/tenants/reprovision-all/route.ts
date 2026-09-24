import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { StoreManagerClient } from '@/lib/store-manager-client';

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);

    // Récupérer toutes les boutiques enregistrées dans PostgreSQL
    const tenants = await prisma.tenant.findMany({
      where: {
        status: { in: ['ACTIVE', 'PENDING'] },
      },
    });

    const results: Array<{ id: string; subdomain: string; status: string; error?: string }> = [];

    for (const tenant of tenants) {
      try {
        const parsedModules = JSON.parse(tenant.modules || '[]');
        const res = await StoreManagerClient.provisionStore({
          storeId: tenant.id,
          subdomain: tenant.subdomain,
          storeKey: tenant.tenantApiKey,
          storeName: tenant.commerceName,
          modules: parsedModules,
          customDomain: tenant.customDomain || undefined,
          image: tenant.imageTag || undefined,
        });

        results.push({
          id: tenant.id,
          subdomain: tenant.subdomain,
          status: res.success ? 'PROVISIONED' : 'ERROR',
          error: res.error,
        });
      } catch (err: any) {
        results.push({
          id: tenant.id,
          subdomain: tenant.subdomain,
          status: 'FAILED',
          error: err.message,
        });
      }
    }

    const successCount = results.filter((r) => r.status === 'PROVISIONED').length;

    return NextResponse.json({
      message: `${successCount} sur ${tenants.length} boutique(s) synchronisée(s) et reprovisionnée(s) sur Kubernetes avec succès.`,
      total: tenants.length,
      successCount,
      results,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
