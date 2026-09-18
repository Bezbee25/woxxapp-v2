export interface LegalPolicy {
  slug: string;
  title: string;
  content: string;
}

export const DEFAULT_LEGAL_POLICIES: Record<string, LegalPolicy> = {
  cgu: {
    slug: 'cgu',
    title: "Conditions Générales d'Utilisation (CGU)",
    content: `# Conditions Générales d'Utilisation (CGU) — Plateforme WoxxApp

### 1. Objet et Présentation du Service
Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation de la plateforme logicielle **WoxxApp V2**, éditée par **WoxxApp SAS**. 
WoxxApp V2 fournit aux professionnels indépendants, commerçants, artisans et entreprises un écosystème SaaS hébergé pour créer, administrer et personnaliser leur boutique en ligne ou site vitrine avec des modules métiers activables à la demande.

### 2. Accès aux Services et Gestion de Compte
L'accès à l'espace d'administration nécessite la création préalable d'un compte professionnel. L'utilisateur s'engage à :
- Fournir des informations véridiques, exactes et tenues à jour (dénomination sociale, numéro SIRET, adresse de facturation).
- Préserver la stricte confidentialité de ses identifiants et clés d'accès sécurisées (WoxxPay API Key). Toute action réalisée depuis son compte est réputée effectuée sous sa responsabilité exclusive.
- Notifier sans délai l'équipe support en cas d'accès suspect ou de compromission de ses accès.

### 3. Engagements et Obligations des Utilisateurs
L'utilisateur s'interdit d'exploiter la plateforme WoxxApp pour :
- Diffuser des contenus contraires à l'ordre public, aux bonnes mœurs, frauduleux, illicites ou contrefaisants.
- Proposer à la vente des produits ou services prohibés par les réglementations françaises et européennes.
- Tenter d'entraver le bon fonctionnement, la sécurité ou la disponibilité de l'infrastructure Kubernetes et des clusters sous-jacents.

### 4. Disponibilité du Service et SLA
WoxxApp met en œuvre tous les moyens raisonnables pour garantir une disponibilité minimale de service de **99,9%** sur base mensuelle. Des opérations de maintenance planifiée peuvent être menées après notification préalable sur le tableau de bord ou par email.

### 5. Propriété Intellectuelle
La structure générale du logiciel WoxxApp, le code source, les designs graphiques, composants Neo-Brutalist et marques associées sont la propriété exclusive de WoxxApp SAS. L'utilisateur demeure propriétaire exclusif de l'ensemble de ses données métiers, logos, images et catalogues de produits déposés sur son espace.

### 6. Loi Applicable et Juridiction
Les présentes CGU sont régies par le droit français. En cas de différend non résolu à l'amiable, les tribunaux compétents du ressort du siège social de WoxxApp SAS seront seuls compétents.`,
  },

  cgv: {
    slug: 'cgv',
    title: 'Conditions Générales de Vente (CGV)',
    content: `# Conditions Générales de Vente (CGV) — Offres SaaS WoxxApp

### 1. Champ d'Application et Offres
Les présentes Conditions Générales de Vente s'appliquent à tous les contrats d'abonnement SaaS, licences logicielles et modules complémentaires conclus entre **WoxxApp SAS** et ses clients professionnels.

### 2. Tarifs, Facturation et Modalités de Paiement
- **Formule Mensuelle** : Facturée 15,00 € HT/mois par prélèvement ou carte bancaire, payable d'avance.
- **Formule Annuelle** : Facturée 150,00 € HT/an (soit 2 mois offerts), payable d'avance à la souscription.
- **Paiements Sécurisés** : Toutes les transactions sont opérées de manière chiffrée via la passerelle de paiement **WoxxPay**. Les factures conformes à l'article L123-22 du Code de commerce sont générées automatiquement et archivées sur l'espace client.
- **Régime Fiscal** : Les prix s'entendent hors taxes (HT). La TVA applicable ou la mention d'exonération (selon statut fiscal du vendeur) est détaillée sur chaque facture.

### 3. Durée du Contrat et Résiliation
- L'abonnement mensuel est conclu pour une durée d'un mois renouvelable tacitement. Il peut être résilié à tout moment depuis le tableau de bord client avec effet à la fin du cycle en cours.
- L'abonnement annuel est conclu pour une période ferme de 12 mois. En cas de résiliation anticipée en cours d'année, les sommes payées d'avance restent acquises à WoxxApp SAS.

### 4. Exclusion du Droit de Rétractation entre Professionnels
Conformément aux dispositions de l'article L221-3 et L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats conclus entre professionnels et portant sur des services logiciels immédiatement mis à disposition ou personnalisés.

### 5. Responsabilité et Garanties
WoxxApp SAS garantit la conformité des modules logiciels aux descriptions techniques publiées. La responsabilité de WoxxApp SAS ne saurait être engagée pour des pertes indirectes d'exploitation commerciale résultant d'une mauvaise configuration imputable à l'utilisateur. En tout état de cause, le montant maximum des dommages et intérêts exigibles est plafonné au montant annuel total facturé au client.`,
  },

  legal: {
    slug: 'legal',
    title: 'Mentions Légales',
    content: `# Mentions Légales

### 1. Éditeur de la Plateforme
- **Raison Sociale** : WoxxApp SAS
- **Forme Juridique** : Société par Actions Simplifiée (SAS) au capital de 10 000 €
- **Siège Social** : 10 Rue de la Paix, 75001 Paris, France
- **Numéro SIREN / SIRET** : 123 456 789 00012
- **Numéro TVA Intracommunautaire** : FR12345678900
- **Directeur de la Publication** : Direction Générale WoxxApp SAS
- **Contact Email** : contact@woxxapp.de

### 2. Hébergement de l'Infrastructure
- **Hébergeur Cloud** : Hetzner Online GmbH
- **Adresse de l'Hébergeur** : Industriestr. 25, 91074 Gunzenhausen, Allemagne
- **Localisation des Données** : Centres de données hautement sécurisés situés au sein de l'Union Européenne (Allemagne / Finlande) répondant aux normes ISO/IEC 27001.

### 3. Propriété Intellectuelle et Crédits
L'ensemble des marques, logos, graphismes, interfaces Neo-Brutalist et codes sources composant la plateforme WoxxApp constituent des œuvres protégées par le Code de la propriété intellectuelle. Toute reproduction intégrale ou partielle sans autorisation expresse écrite de l'éditeur est formellement interdite.`,
  },

  gdpr: {
    slug: 'gdpr',
    title: 'Politique de Protection des Données Personnelles (RGPD)',
    content: `# Politique de Confidentialité & RGPD — WoxxApp

### 1. Responsable du Traitement des Données
Le responsable du traitement des données à caractère personnel collectées sur la plateforme est **WoxxApp SAS**, joignable à l'adresse : \`privacy@woxxapp.de\` ou par courrier au siège social.

### 2. Données Collectées et Finalités
Nous collectons uniquement les données strictement nécessaires :
- **Gestion des comptes & Authentification** : Email professionnel, nom et prénom, mot de passe chiffré (Argon2/bcrypt), rôle d'accès.
- **Gestion commerciale & Facturation** : Dénomination commerciale, SIRET, adresse de facturation, historique des transactions et factures.
- **Support & Communication** : Échanges avec le support client, logs techniques d'audit et de sécurité.

### 3. Base Juridique des Traitements
Les données sont traitées dans le cadre de :
- L'exécution du contrat d'abonnement SaaS (Art. 6.1.b du RGPD).
- Le respect de nos obligations légales comptables et fiscales (Art. 6.1.c du RGPD).
- Notre intérêt légitime à sécuriser nos infrastructures et prévenir la fraude (Art. 6.1.f du RGPD).

### 4. Durée de Conservation des Données
- **Données de compte actif** : Conservées pendant toute la durée de la relation contractuelle, puis archivées 3 ans à compter de la fin du contrat.
- **Factures et pièces comptables** : Conservées pendant **10 ans** conformément à l'article L123-22 du Code de commerce.
- **Logs de connexion et sécurité** : Conservés 1 an maximum conformément aux exigences légales.

### 5. Vos Droits Informatique et Libertés
Conformément au Règlement Général sur la Protection des Données (RGPD 2016/679), vous disposez des droits suivants sur vos données :
- Droit d'accès, de rectification et d'effacement.
- Droit à la limitation du traitement et à la portabilité des données.
- Droit d'opposition pour motif légitime.
Pour exercer ces droits, contactez notre Délégué à la Protection des Données par email à \`privacy@woxxapp.de\`. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).`,
  },

  cookies: {
    slug: 'cookies',
    title: 'Politique de Gestion des Cookies & Traceurs',
    content: `# Politique de Gestion des Cookies & Traceurs

### 1. Qu'est-ce qu'un Cookie ?
Un cookie est un fichier texte déposé sur votre terminal lors de la consultation d'un site web. Il permet de mémoriser vos préférences et de sécuriser votre navigation.

### 2. Cookies Utilisés sur WoxxApp
- **Cookies Techniques & Strictement Nécessaires** (non soumis au consentement) :
  - Session d'authentification sécurisée (JWT / Token de session).
  - Préférences d'affichage et sélection de thèmes.
  - Protection anti-CSRF et sécurité réseau.
- **Cookies Analytiques & Mesure d'Audience** (soumis à consentement) :
  - Statistiques de visites anonymisées (Google Analytics 4 / Plausible).

### 3. Durée de Validité et Paramétrage
Les cookies de mesure d'audience ont une durée de validité maximale de **13 mois**. Vous pouvez à tout moment configurer votre navigateur pour accepter, refuser ou supprimer les cookies stockés sur votre appareil.`,
  },
};
