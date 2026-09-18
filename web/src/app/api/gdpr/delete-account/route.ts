import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { anonymizeAndCloseAccount } from '@/lib/gdpr';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { detail: 'Le compte Super-Administrateur ne peut pas être supprimé via cette route.' },
        { status: 400 }
      );
    }

    const result = await anonymizeAndCloseAccount(user.id);

    const response = NextResponse.json(result);

    // Supprimer le cookie de session
    response.cookies.set('woxx_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
