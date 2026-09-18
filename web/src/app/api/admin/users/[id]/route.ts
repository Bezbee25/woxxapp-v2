import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole, hashPassword, sanitizeUser } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['ADMIN'], req);
    const { id } = await params;
    const body = await req.json();
    const { role, assignedSalesRepId, isActive, password, fullName } = body;

    const data: any = {};
    if (role && ['ADMIN', 'CHARGE_DAFFAIRE', 'CLIENT'].includes(role)) {
      data.role = role as Role;
    }
    if (assignedSalesRepId !== undefined) {
      data.assignedSalesRepId = assignedSalesRepId || null;
    }
    if (isActive !== undefined) {
      data.isActive = Boolean(isActive);
    }
    if (fullName !== undefined) {
      data.fullName = fullName?.trim() || null;
    }
    if (password) {
      data.password = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(sanitizeUser(updated));
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

    const updated = await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        anonymizedAt: new Date(),
        email: `deleted-${id.slice(0, 8)}@deleted.woxxapp.de`,
        fullName: 'Utilisateur Supprimé',
        password: null,
      },
    });

    return NextResponse.json({ message: 'Utilisateur désactivé et anonymisé', user: sanitizeUser(updated) });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
