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

    // Politiques & Textes CMS Légal Complets pour SaaS Web
    { 
      key: 'policy_cgu', 
      value: `# Conditions Générales d'Utilisation (CGU) — Plateforme WoxxApp

### Article 1 — Objet
Les présentes Conditions Générales d'Utilisation ont pour objet de définir les règles d'accès, de navigation et d'utilisation de la plateforme WoxxApp (accessible à l'adresse https://woxxapp.de) et des outils de gestion mis à disposition des commerçants et administrateurs.

---

### Article 2 — Création de Compte & Sécurité des Identifiants
1. L'accès aux fonctionnalités d'administration nécessite la création d'un compte utilisateur authentifié.
2. L'Utilisateur est seul responsable de la préservation de la confidentialité de ses identifiants de connexion (adresse email et mot de passe). Toute action effectuée depuis son compte est réputée avoir été effectuée par lui-même.
3. En cas de perte, de vol ou de compromission suspectée de ses identifiants, l'Utilisateur doit immédiatement procéder au renouvellement de son mot de passe ou contacter le support technique à l'adresse support@woxxapp.de.

---

### Article 3 — Règles d'Usage Acceptable & Engagements de l'Utilisateur
L'Utilisateur s'engage formellement à utiliser la plateforme WoxxApp dans le respect scrupuleux des lois et règlements en vigueur. Il s'interdit notamment :
- De diffuser des contenus illicites, diffamatoires, injurieux, violents, pédopornographiques, contrefaisants ou incitant à la haine ;
- De commercialiser des produits prohibés ou réglementés sans disposer des autorisations et licences requises par la législation française et européenne ;
- De tenter d'altérer, de surcharger ou de compromettre la sécurité, l'intégrité ou le bon fonctionnement des clusters et serveurs Kubernetes hébergeant WoxxApp ;
- D'effectuer du phishing, du spamming ou toute collecte frauduleuse de données personnelles.

---

### Article 4 — Suspension & Résiliation pour Manquement
WoxxApp se réserve le droit d'interrompre immédiatement et sans préavis l'accès aux services, voire de suspendre l'Ingress et le conteneur du site incriminé, en cas de manquement grave de l'Utilisateur aux présentes règles ou sur réquisition des autorités judiciaires compétentes.

---

### Article 5 — Évolution des Services et Maintenance
WoxxApp s'efforce d'assurer une disponibilité continue de la plateforme. Des opérations de maintenance corrective ou évolutive peuvent être réalisées avec un préavis raisonnable. WoxxApp ne saurait être tenue pour responsable des éventuels ralentissements ou interruptions temporaires liés à ces interventions techniques.` 
    },
    { 
      key: 'policy_cgv', 
      value: `# Conditions Générales de Vente (CGV) — WoxxApp V2

**Date d'entrée en vigueur : 1er Janvier 2026**

### Article 1 — Objet & Champ d'application
Les présentes Conditions Générales de Vente (ci-après les « CGV ») régissent l'ensemble des relations contractuelles entre la société **WoxxApp SAS** (ci-après « WoxxApp » ou « le Prestataire ») et tout professionnel, commerçant, artisan ou personne morale (ci-après « le Client ») souscrivant aux services de création, de déploiement conteneurisé et d'hébergement SaaS de sites web vitrines et boutiques e-commerce proposés sur la plateforme https://woxxapp.de.

Toute souscription à un abonnement ou service complémentaire implique l'adhésion entière, préalable et sans réserve du Client aux présentes CGV, à l'exclusion de tout autre document.

---

### Article 2 — Description des Services SaaS & Déploiement
WoxxApp met à la disposition du Client une solution logicielle en mode SaaS (Software as a Service) comprenant :
1. **Le Socle Vitrine & Click & Collect** : Création instantanée d'un site web vitrine responsive avec présentation de l'établissement, horaires, formulaire de contact et module de retrait de commandes sans paiement en ligne.
2. **L'Hébergement Dédié Cloud Kubernetes** : Déploiement automatisé d'un conteneur applicatif isolé par Namespace, d'une base de données dédiée et d'un certificat de sécurité SSL/TLS Let's Encrypt avec renouvellement automatique.
3. **Les Modules Optionnels à la carte** :
   - *Module Vente & E-commerce* : Gestion de catalogue, paniers d'achat, variantes et encaissement sécurisé par carte bancaire via la passerelle WoxxPay / Stripe (frais de transaction applicables de 2%).
   - *Module Expédition & Frais de Port* : Calcul dynamique des frais de livraison et interconnexion avec les transporteurs (Colissimo, Mondial Relay, Chronopost).
   - *Module Nom de Domaine Personnalisé* : Routage de nom de domaine propre (.fr, .com, etc.) sur le cluster WoxxApp.

---

### Article 3 — Tarification, Durée d'Engagement & Facturation
#### 3.1 Grille Tarifaire
Les tarifs des abonnements sont indiqués en Euros Hors Taxes (€ HT) et s'établissent comme suit :
- **Formule Annuelle (Sérénité)** : 150,00 € HT / an (soit l'équivalent de 12,50 € HT / mois, avec 2 mois offerts).
- **Formule Mensuelle** : 15,00 € HT / mois.
- **Option Vente E-commerce** : + 300,00 € HT / an ou + 30,00 € HT / mois (+ 2% commission transaction).
- **Option Transport / Expédition** : + 300,00 € HT / an ou + 30,00 € HT / mois.

#### 3.2 Engagement Contractuel
La souscription aux services WoxxApp est conclue pour une période minimale ferme d'**un (1) an**. L'abonnement est ensuite reconduit tacitement par périodes successives d'un an, sauf dénonciation effectuée au moins trente (30) jours avant l'échéance annuelle depuis l'espace client.

#### 3.3 Modalités de Paiement & Factures
Le règlement s'effectue par carte bancaire de manière sécurisée via la passerelle de paiement WoxxPay. Les factures électroniques sont mises à disposition dans l'espace d'administration du Client et archivées pendant dix (10) ans conformément à l'Article L123-22 du Code de Commerce.

---

### Article 4 — Droit de Rétractation
Conformément aux dispositions de l'article L.221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats conclus entre professionnels, ni aux prestations de services pleinement exécutées avant la fin du délai de rétractation ou portant sur la fourniture de contenus numériques sans support matériel dont l'exécution a commencé avec l'accord préalable exprès du Client. Le déploiement de l'instance Kubernetes étant opéré immédiatement après validation du paiement, aucun remboursement ne pourra être exigé pour la période entamée.

---

### Article 5 — Propriété Intellectuelle & Données du Client
1. **Données & Contenus du Client** : Le Client demeure le propriétaire exclusif de l'ensemble des données, textes, photographies, catalogues de produits, marques, logos et fichiers qu'il intègre sur son site web. WoxxApp ne revendique aucun droit de propriété sur ces éléments.
2. **Plateforme & Code Source WoxxApp** : La structure générale, les logiciels, images de conteneurs, architectures Kubernetes, chartes graphiques et composants logiciels constitutifs de la plateforme WoxxApp restent la propriété intellectuelle exclusive et inaliénable de WoxxApp SAS.

---

### Article 6 — Niveau de Service (SLA) & Responsabilité
WoxxApp s'engage à apporter tout le soin raisonnablement possible à la fourniture d'un service de haute disponibilité (objectif de disponibilité de 99,9% annuel hors fenêtres de maintenance programmée). 

La responsabilité de WoxxApp ne saurait être engagée en cas de force majeure, d'interruption imputable aux réseaux de télécommunication tiers, ou d'utilisation illicite ou frauduleuse des services par le Client ou ses utilisateurs finaux. En tout état de cause, le montant total des dommages et intérêts auquel WoxxApp pourrait être condamnée est expressément plafonné aux sommes effectivement perçues au titre de l'abonnement au cours des douze (12) derniers mois.

---

### Article 7 — Droit Applicable & Juridiction Compétente
Les présentes CGV sont soumises au droit français. En cas de litige relatif à l'interprétation, la conclusion ou l'exécution du contrat, les parties s'engagent à rechercher préalablement une solution amiable. À défaut d'accord dans un délai de trente (30) jours, compétence expresse est attribuée aux Tribunaux compétents du ressort de la Cour d'Appel de Paris.` 
    },
    { 
      key: 'policy_legal', 
      value: `# Mentions Légales

### 1. Éditeur de la Plateforme
Le site et les services **WoxxApp V2** (https://woxxapp.de) sont édités et exploités par :
- **Raison sociale** : WoxxApp SAS
- **Forme juridique** : Société par Actions Simplifiée (SAS) au capital de 10 000 €
- **Siège social** : 10 Rue de la Paix, 75001 Paris, France
- **Numéro SIRET** : 123 456 789 00012
- **Numéro de TVA Intracommunautaire** : FR 12 345678900
- **Directeur de la Publication** : Fabrice (Président Directeur Général)
- **Contact Électronique** : contact@woxxapp.de
- **Support Client** : support@woxxapp.de

---

### 2. Hébergement de l'Infrastructure Cloud
L'infrastructure informatique, les bases de données et les clusters Kubernetes orchestrant WoxxApp sont hébergés au sein de l'Union Européenne par :
- **Hébergeur Cloud** : Hetzner Online GmbH
- **Adresse de l'Hébergeur** : Industriestr. 25, 91710 Gunzenhausen, Allemagne
- **Localisation des Datacenters** : Nuremberg & Falkenstein (Allemagne, Union Européenne)
- **Certification** : ISO/IEC 27001

---

### 3. Propriété Intellectuelle
L'ensemble des éléments constituant la plateforme WoxxApp (notamment marques, logos, graphismes, logiciels, interfaces utilisateurs, documentations et architectures conteneurisées) sont protégés par le Code de la propriété intellectuelle et demeurent la propriété exclusive de WoxxApp SAS. Toute reproduction, représentation, modification ou diffusion totale ou partielle sans autorisation écrite préalable est strictement interdite.` 
    },
    { 
      key: 'policy_gdpr', 
      value: `# Politique de Protection des Données Personnelles (RGPD)

**Conforme au Règlement Général sur la Protection des Données (UE 2016/679) et à la Loi Informatique et Libertés.**

### 1. Responsable du Traitement
Le responsable du traitement des données à caractère personnel collectées sur la plateforme WoxxApp est la société **WoxxApp SAS**, représentée par son Délégué à la Protection des Données (DPO).
- **Contact DPO** : dpo@woxxapp.de

---

### 2. Données Collectées & Finalités du Traitement
WoxxApp collecte uniquement les données strictement nécessaires aux finalités suivantes :
1. **Gestion des comptes clients & Authentification** : Nom, prénom, adresse email professionnelle, mot de passe sécurisé haché (bcrypt). *Base légale : Exécution du contrat (Art. 6.1.b RGPD).*
2. **Facturation & Comptabilité légale** : Coordonnées postales, numéro de TVA, historique des transactions et factures générées. *Base légale : Obligation légale (Art. 6.1.c RGPD & Art. L123-22 du Code de Commerce).*
3. **Provisioning technique & Déploiement K8s** : Nom de domaine/sous-domaine, logs techniques d'accès et d'erreurs pour la sécurité du cluster. *Base légale : Intérêt légitime et sécurité des systèmes (Art. 6.1.f RGPD).*

---

### 3. Durée de Conservation des Données
- **Données relatives au compte actif** : Conservées pendant toute la durée de la relation contractuelle, puis archivées pendant 3 ans à des fins probatoires.
- **Documents et Factures comptables** : Conservés pendant une durée impérative de **dix (10) ans** à compter de la clôture de l'exercice comptable, conformément aux obligations de l'Article L123-22 du Code de Commerce.
- **Logs techniques et de sécurité** : Conservés pour une durée maximale de douze (12) mois.

---

### 4. Vos Droits & Modalités d'Exercice
Conformément au RGPD, vous disposez des droits suivants concernant vos données :
- **Droit d'accès (Art. 15)** et **Droit de rectification (Art. 16)**.
- **Droit à l'effacement (Art. 17)** : Demande de suppression réalisable directement depuis votre espace profil ou par email à dpo@woxxapp.de (hors factures soumises à conservation légale).
- **Droit à la portabilité (Art. 20)** : Export intégral de vos données au format JSON structuré depuis votre tableau de bord.
- **Droit d'opposition et de limitation (Art. 18 & 21)**.

Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés — www.cnil.fr).` 
    },
    { 
      key: 'policy_cookies', 
      value: `# Politique de Gestion des Cookies & Traceurs

### 1. Qu'est-ce qu'un Cookie ?
Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone) lors de la consultation d'un site web.

---

### 2. Cookies Utilisés sur WoxxApp
1. **Cookies Strictement Nécessaires (Fonctionnels)** :
   - *woxx_token* : Cookie sécurisé HttpOnly permettant de maintenir votre session de connexion active. Ce cookie est indispensable au fonctionnement du service et ne requiert pas de consentement préalable conformément aux recommandations de la CNIL.
2. **Cookies de Mesure d'Audience (Google Analytics GA4)** :
   - Utilisés pour mesurer la fréquentation, les pages vues et l'ergonomie de la plateforme.
   - **Consentement préalable requis** : Ces cookies ne sont activés que si vous cliquez sur « Accepter » dans le bandeau de cookies.

---

### 3. Durée de Conservation & Gestion du Consentement
Les cookies ont une durée de validité maximale de treize (13) mois. Vous pouvez à tout moment modifier vos préférences ou retirer votre consentement depuis les paramètres de votre navigateur ou le lien en bas de page.` 
    },
  ];

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
