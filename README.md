# GitHub Finder 🔍

Application frontend permettant de rechercher des profils GitHub, visualiser leurs statistiques et sauvegarder des favoris.

## Fonctionnalités

- 🔍 Recherche de profils GitHub via l'API publique
- 👤 Affichage complet du profil (avatar, bio, stats, localisation)
- 📦 Affichage des repositories populaires
- ⭐ Système de favoris (ajouter, supprimer, recharger)
- 💾 Persistance des favoris via `localStorage`
- ⚠️ Gestion d'erreurs (404, limite API, réseau)
- ⏳ Indicateur de chargement pendant les requêtes

## Technologies

- HTML5 sémantique
- CSS3 (variables, Flexbox, responsive)
- JavaScript Vanilla (async/await, fetch, DOM)
- GitHub REST API publique

## Lancer le projet

```bash
git clone https://github.com/votre-username/github-finder.git
cd github-finder
# Ouvrir index.html dans un navigateur
```

## Structure

```
github-finder/
├── index.html   # Structure HTML
├── style.css    # Styles dark mode
├── app.js       # Logique JavaScript
└── README.md
```

## API utilisée

- `GET https://api.github.com/users/{username}`
- `GET https://api.github.com/users/{username}/repos?sort=stars&per_page=6`