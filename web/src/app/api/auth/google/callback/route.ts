import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const host = req.headers.get('host') || 'localhost:3000';
  const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const oauthError = searchParams.get('error');

    if (oauthError || !code) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=oauth_denied`);
    }

    // 1. Validation du state CSRF
    let stateData = { csrf: '', next: '/' };
    try {
      stateData = JSON.parse(Buffer.from(state || '', 'base64url').toString());
    } catch {
      return NextResponse.redirect(`${baseUrl}/?auth_error=oauth_state_invalid`);
    }

    const storedCsrf = req.cookies.get('oauth_state')?.value;
    if (!storedCsrf || storedCsrf !== stateData.csrf) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=oauth_csrf_mismatch`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || '295955485265-918kb88dnfihg9b2dgbi39rjkjbqujts.apps.googleusercontent.com';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // 2. Échange du code d'autorisation contre les tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('Erreur token Google OAuth:', errBody);
      return NextResponse.redirect(`${baseUrl}/?auth_error=oauth_token_exchange_failed`);
    }

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=oauth_no_token`);
    }

    // 3. Récupération des informations du profil utilisateur
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=oauth_userinfo_failed`);
    }

    const googleUser = await userRes.json();
    const rawEmail = typeof googleUser.email === 'string' ? googleUser.email.trim().toLowerCase() : '';

    if (!rawEmail || !googleUser.email_verified) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=oauth_email_unverified`);
    }

    const googleId = googleUser.sub;
    const fullName = googleUser.name || `${googleUser.given_name || ''} ${googleUser.family_name || ''}`.trim() || rawEmail;
    const avatarUrl = googleUser.picture || null;

    // 4. Recherche ou création du compte User dans PostgreSQL (Prisma)
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleId },
          { email: rawEmail },
        ],
      },
    });

    if (user) {
      // Mise à jour de l'ID Google ou de l'avatar si manquant
      if (!user.googleId || !user.avatarUrl) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleId,
            avatarUrl: user.avatarUrl || avatarUrl,
            updatedAt: new Date(),
          },
        });
      }
    } else {
      // Création automatique du nouveau client
      user = await prisma.user.create({
        data: {
          email: rawEmail,
          googleId: googleId,
          fullName: fullName,
          avatarUrl: avatarUrl,
          role: 'CLIENT',
          isActive: true,
        },
      });
    }

    if (!user.isActive) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=account_disabled`);
    }

    // 5. Génération du JWT WoxxApp v2
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Destination post-connexion selon le rôle
    let destination = stateData.next && stateData.next !== '/'
      ? stateData.next
      : user.role === 'ADMIN'
      ? '/admin'
      : user.role === 'CHARGE_DAFFAIRE'
      ? '/sales-rep'
      : '/dashboard';

    const response = NextResponse.redirect(`${baseUrl}${destination}`);

    // Dépôt du cookie de session
    response.cookies.set('woxx_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    // Nettoyage du cookie CSRF temporaire
    response.cookies.delete('oauth_state');

    return response;
  } catch (error: any) {
    console.error('Erreur Callback Google OAuth:', error);
    return NextResponse.redirect(`${baseUrl}/?auth_error=internal_error`);
  }
}
