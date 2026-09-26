import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || '295955485265-918kb88dnfihg9b2dgbi39rjkjbqujts.apps.googleusercontent.com';
    
    if (!clientId) {
      return NextResponse.json(
        { detail: 'Google OAuth non configuré (GOOGLE_CLIENT_ID manquant).' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const nextParam = searchParams.get('next') || '/';
    const safeNext = nextParam.startsWith('/') ? nextParam : '/';

    // Détermination de l'URL de base dynamique (Host ou Variable d'environnement)
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Génération du CSRF token et du state encodé
    const csrf = crypto.randomBytes(16).toString('hex');
    const statePayload = JSON.stringify({ csrf, next: safeNext });
    const state = Buffer.from(statePayload).toString('base64url');

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('access_type', 'online');
    googleAuthUrl.searchParams.set('prompt', 'select_account');

    const response = NextResponse.redirect(googleAuthUrl.toString());

    // Cookie de sécurité CSRF temporaire
    response.cookies.set('oauth_state', csrf, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/google',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error: any) {
    console.error('Erreur initiation Google OAuth:', error);
    return NextResponse.json(
      { detail: error.message || 'Erreur lors de la redirection Google' },
      { status: 500 }
    );
  }
}
