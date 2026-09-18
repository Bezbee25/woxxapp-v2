import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { exportUserData } from '@/lib/gdpr';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const data = await exportUserData(user.id);

    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="woxxapp-donnees-personnelles-${user.id.slice(0, 8)}.json"`,
      },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
