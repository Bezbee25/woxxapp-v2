import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole, hashPassword, sanitizeUser } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);

    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get('role');
    const search = searchParams.get('search');

    const where: any = {};
    if (roleParam && ['ADMIN', 'CHARGE_DAFFAIRE', 'CLIENT'].includes(roleParam.toUpperCase())) {
      where.role = roleParam.toUpperCase() as Role;
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        assignedSalesRep: {
          select: { id: true, email: true, fullName: true },
        },
        tenants: {
          select: { id: true, commerceName: true, subdomain: true, imageTag: true, status: true },
        },
        _count: {
          select: { tenants: true, subscriptions: true, invoices: true, clients: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      users.map(u => ({
        ...sanitizeUser(u),
        assignedSalesRep: u.assignedSalesRep,
        tenants: u.tenants,
        stats: u._count,
      }))
    );
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);

    const body = await req.json();
    const { email, password, fullName, role, assignedSalesRepId } = body;

    if (!email || !password) {
      return NextResponse.json({ detail: 'Email et mot de passe requis' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ detail: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const validRole = ['ADMIN', 'CHARGE_DAFFAIRE', 'CLIENT'].includes(role) ? role : 'CLIENT';

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        fullName: fullName?.trim() || null,
        role: validRole as Role,
        assignedSalesRepId: assignedSalesRepId || null,
        isActive: true,
      },
    });

    return NextResponse.json(sanitizeUser(user), { status: 201 });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
