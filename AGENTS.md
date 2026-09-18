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
