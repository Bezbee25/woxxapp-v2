import { NextResponse } from 'next/server';
import { getSystemPricingAndTaxSettings, MODULE_PROGRESSION_STEPS } from '@/lib/modules-catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { pricingMap, taxSettings } = await getSystemPricingAndTaxSettings();

    return NextResponse.json({
      pricingMap,
      taxSettings,
      steps: MODULE_PROGRESSION_STEPS,
    });
  } catch (error: any) {
    console.error('Erreur API ModuleCatalog:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du catalogue' }, { status: 500 });
  }
}
