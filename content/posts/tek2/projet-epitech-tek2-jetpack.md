---
title: "Jetpack - Jeu Réseau Multijoueur"
date: 2025-01-01T10:00:00Z
image: /images/post/post-4.png
categories: ["Réseau & Cybersécurité", "Programmation C++"]
featured: false
draft: false
---

## Présentation
**Jetpack** est un jeu réseau multijoueur (2 joueurs) inspiré du célèbre Jetpack Joyride. Entièrement développé en C++, le projet se divise en deux parties : un serveur de jeu autoritaire et un client graphique. Le défi principal consistait à concevoir de zéro notre propre protocole de communication TCP et à le documenter sous forme de RFC, tout en gérant la synchronisation en temps réel des joueurs sur la carte (collisions, score, gravité).

## Technologies & Compétences
- **Programmation C++** : Utilisation avancée du C++ pour développer à la fois le serveur et le client.
- **Conception de Protocole Réseau (TCP)** : Création d'un protocole d'échange de paquets sur mesure (texte ou binaire) gérant le matchmaking, les actions des joueurs et la réconciliation d'état. Rédaction d'une documentation technique rigoureuse au format RFC.
- **Multiplexage & Multi-threading** : 
  - *Côté Serveur* : Gestion de la concurrence réseau de manière asynchrone via `poll` pour garantir la non-bloquance des actions.
  - *Côté Client* : Utilisation de threads (`std::thread`) pour séparer totalement la logique réseau (mise à jour de l'état partagé) du moteur de rendu graphique.
- **Développement de Jeu (Game Logic)** : Parsing de carte (Map), calcul des collisions (pièces, obstacles électriques), gestion de la physique, et synchronisation stricte où le serveur valide systématiquement les actions pour empêcher la triche (Server-Authoritative).

*Projet réalisé durant ma 2ème année à Epitech (Tek2).*
