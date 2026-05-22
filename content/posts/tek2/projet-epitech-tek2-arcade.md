---
title: "Arcade - Plateforme de Jeux Rétro Extensible"
date: 2024-10-01T10:00:00Z
image: /images/post/post-7.png
categories: ["Architecture Logicielle & POO", "Jeux Vidéo"]
featured: false
draft: false
---

## Présentation
**Arcade** est une plateforme de jeux d'arcade modulaire développée en C++. L'objectif de ce projet d'envergure est de concevoir un système central ("Core") capable de charger dynamiquement des jeux (Snake, Pacman, etc.) et des bibliothèques graphiques (nCurses, SDL2, SFML) au moment de l'exécution (Run-time). L'utilisateur peut ainsi changer de jeu ou de moteur d'affichage en plein milieu d'une partie sans jamais relancer le programme.

## Technologies & Compétences
- **Bibliothèques Dynamiques (Shared Libraries)** : Utilisation poussée de l'API POSIX (`dlopen`, `dlsym`, `dlclose`) pour encapsuler et charger des bibliothèques partagées (`.so`) à l'exécution, rendant le système 100% plug-and-play.
- **Architecture Logicielle & Abstraction** : Conception d'interfaces génériques et abstraites garantissant la séparation totale entre la logique du jeu (Game Logic) et le rendu visuel (Graphics/Rendering).
- **C++ Avancé & Polymorphisme** : Utilisation intensive du polymorphisme, de l'héritage et des design patterns pour standardiser l'intégration des différents modules développés par d'autres équipes.
- **Développement de Jeux (Game Dev)** : Implémentation des règles strictes de classiques de l'arcade (ex: Nibbler, Snake, Pacman) incluant la gestion du temps, de la physique de base, des collisions et d'un système de scoring.

*Projet réalisé durant ma 2ème année à Epitech (Tek2).*
