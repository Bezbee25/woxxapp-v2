import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, sanitizeUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { detail: 'Non authentifié' },
        { status: 401 }
      );
    }

    return NextResponse.json(sanitizeUser(user));
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
