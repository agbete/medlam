const fs = require('fs');
const path = require('path');
const { getDatabase } = require('../src/models/database');

async function migrate() {
  console.log('🚀 Début de la migration de la base de données...');
  
  try {
    const db = getDatabase();
    
    // Lire le fichier de schéma
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Diviser le schéma en requêtes individuelles
    const queries = schema
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0);
    
    // Exécuter chaque requête
    for (const query of queries) {
      try {
        await db.run(query);
        console.log('✅ Requête exécutée avec succès');
      } catch (error) {
        // Ignorer les erreurs "table already exists"
        if (!error.message.includes('already exists')) {
          throw error;
        }
        console.log('ℹ️  Table déjà existante, ignorée');
      }
    }
    
    console.log('✅ Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration si ce script est appelé directement
if (require.main === module) {
  migrate().then(() => {
    console.log('🎉 Base de données prête !');
    process.exit(0);
  });
}

module.exports = { migrate };

