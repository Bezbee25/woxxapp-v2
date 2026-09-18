import { prisma } from './prisma';
import { hashPassword } from './auth';
import { DEFAULT_LEGAL_POLICIES } from './policies-data';

export async function runSeed() {
  console.log('🌱 Démarrage de l’initialisation de la base de données WoxxApp V2...');

  // 1. Initialiser le Super-Administrateur
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@woxxapp.de';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminPassword2026!';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: 'Super Administrateur WoxxApp',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log(`✅ Super-Administrateur créé : ${adminEmail}`);
  } else {
    console.log(`ℹ️ Super-Administrateur déjà existant : ${adminEmail}`);
  }

  // 2. Initialiser les Paramètres Système par défaut
  const defaultSettings: { key: string; value: string }[] = [
    { key: 'company_name', value: 'WoxxApp SAS' },
    { key: 'company_tax_type', value: 'MICRO_ENTERPRISE' },
    { key: 'company_vat_rate', value: '20.0' },
    { key: 'company_legal_notice', value: 'Franchise en base de TVA, art. 293 B du CGI' },
    { key: 'company_siret', value: '123 456 789 00012' },
    { key: 'company_vat_number', value: 'FR12345678900' },
    { key: 'company_address', value: '10 Rue de la Paix, 75001 Paris, France' },
    { key: 'company_email', value: 'contact@woxxapp.de' },
    
    // WoxxPay Clé isolée
    { key: 'woxxpay_api_key', value: 'woxx_live_appv2_secret_key' },
    { key: 'woxxpay_merchant_id', value: 'merch_woxxapp_v2' },
    { key: 'woxxpay_webhook_secret', value: 'whsec_woxxapp_v2_default' },
    
    // Google Analytics
    { key: 'google_analytics_id', value: 'G-XXXXXXXXXX' },
    
    // SMTP
    { key: 'smtp_host', value: 'smtp.sendgrid.net' },
    { key: 'smtp_port', value: '587' },
    { key: 'smtp_user', value: 'apikey' },
    { key: 'smtp_pass', value: '' },
    { key: 'smtp_from', value: 'no-reply@woxxapp.de' },
  ];

  // Ajouter les politiques légales
  for (const [slug, policy] of Object.entries(DEFAULT_LEGAL_POLICIES)) {
    defaultSettings.push({
      key: `policy_${slug}`,
      value: policy.content,
    });
  }

  for (const s of defaultSettings) {
    await prisma.systemSettings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ Paramètres système et CMS initialisés et actualisés.');

  // 3. Initialiser les Coupons par défaut
  const defaultCoupons = [
    { code: 'BIENVENUE10', discountPercent: 10, isActive: true },
    { code: 'LANCEMENT50', discountAmount: 50, isActive: true },
  ];

  for (const c of defaultCoupons) {
    const exists = await prisma.coupon.findUnique({
      where: { code: c.code },
    });
    if (!exists) {
      await prisma.coupon.create({
        data: c,
      });
    }
  }
  console.log('✅ Coupons de test initialisés.');
}
