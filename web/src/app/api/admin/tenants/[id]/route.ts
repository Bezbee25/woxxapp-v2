import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { TenantStatus } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['ADMIN'], req);
    const { id } = await params;
    const body = await req.json();
    const { status, customCommissionPercent, modules, customDomain } = body;

    const data: any = {};
    if (status && ['PENDING', 'ACTIVE', 'SUSPENDED'].includes(status)) {
      data.status = status as TenantStatus;
    }
    if (customCommissionPercent !== undefined) {
      data.customCommissionPercent = customCommissionPercent === null ? null : Number(customCommissionPercent);
    }
    if (modules !== undefined) {
      data.modules = Array.isArray(modules) ? JSON.stringify(modules) : modules;
    }
    if (customDomain !== undefined) {
      data.customDomain = customDomain ? customDomain.trim().toLowerCase() : null;
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      ...updated,
      modules: JSON.parse(updated.modules || '[]'),
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['ADMIN'], req);
    const { id } = await params;

    await prisma.tenant.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Tenant supprimé avec succès' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
