---
title: "Octopus - Gestion de Configuration avec Ansible"
date: 2025-03-01T10:00:00Z
image: /images/post/post-1.png
categories: ["DevOps & Infrastructure", "Administration Système"]
featured: true
draft: false
---

## Présentation
**Octopus** est un projet d'infrastructure DevOps dont le but est d'automatiser le déploiement d'une architecture applicative microservices distribuée. Le défi consistait à déployer une application de vote complète (Web client, Worker, Base de données) sur 5 machines virtuelles distinctes sous Debian, en utilisant exclusivement **Ansible** (sans utiliser de technologies de conteneurisation comme Docker).

## Technologies & Compétences
- **Ansible (Configuration Management)** : Écriture de *Playbooks* et création de *Roles* Ansible (base, redis, postgresql, poll, worker, result) pour automatiser l'installation et la configuration complète d'un parc de serveurs.
- **Idempotence & Scalabilité** : Conception de scripts garantissant l'idempotence (le fait de relancer le script ne modifie plus l'état si l'infrastructure est déjà conforme).
- **Administration Système (Linux)** : Gestion des services avec `systemd` (démarrage automatique, variables d'environnement), installation sécurisée de paquets et configuration réseau.
- **Déploiement d'une architecture multi-tiers** :
  - **Base de données** : PostgreSQL 16 sécurisé (gestion des permissions et schémas).
  - **Message Broker** : Redis pour gérer les files d'attente (queues) de manière asynchrone.
  - **Microservices** : Déploiement et liaison réseau sécurisée entre des services hétérogènes (Python/Flask, Java, Node.js).

*Projet réalisé durant ma 2ème année à Epitech (Tek2).*
