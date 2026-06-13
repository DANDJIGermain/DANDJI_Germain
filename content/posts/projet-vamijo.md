---
title: "VAMIJO — Application Mobile de Covoiturage"
description: "Développement intégral (Mobile Flutter & Backend DevSecOps) de la première plateforme de covoiturage sécurisée au Bénin et au Togo."
date: 2026-05-25T12:00:00Z
duration: "2025 - 2026"
image: /images/projects/vamijo-cover.png
categories: ["Développement", "Mobile", "DevOps"]
featured: false
draft: false
link: "https://vamijo.vercel.app/"
gallery:
  - "/images/projects/vamijo-cover.png"
---

## Contexte du Projet

En tant que **Développeur Full-Stack & Mobile Indépendant**, j'ai conçu et développé de A à Z l'intégralité du projet **VAMIJO**, la première application mobile de covoiturage 100% sécurisée dédiée aux trajets au Bénin. 
Face aux défis de transport en Afrique de l'Ouest, l'objectif était de créer une solution technologique de bout en bout qui connecte conducteurs et passagers, tout en garantissant des transactions financières locales sécurisées et une expérience utilisateur irréprochable. J'ai assumé l'entière responsabilité technique du projet, du développement natif de l'application mobile jusqu'au déploiement de l'infrastructure cloud haute disponibilité.

---

## Objectifs de l'Application

La plateforme devait résoudre des problèmes majeurs de mobilité et de sécurité, répondant aux exigences suivantes :
- **Expérience Mobile Premium** : Offrir une application iOS et Android fluide, intuitive et rapide pour la réservation et la publication de trajets.
- **Sécurité et Confiance** : Implémenter un système strict de vérification des profils, de suivi en temps réel et de notation obligatoire.
- **Paiements Locaux** : Intégrer de manière fluide et sécurisée les solutions de paiement Mobile Money locales (MTN, Moov, Celtiis).
- **Modèle Économique Transparent** : Gérer la gratuité absolue pour les passagers et automatiser le calcul et le prélèvement de la commission de 5% par réservation pour les conducteurs.

---

## Réalisations Techniques & Fonctionnalités

J'ai piloté et réalisé l'intégralité de la conception, du développement et de la mise en production :

### Développement Mobile (Frontend Flutter)
- Conception et développement complet de l'application mobile multiplateforme (iOS & Android) avec **Flutter**.
- Création d'une interface utilisateur (UI/UX) moderne, réactive et adaptée aux réalités des connexions mobiles africaines.
- Gestion d'état complexe, intégration de la géolocalisation en temps réel et des notifications push.

### Backend & Architecture Cloud (DevSecOps)
- Développement d'un backend robuste et d'API RESTful performantes pour servir l'application mobile.
- **Architecture Cloud** : Configuration et déploiement des serveurs sur **DigitalOcean** pour assurer la scalabilité lors des pics de trafic.
- **Haute Disponibilité** : Création d'un mécanisme de "Keep-Alive" personnalisé (spécialement pour les environnements Render) garantissant un temps de réponse instantané (Zero-Downtime) aux utilisateurs.
- **SecOps** : Sécurisation absolue des flux financiers et des données utilisateurs via une séparation stricte des variables d'environnement (Développement vs Production) et le chiffrement des communications.

### Déploiement et CI/CD
- Automatisation complète des processus d'intégration et de déploiement continus (CI/CD) pour permettre des mises à jour fluides sur le Google Play Store et l'App Store.
- Déploiement de la vitrine web et du portail d'administration sur Vercel.

---

## Stack Technique & Architecture

- **Application Mobile** : Flutter (Dart)
- **Backend & API** : Node.js (Express/NestJS)
- **Base de Données** : PostgreSQL / MongoDB
- **Infrastructure Cloud** : DigitalOcean, Render
- **Pratiques DevOps** : CI/CD, Docker, Keep-Alive, SecOps
- **Déploiement Web** : Vercel

---

## Découvrir le Projet

L'infrastructure, la vitrine et l'application Vamijo représentent un aboutissement technique majeur, prêt à révolutionner le transport sous-régional. 

**Découvrir le site officiel de l'application** : [Vamijo (Vitrine)](https://vamijo.vercel.app/)
