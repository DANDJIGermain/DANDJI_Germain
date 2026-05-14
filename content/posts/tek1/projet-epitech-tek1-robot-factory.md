---
title: "Robot Factory (Corewar) - Création d'un Assembleur en C"
date: 2024-08-01T10:00:00Z
image: /images/post/post-3.png
categories: ["Programmation Système", "Compilation"]
featured: true
draft: false
---

## Présentation
**Robot Factory** est la première partie du mythique projet *Corewar*. L'objectif était de développer un véritable assembleur (compilateur) de A à Z. Ce programme a pour but de traduire le code source de "champions" (écrits dans un langage d'assemblage spécifique) en code machine (bytecode hexadécimal) exécutable par une machine virtuelle.

## Technologies & Compétences
- **Stack Technique** : Langage C, Makefile, manipulation de descripteurs de fichiers (`open`, `read`, `write`, `lseek`).
- **Programmation Bas Niveau** : Compréhension profonde du langage assembleur, des instructions machine, des opcodes, et des différents types de registres (directs, indirects).
- **Manipulation de Bits & Endianness** : Encodage de paramètres dans des octets spécifiques (Bitwise operations) et gestion stricte du formatage de la mémoire en *Big Endian*.
- **Parsing Avancé** : Extraction des en-têtes (magic numbers), résolution dynamique d'adresses mémoires (labels) et vérification minutieuse de la syntaxe du code source.

*Projet réalisé durant ma 1ère année à Epitech (Tek1).*
