---
title: "Zappy - Jeu Multijoueur Réseau & IA"
date: 2024-11-01T10:00:00Z
image: /images/post/post-8.png
categories: ["Réseau & Cybersécurité", "Intelligence Artificielle"]
featured: false
draft: false
---

## Présentation
**Zappy** est l'un des projets phares de la deuxième année, impliquant la création d'un écosystème de jeu multijoueur en réseau. Des équipes d'Intelligences Artificielles (bots) s'affrontent sur une planète (Trantor) pour collecter des ressources et atteindre le niveau d'élévation maximum. Le projet exige le développement de trois entités distinctes : un Serveur (en C) gérant la logique du monde, un Client IA autonome pilotant les joueurs, et un Client Graphique (en C++) permettant d'observer la partie en temps réel.

## Technologies & Compétences
- **Programmation Réseau (Sockets TCP/IP)** : Développement d'un serveur robuste en C gérant des dizaines de connexions simultanées via du multiplexage non-bloquant (`poll`, `select`) et des buffers circulaires.
- **Architecture Client-Serveur** : Mise en place d'un protocole de communication texte strict entre le serveur, les IA et l'interface graphique.
- **Intelligence Artificielle (IA)** : Création d'agents autonomes capables de prendre des décisions (explorer, se nourrir, s'élever, communiquer par broadcast, se reproduire) via des machines à états ou des arbres de comportement.
- **Programmation Graphique (C++ & SFML)** : Développement d'un client graphique (GUI) permettant de modéliser et de visualiser les actions du serveur de manière fluide et asynchrone (génération de tuiles, animations des joueurs, météo/ressources).

*Projet réalisé durant ma 2ème année à Epitech (Tek2).*
