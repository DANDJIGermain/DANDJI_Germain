---
title: "Popeye — Architecture Microservices & Conteneurisation"
date: 2024-03-15T10:00:00Z
duration: "Février - Mars 2024"
image: /images/post/popeye/popeye.png
categories: ["DevOps"]
featured: true
draft: false
gallery:
  - "/images/post/popeye/popeye.png"
  - "/images/post/popeye/popeye1.png"
  - "/images/post/popeye/popeye2.png"
  - "/images/post/popeye/popeye3.png"
  - "/images/post/popeye/popeye4.png"
---

## Contexte du Projet

Le projet **Popeye** est un challenge technique emblématique du cursus **Epitech**, conçu pour initier et faire maîtriser les concepts fondamentaux du métier DevOps. L'objectif était de conteneuriser et d'orchestrer une application web de vote complexe composée de 5 microservices distincts, développés dans différents langages (Python, Node.js, Java).

Réalisé initialement en mars 2024, j'ai pris soin de ré-explorer ce projet en profondeur récemment pour maîtriser les rouages et les "vrais" concepts de Docker et de l'orchestration. Ce projet illustre ma capacité à gérer des architectures logicielles hétérogènes, à optimiser des processus de build, et à mettre en place des environnements isolés et sécurisés.

---

## Objectifs de l'Architecture

La mission consistait à déployer une application de vote en ligne (Cats vs Dogs) en respectant un cahier des charges strict :
- **Poll** (Python/Flask) : Interface web permettant aux utilisateurs de voter.
- **Redis** : File d'attente (broker) en mémoire pour recevoir temporairement les nouveaux votes.
- **Worker** (Java/Maven) : Service de traitement en arrière-plan qui consomme les votes depuis Redis pour les persister.
- **Database** (PostgreSQL) : Base de données relationnelle pour le stockage définitif.
- **Result** (Node.js/Express) : Interface web affichant les résultats des votes en temps réel.

---

## Réalisations Techniques & Fonctionnalités

J'ai piloté l'infrastructure de bout en bout en appliquant les meilleures pratiques DevOps :

### Conteneurisation (Dockerfiles)
- Conception d'images Docker spécifiques pour les environnements Python et Node.js, en utilisant des versions `alpine` pour minimiser le poids final et réduire la surface d'attaque.
- **Multi-stage Build** : Implémentation d'une construction en deux étapes pour le Worker Java. L'étape 1 utilise Maven pour compiler le code lourd, tandis que l'étape 2 (l'image finale de production) ne contient qu'un JRE léger pour exécuter l'application, optimisant drastiquement les performances et le stockage.

### Orchestration avec Docker Compose
- Création du fichier `docker-compose.yml` comme chef d'orchestre pour démarrer, lier et gérer le cycle de vie des 5 conteneurs simultanément.
- **Isolation Réseau Avancée** : Mise en place d'une architecture réseau sécurisée avec 3 réseaux virtuels isolés (`poll-tier`, `result-tier`, `back-tier`). Par exemple, l'interface publique de vote n'a aucun accès direct à la base de données.

### Sécurité & Persistance des Données
- **Gestion des Secrets** : Sécurisation du mot de passe de la base de données via un fichier d'environnement local (`.env`). Aucun identifiant sensible n'est écrit "en dur" ou poussé sur Git.
- **Volumes Docker** : Implémentation d'un volume nommé (`db-data`) pour garantir la persistance absolue des votes dans PostgreSQL, même si l'ensemble de l'infrastructure est détruite ou redémarrée.

---

## Stack Technique & DevOps

- **Développement** : Python (Flask), Node.js (Express), Java (Maven)
- **Data & Cache** : PostgreSQL, Redis
- **Infrastructure & Conteneurisation** : Docker, Podman, Docker Compose, Multi-stage Builds, Volumes persistants, Réseaux isolés (CNI).
