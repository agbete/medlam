# Guide d'installation MedLam

## Prérequis

- Node.js 18 ou supérieur
- npm ou yarn
- Git
- Docker (optionnel, pour le déploiement)

## Installation locale

### 1. Cloner le repository

```bash
git clone https://github.com/agbete/medlam.git
cd medlam
```

### 2. Configuration du backend

```bash
cd backend
npm install
```

Copier le fichier de configuration :
```bash
cp .env.example .env
```

Initialiser la base de données :
```bash
npm run migrate
npm run seed
```

Démarrer le serveur backend :
```bash
npm run dev
```

Le backend sera accessible sur http://localhost:3001

### 3. Configuration du frontend

Dans un nouveau terminal :
```bash
cd frontend
npm install
```

Copier le fichier de configuration :
```bash
cp .env.example .env
```

Démarrer l'application frontend :
```bash
npm start
```

L'application sera accessible sur http://localhost:3000

## Déploiement avec Docker

### Déploiement simple

```bash
./scripts/deploy.sh
```

### Déploiement en production

```bash
./scripts/deploy.sh production
```

## Vérification de l'installation

1. Vérifiez que l'API backend fonctionne :
   ```bash
   curl http://localhost:3001/api/health
   ```

2. Accédez à l'application frontend : http://localhost:3000

3. Testez les fonctionnalités :
   - Navigation dans la Bible
   - Recherche de versets
   - Création d'annotations

## Dépannage

### Problèmes courants

**Erreur de port déjà utilisé :**
```bash
# Changer le port dans les fichiers .env
PORT=3002  # backend
REACT_APP_API_URL=http://localhost:3002/api  # frontend
```

**Problème de base de données :**
```bash
cd backend
rm database/medlam.db
npm run migrate
npm run seed
```

**Problèmes de dépendances :**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## Configuration avancée

### Variables d'environnement backend

- `PORT` : Port du serveur (défaut: 3001)
- `NODE_ENV` : Environnement (development/production)
- `DATABASE_PATH` : Chemin vers la base SQLite
- `CORS_ORIGIN` : Origine autorisée pour CORS
- `RATE_LIMIT_MAX_REQUESTS` : Limite de requêtes par fenêtre

### Variables d'environnement frontend

- `REACT_APP_API_URL` : URL de l'API backend
- `REACT_APP_NAME` : Nom de l'application
- `REACT_APP_VERSION` : Version de l'application

## Support

Pour obtenir de l'aide :
- Consultez la documentation dans `/docs`
- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement

