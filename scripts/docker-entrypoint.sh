#!/bin/sh

# Script d'entrée Docker pour MedLam

set -e

echo "🚀 Démarrage de MedLam..."

# Aller dans le dossier backend
cd /app/backend

# Vérifier si la base de données existe
if [ ! -f "$DATABASE_PATH" ]; then
    echo "📊 Initialisation de la base de données..."
    
    # Créer le dossier de la base de données si nécessaire
    mkdir -p "$(dirname "$DATABASE_PATH")"
    
    # Exécuter les migrations
    node scripts/migrate.js
    
    # Peupler la base de données avec les données initiales
    node scripts/seed.js
    
    echo "✅ Base de données initialisée avec succès"
else
    echo "📊 Base de données existante trouvée"
fi

# Vérifier la santé de la base de données
echo "🔍 Vérification de la base de données..."
if ! node -e "
const { getDatabase } = require('./src/models/database');
const db = getDatabase();
db.get('SELECT COUNT(*) as count FROM books')
  .then(result => {
    console.log('✅ Base de données opérationnelle -', result.count, 'livres trouvés');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur de base de données:', err.message);
    process.exit(1);
  });
"; then
    echo "❌ Problème avec la base de données"
    exit 1
fi

echo "🎉 Initialisation terminée, démarrage du serveur..."

# Exécuter la commande passée en argument
exec "$@"

