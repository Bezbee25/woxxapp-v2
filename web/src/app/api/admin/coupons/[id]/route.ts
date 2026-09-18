import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'], req);
    const { id } = params;
    const body = await req.json();
    const { code, discountPercent, discountAmount, maxUses, expiresAt, isActive } = body;

    const data: any = {};
    if (code) data.code = code.trim().toUpperCase();
    if (discountPercent !== undefined) data.discountPercent = discountPercent ? Number(discountPercent) : null;
    if (discountAmount !== undefined) data.discountAmount = discountAmount ? Number(discountAmount) : null;
    if (maxUses !== undefined) data.maxUses = maxUses ? Number(maxUses) : null;
    if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const updated = await prisma.coupon.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'], req);
    const { id } = params;

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Coupon supprimé avec succès' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
