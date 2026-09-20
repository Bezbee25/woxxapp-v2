import crypto from 'crypto';
import { prisma } from './prisma';
import { hashPassword } from './auth';
import { DEFAULT_LEGAL_POLICIES } from './policies-data';

export async function runSeed() {
  console.log('🌱 Démarrage de l’initialisation de la base de données WoxxApp V2...');

  // 1. Initialiser le Super-Administrateur
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@woxxapp.de';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || crypto.randomBytes(16).toString('hex');

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
    
    // WoxxPay Configuration
    { key: 'woxxpay_api_key', value: process.env.WOXXPAY_API_KEY || '' },
    { key: 'woxxpay_merchant_id', value: process.env.WOXXPAY_MERCHANT_ID || '' },
    { key: 'woxxpay_webhook_secret', value: process.env.WOXXPAY_WEBHOOK_SECRET || '' },
    
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

  // 4. Initialiser les Boutiques Système & Démo (Zorea, Démo Mode, Démo Pizza)
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (adminUser) {
    const defaultTenants = [
      {
        commerceName: 'Zorea',
        subdomain: 'zorea',
        customDomain: 'zorea.fr',
        email: 'contact@zorea.fr',
        status: 'ACTIVE' as const,
        k8sNamespace: 'zorea',
        k8sStatus: 'ACTIVE',
        imageTag: 'ghcr.io/bezbee25/boutique-global:20260920-165745-arm64',
        modules: JSON.stringify([
          'pos',
          'ecommerce',
          'inventory',
          'loyalty',
          'analytics',
          'marketing',
          'table_ordering',
          'multi_store',
        ]),
      },
      {
        commerceName: 'Démo Mode & Vêtements',
        subdomain: 'demo-mode',
        customDomain: null,
        email: 'demo-mode@woxxapp.de',
        status: 'ACTIVE' as const,
        k8sNamespace: 'demo-stores',
        k8sStatus: 'ACTIVE',
        imageTag: 'ghcr.io/bezbee25/boutique-global:20260920-165745-arm64',
        modules: JSON.stringify([
          'pos',
          'ecommerce',
          'inventory',
          'loyalty',
          'analytics',
          'marketing',
          'table_ordering',
          'multi_store',
        ]),
      },
      {
        commerceName: 'Démo Restaurant Pizza',
        subdomain: 'demo-pizza',
        customDomain: null,
        email: 'demo-pizza@woxxapp.de',
        status: 'ACTIVE' as const,
        k8sNamespace: 'demo-stores',
        k8sStatus: 'ACTIVE',
        imageTag: 'ghcr.io/bezbee25/boutique-global:20260920-165745-arm64',
        modules: JSON.stringify([
          'pos',
          'ecommerce',
          'inventory',
          'loyalty',
          'analytics',
          'marketing',
          'table_ordering',
          'multi_store',
        ]),
      },
    ];

    for (const t of defaultTenants) {
      const exists = await prisma.tenant.findUnique({
        where: { subdomain: t.subdomain },
      });
      if (!exists) {
        await prisma.tenant.create({
          data: {
            ...t,
            userId: adminUser.id,
          },
        });
        console.log(`✅ Boutique enregistrée : ${t.commerceName} (${t.subdomain})`);
      }
    }
  }

  console.log('✅ Initialisation complète terminée.');
}
