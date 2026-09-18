import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken, sanitizeUser } from '@/lib/auth';
import { runSeed } from '@/lib/seed';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { detail: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Auto-seed si la base est vide (ex: premier démarrage)
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await runSeed();
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { detail: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { detail: 'Ce compte a été désactivé ou anonymisé' },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { detail: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: 'Connexion réussie',
      user: sanitizeUser(user),
    });

    response.cookies.set('woxx_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error: any) {
    console.error('Erreur connexion:', error);
    return NextResponse.json(
      { detail: error.message || 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
