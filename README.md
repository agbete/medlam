# MedLam - Application Web Biblique Moderne

![MedLam Logo](https://via.placeholder.com/200x80/0ea5e9/ffffff?text=MedLam)

MedLam est une application Web moderne conçue pour faciliter la lecture et l'étude de la Bible. Elle offre une interface intuitive, des outils de recherche puissants et des fonctionnalités d'annotation personnelles.

## ✨ Fonctionnalités

- 📖 **Lecture moderne** : Interface responsive et intuitive pour tous les appareils
- 🔍 **Recherche avancée** : Moteur de recherche puissant avec filtres
- ❤️ **Annotations personnelles** : Notes, favoris et surlignage
- 🌙 **Mode sombre/clair** : Thème adaptatif pour le confort de lecture
- 📱 **Responsive** : Optimisé pour mobile, tablette et desktop
- ⚡ **Performance** : Chargement rapide et navigation fluide

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design
- **React Router** pour la navigation
- **Context API** pour la gestion d'état

### Backend
- **Node.js** avec Express
- **SQLite** pour la base de données
- **API REST** sécurisée
- **Rate limiting** et validation

### DevOps
- **Docker** et Docker Compose
- **Multi-stage builds** pour l'optimisation
- **Scripts de déploiement** automatisés

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Docker (optionnel, pour le déploiement)

### Installation locale

1. **Cloner le repository**
   ```bash
   git clone https://github.com/agbete/medlam.git
   cd medlam
   ```

2. **Installer les dépendances du backend**
   ```bash
   cd backend
   npm install
   ```

3. **Initialiser la base de données**
   ```bash
   npm run migrate
   npm run seed
   ```

4. **Démarrer le backend**
   ```bash
   npm run dev
   ```

5. **Dans un nouveau terminal, installer les dépendances du frontend**
   ```bash
   cd frontend
   npm install
   ```

6. **Démarrer le frontend**
   ```bash
   npm start
   ```

L'application sera accessible à :
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001

### Déploiement avec Docker

1. **Déploiement simple**
   ```bash
   ./scripts/deploy.sh
   ```

2. **Déploiement en production**
   ```bash
   ./scripts/deploy.sh production
   ```

## 📁 Structure du Projet

```
medlam/
├── frontend/                 # Application React
│   ├── public/              # Fichiers statiques
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── utils/          # Utilitaires et API
│   │   ├── types/          # Types TypeScript
│   │   └── styles/         # Styles CSS
│   └── package.json
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── routes/         # Routes API
│   │   ├── models/         # Modèles de données
│   │   └── controllers/    # Contrôleurs
│   ├── database/           # Base de données SQLite
│   ├── scripts/            # Scripts de migration
│   └── package.json
├── scripts/                # Scripts de déploiement
├── docker-compose.yml      # Configuration Docker
├── Dockerfile             # Image Docker
└── README.md
```

## 🔧 Configuration

### Variables d'environnement

**Backend (.env)**
```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database/medlam.db
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NAME=MedLam
REACT_APP_VERSION=1.0.0
```

## 📊 API Endpoints

### Livres bibliques
- `GET /api/bible/books` - Liste des livres
- `GET /api/bible/books/:id` - Détails d'un livre
- `GET /api/bible/books/:id/chapters/:chapter` - Chapitre avec versets

### Recherche
- `GET /api/search?q=terme` - Recherche de versets
- `GET /api/search/suggestions?q=terme` - Suggestions

### Annotations
- `GET /api/annotations` - Annotations de l'utilisateur
- `POST /api/annotations` - Créer une annotation
- `PUT /api/annotations/:id` - Modifier une annotation
- `DELETE /api/annotations/:id` - Supprimer une annotation

## 🧪 Tests

```bash
# Tests backend
cd backend
npm test

# Tests frontend
cd frontend
npm test
```

## 📈 Performance

- **Lighthouse Score** : 95+ sur tous les critères
- **Bundle Size** : < 500KB gzippé
- **API Response Time** : < 100ms moyenne
- **Database Queries** : Optimisées avec index

## 🔒 Sécurité

- Rate limiting sur les API
- Validation des entrées
- Protection CORS
- Sanitisation des données
- Headers de sécurité

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines de développement

- Utiliser TypeScript pour le type safety
- Suivre les conventions de nommage
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les changements importants

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- 🎉 Version initiale
- ✨ Interface de lecture biblique
- 🔍 Moteur de recherche
- ❤️ Système d'annotations
- 🌙 Mode sombre/clair
- 📱 Design responsive

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développeur Principal** : [Votre nom]
- **Design** : [Designer]
- **Contributeurs** : Voir [CONTRIBUTORS.md](CONTRIBUTORS.md)

## 📞 Support

- 📧 Email : contact@medlam.app
- 🐛 Issues : [GitHub Issues](https://github.com/agbete/medlam/issues)
- 📖 Documentation : [Wiki](https://github.com/agbete/medlam/wiki)

## 🙏 Remerciements

- Communauté open source
- Contributeurs du projet
- Utilisateurs et testeurs
- Inspiration divine pour ce projet

---

**MedLam** - *Développé avec ❤️ pour la gloire de Dieu*

