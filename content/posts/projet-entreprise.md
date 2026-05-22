---
title: "Système de Feedback Passagers en Temps Réel"
date: 2026-05-22T13:00:00Z
duration: "08 Avril - 10 Mai 2026"
image: /images/post/post-4.png
categories: ["Projets d'Entreprise"]
featured: true
draft: false
gallery:
  - "/images/post/post-4.png"
  - "/images/post/post-1.png"
  - "/images/post/post-2.png"
  - "/images/post/post-3.png"
---

## Contexte

Dans le cadre de mon stage à la Société des Aéroports du Bénin (SAB), j'ai eu à développer un système de collecte des informations et des avis des passagers à l'Aéroport International de Cotonou. L'objectif était de moderniser le processus de collecte des informations et des avis des passagers, qui était auparavant fait à l'aide de formulaires papier, et de fournir aux décideurs des données fiables et en temps réel pour améliorer la qualité des services.

## Objectifs du Projet

La conception de ce système répondait à plusieurs défis stratégiques et opérationnels :

1. **Simplification du parcours passager (Scan & Feedback)** : 
Grâce à des QR codes stratégiquement disposés dans les différentes zones de l'aéroport, les voyageurs peuvent donner leur avis instantanément et renseigner leurs informations depuis leur propre smartphone, sans friction.
2. **Accessibilité et ergonomie** : Offrir une interface web mobile moderne, rapide et accessible sur tous types de terminaux (smartphones, tablettes).
3. **Sécurité et fiabilité des données** : Garantir la confidentialité des informations saisies et assurer une parfaite traçabilité des retours pour éviter les doublons ou falsifications.
4. **Analyse décisionnelle en temps réel** : Permettre à la direction de visualiser instantanément les indicateurs clés de satisfaction pour réagir rapidement aux besoins des usagers.
5. **Centralisation de la gestion** : Structurer un tableau de bord intuitif pour centraliser, filtrer et analyser l'ensemble des feedbacks collectés.

## Technologies Utilisées

Pour réaliser ce projet, j'ai utilisé les technologies suivantes :

* **Frontend** : Next.js / React / TypeScript
* **Backend** : PHP
* **Base de données** : MySQL

## Fonctionnalités

Le système de feedback passagers offre plusieurs fonctionnalités pour répondre aux besoins identifiés :

### Interface Passagers

* **Formulaire de feedback** : Formulaire intuitif pour collecter les avis des passagers.
* **Système de notation** : Évaluation de différents services de l'aéroport (accueil, sécurité, propreté, etc.).
* **Ajout de commentaires** : Possibilité pour les passagers de laisser des commentaires écrits détaillés.
* **Informations contextuelles** : Collecte d'informations telles que la date, l'heure, la provenance et la destination du vol.
* **Confidentialité** : Option pour les passagers de garder leurs informations confidentielles.

### Tableau de Bord (Pour les administrateurs)

* **Visualisation des indicateurs clés** : Statistiques en temps réel sur la satisfaction des passagers.
* **Filtrage des données** : Possibilité de filtrer les avis par date, vol, service, etc.
* **Gestion des avis** : Interface pour visualiser, traiter et répondre aux avis.
* **Historique complet** : Accès à tous les avis collectés depuis le déploiement.
