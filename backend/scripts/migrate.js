const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite'); // chemin vers ta base
const db = new sqlite3.Database(dbPath); // ici on instancie correctement la base

function migrate() {
  console.log('🚀 Début de la migration de la base de données...');

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => {
      if (err) {
        console.error('❌ Erreur lors de la création de la table :', err.message);
      } else {
        console.log('✅ Table users créée avec succès (ou existait déjà).');
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error('❌ Erreur lors de la fermeture de la base de données :', err.message);
    } else {
      console.log('✅ Migration terminée et base de données fermée.');
    }
  });
}

migrate();
