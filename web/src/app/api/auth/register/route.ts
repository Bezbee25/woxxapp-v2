import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, sanitizeUser } from '@/lib/auth';
import { runSeed } from '@/lib/seed';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, commerce_name, subdomain } = body;

    if (!email || !password) {
      return NextResponse.json(
        { detail: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Auto-seed initial si la base est vide
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await runSeed();
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { detail: 'Un compte existe déjà avec cette adresse email' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        fullName: full_name?.trim() || null,
        role: 'CLIENT',
        isActive: true,
      },
    });

    // Si des infos de boutique/tenant sont fournies
    if (commerce_name && subdomain) {
      const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const existingTenant = await prisma.tenant.findUnique({
        where: { subdomain: cleanSubdomain },
      });

      if (!existingTenant) {
        await prisma.tenant.create({
          data: {
            userId: user.id,
            email: user.email,
            commerceName: commerce_name.trim(),
            subdomain: cleanSubdomain,
            status: 'PENDING',
          },
        });
      }
    }

    // Génération du Token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: 'Compte créé avec succès',
        user: sanitizeUser(user),
      },
      { status: 201 }
    );

    // Cookie HttpOnly sécurisé
    response.cookies.set('woxx_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    return NextResponse.json(
      { detail: error.message || 'Erreur lors de l’inscription' },
      { status: 500 }
    );
  }
}
