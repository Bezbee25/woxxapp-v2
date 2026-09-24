import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole, sanitizeUser, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);

    const where: any = {
      role: 'CLIENT',
    };

    if (user.role === 'CHARGE_DAFFAIRE') {
      where.assignedSalesRepId = user.id;
    }

    const clients = await prisma.user.findMany({
      where,
      include: {
        tenants: true,
        subscriptions: true,
        quotesAsClient: {
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      clients.map((c) => ({
        ...sanitizeUser(c),
        tenants: c.tenants.map((t) => ({
          ...t,
          modules: JSON.parse(t.modules || '[]'),
        })),
        subscriptions: c.subscriptions,
        quotes: c.quotesAsClient.map((q) => ({
          ...q,
          items: JSON.parse(q.items || '[]'),
        })),
        invoices: c.invoices,
      }))
    );
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(['CHARGE_DAFFAIRE', 'ADMIN'], req);
    const body = await req.json();
    const { email, fullName, password, commerceName, subdomain } = body;

    if (!email) {
      return NextResponse.json(
        { detail: 'Adresse email obligatoire.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Vérifier si l'utilisateur existe déjà
    let client = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (client) {
      // Si déjà existant, l'assigner à ce chargé d'affaires
      client = await prisma.user.update({
        where: { id: client.id },
        data: {
          assignedSalesRepId: user.id,
          fullName: fullName?.trim() || client.fullName,
        },
      });
    } else {
      const defaultPassword = password || 'WoxxClient2026!';
      const hashedPassword = await hashPassword(defaultPassword);

      client = await prisma.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          fullName: fullName?.trim() || null,
          role: 'CLIENT',
          assignedSalesRepId: user.id,
          isActive: true,
        },
      });
    }

    // Créer éventuellement la boutique initiale si les infos sont fournies
    let tenant = null;
    if (commerceName && subdomain) {
      const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const existingTenant = await prisma.tenant.findUnique({
        where: { subdomain: cleanSubdomain },
      });

      if (!existingTenant) {
        tenant = await prisma.tenant.create({
          data: {
            userId: client.id,
            email: client.email,
            commerceName: commerceName.trim(),
            subdomain: cleanSubdomain,
            status: 'PENDING',
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Client enregistré avec succès',
        client: sanitizeUser(client),
        tenant,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
