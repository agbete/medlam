const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Utiliser le fichier database.sqlite depuis la branche main
const dbPath = path.resolve(__dirname, '../database.sqlite');

async function migrate() {
  console.log('🚀 Début de la migration de la base de données...');
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Erreur lors de l\'ouverture de la base de données:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Connexion à la base de données SQLite établie.');
    });

    db.serialize(() => {
      // Créer les tables principales pour l'application biblique
      const tables = [
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          testament TEXT NOT NULL,
          chapters INTEGER NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS verses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          book_id INTEGER NOT NULL,
          chapter INTEGER NOT NULL,
          verse INTEGER NOT NULL,
          text TEXT NOT NULL,
          FOREIGN KEY (book_id) REFERENCES books (id)
        )`,
        `CREATE TABLE IF NOT EXISTS annotations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          book_id INTEGER NOT NULL,
          chapter INTEGER NOT NULL,
          verse INTEGER NOT NULL,
          type TEXT NOT NULL,
          content TEXT,
          color TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (book_id) REFERENCES books (id)
        )`
      ];

      let completed = 0;
      const total = tables.length;

      tables.forEach((sql, index) => {
        db.run(sql, (err) => {
          if (err) {
            console.error(`❌ Erreur lors de la création de la table ${index + 1}:`, err.message);
            reject(err);
            return;
          }
          console.log(`✅ Table ${index + 1}/${total} créée avec succès.`);
          completed++;
          
          if (completed === total) {
            db.close((err) => {
              if (err) {
                console.error('❌ Erreur lors de la fermeture de la base de données:', err.message);
                reject(err);
              } else {
                console.log('✅ Migration terminée et base de données fermée.');
                resolve();
              }
            });
          }
        });
      });
    });
  });
}

// Exécuter la migration si ce script est appelé directement
if (require.main === module) {
  migrate().then(() => {
    console.log('🎉 Base de données prête !');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  });
}

module.exports = { migrate };
