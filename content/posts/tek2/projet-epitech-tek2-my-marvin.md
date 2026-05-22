---
title: "My Marvin - Automatisation CI/CD avec Jenkins"
date: 2025-02-01T10:00:00Z
image: /images/post/post-10.png
categories: ["DevOps & Infrastructure", "Automatisation"]
featured: false
draft: false
---

## Présentation
**My Marvin** est un projet DevOps axé sur l'automatisation de l'intégration et du déploiement continus (CI/CD). L'objectif était de déployer et de configurer une plateforme Jenkins de A à Z, uniquement via des fichiers de configuration, afin d'automatiser les tests de nos dépôts Git et la création de jobs (pipelines).

## Technologies & Compétences
- **Configuration as Code (JCasC)** : Utilisation de fichiers YAML pour définir et provisionner l'intégralité de l'instance Jenkins sans aucune interaction manuelle avec l'interface graphique.
- **Job DSL (Groovy)** : Écriture de scripts Groovy (Job Domain Specific Language) pour créer dynamiquement des jobs d'intégration automatisés (clonage de repo, build avec Make, lancement de tests).
- **Sécurité & RBAC** : Gestion fine des rôles et des autorisations (Role-Based Access Control). Création de profils sécurisés (admin, assistant, etc.) et protection des mots de passe via des variables d'environnement.
- **Automatisation CI/CD** : Mise en place des fondations d'une chaîne DevOps robuste, capable de tester de multiples projets à chaque `push` de manière autonome.

*Projet réalisé durant ma 2ème année à Epitech (Tek2).*
