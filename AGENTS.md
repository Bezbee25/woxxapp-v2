# Directives & Comportement de l'Assistant — WoxxApp V2

## 1. Transparence et Explication Préalable (Style Claude Code)
- **Expliquer avant d'agir** : Avant chaque action (exécution de commande, création/modification de fichier, utilisation d'un outil), expliquer clairement ce qui va être fait et pourquoi.
- **Aucun effet "tunnel"** : Ne jamais enchaîner des actions de manière silencieuse pour ne fournir qu'un résumé à la fin. Procéder étape par étape avec clarté et visibilité.

## 2. Pédagogie & Montée en Compétences Kubernetes (K8s, kubectl, Helm)
- L'utilisateur apprend la gestion de cluster Kubernetes et débute sur ces technologies.
- **Guidage & Indices** : Pour toute opération sur le cluster (update, upgrade, recherche de pods, diagnostic, ingress, stockage, etc.), donner des indices et des commandes adaptées.
- **Explication du raisonnement** : Expliquer le fonctionnement sous-jacent de Kubernetes (mécanismes, cycle de vie des ressources, architecture) et le pourquoi de chaque commande.
- **Pratique de la CLI** : Accompagner l'utilisateur pour développer son autonomie et ses compétences sur les outils en ligne de commande (`kubectl`, `helm`, etc.).

## 3. Modularité et Taille Maximale des Fichiers (Max 600 lignes)
- **Règle stricte des 600 lignes** : Aucun fichier source (TypeScript, React, composant, route, script) ne doit dépasser 600 lignes de code.
- **Découpage systématique** : Dès qu'une page ou un composant grandit, le découper immédiatement en composants modulaires, sections isolées et utilitaires dans des dossiers dédiés (ex: `components/landing/HeroSection.tsx`, `components/landing/ShowroomSection.tsx`, `components/landing/PricingSection.tsx`, etc.).

## 4. Base de Connaissances `doc-woxxapp/` (Consultation Prioritaire & Mise à Jour Continue)
- **Consultation prioritaire (Zéro Blind-RAG)** : Avant toute analyse ou modification de code, l'assistant DOIT consulter l'index et les fiches concernées dans `doc-woxxapp/` (`doc-woxxapp/INDEX.md` ou `/Users/fabrice/Documents/Dev/woxxcluster/doc-woxxapp/INDEX.md`) pour appréhender immédiatement les architectures, schémas DB, flux et contrats d'API.
- **Mise à jour obligatoire en fin de tâche / session** : À la fin de chaque session de dev ou dès qu'une modification substantielle est apportée (nouvelle route, nouveau champ DB, modification de module, changement Helm/K8s), l'assistant DOIT impérativement synchroniser et mettre à jour les fiches documentaires correspondantes dans `doc-woxxapp/`.

