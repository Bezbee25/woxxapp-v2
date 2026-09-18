import { prisma } from './prisma';
import { hashPassword } from './auth';

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
  const defaultSettings = [
    { key: 'company_name', value: 'WoxxApp SAS' },
    { key: 'company_tax_type', value: 'MICRO_ENTERPRISE' }, // ou 'SAS_SARL_WITH_VAT'
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

    // Politiques & Textes CMS Légal
    { 
      key: 'policy_cgu', 
      value: `# Conditions Générales d'Utilisation (CGU)\n\nBienvenue sur WoxxApp V2. En utilisant notre service de création et gestion de sites e-commerce et vitrine, vous acceptez sans réserve les présentes CGU.\n\n### 1. Accès au service\nLe service est accessible à tout professionnel ou particulier disposant d'un compte validé.\n\n### 2. Responsabilité\nL'utilisateur est seul responsable du contenu publié sur son site hébergé via WoxxApp.` 
    },
    { 
      key: 'policy_cgv', 
      value: `# Conditions Générales de Vente (CGV)\n\n### 1. Tarifs et Facturation\nLes formules d'abonnement WoxxApp V2 sont proposées à 15 € HT/mois ou 150 € HT/an.\n\n### 2. Paiement via WoxxPay\nLes transactions sont opérées de manière sécurisée via la passerelle de paiement WoxxPay.\n\n### 3. Résiliation\nL'abonnement peut être résilié à tout moment depuis le tableau de bord client avec effet à la fin de la période en cours.` 
    },
    { 
      key: 'policy_legal', 
      value: `# Mentions Légales\n\n**Éditeur du site** : WoxxApp\n**Siège social** : 10 Rue de la Paix, 75001 Paris, France\n**Directeur de la publication** : Fabrice\n**Hébergement** : Cluster Kubernetes Hetzner Cloud hébergé en Union Européenne.` 
    },
    { 
      key: 'policy_gdpr', 
      value: `# Protection des Données Personnelles (RGPD)\n\nConformément au Règlement Général sur la Protection des Données (RGPD 2016/679) et à la loi Informatique et Libertés :\n\n- **Droit d'accès et portabilité (Art. 20)** : Vous pouvez télécharger vos données depuis votre profil.\n- **Droit à l'effacement (Art. 17)** : Vous pouvez demander la suppression de votre compte.\n- **Conservation légale** : Conformément à l'Article L123-22 du Code de Commerce, vos factures sont conservées pendant 10 ans.` 
    },
    { 
      key: 'policy_cookies', 
      value: `# Politique de Gestion des Cookies\n\nNous utilisons des cookies strictement nécessaires au fonctionnement du site ainsi que Google Analytics pour mesurer l'audience.\n\nGoogle Analytics n'est activé qu'après votre consentement explicite via le bandeau de cookies.` 
    },
  ];

  for (const s of defaultSettings) {
    const exists = await prisma.systemSettings.findUnique({
      where: { key: s.key },
    });
    if (!exists) {
      await prisma.systemSettings.create({
        data: s,
      });
    }
  }
  console.log('✅ Paramètres système et CMS initialisés.');

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
