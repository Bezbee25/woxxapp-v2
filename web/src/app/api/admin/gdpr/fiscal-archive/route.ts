import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { generateFiscalArchiveCsv } from '@/lib/gdpr';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');
    const fromYear = yearParam ? parseInt(yearParam, 10) : undefined;

    const csvContent = await generateFiscalArchiveCsv(fromYear);

    const filename = `archive-fiscale-woxxapp-${fromYear || 'complete'}-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ detail: error.message }, { status });
  }
}
