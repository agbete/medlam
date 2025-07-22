const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/medlam.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
      } else {
        console.log('✅ Connexion à la base de données SQLite établie');
        this.init();
      }
    });
  }

  init() {
    // Activer les clés étrangères
    this.db.run('PRAGMA foreign_keys = ON');
    
    // Optimisations de performance
    this.db.run('PRAGMA journal_mode = WAL');
    this.db.run('PRAGMA synchronous = NORMAL');
    this.db.run('PRAGMA cache_size = 1000');
    this.db.run('PRAGMA temp_store = MEMORY');
  }

  // Méthode pour exécuter une requête avec promesse
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Méthode pour récupérer une seule ligne
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Méthode pour récupérer plusieurs lignes
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Méthode pour fermer la connexion
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('🔒 Connexion à la base de données fermée');
          resolve();
        }
      });
    });
  }

  // Méthode pour exécuter plusieurs requêtes dans une transaction
  async transaction(queries) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        const results = [];
        let completed = 0;
        
        queries.forEach((query, index) => {
          this.db.run(query.sql, query.params || [], function(err) {
            if (err) {
              this.db.run('ROLLBACK');
              reject(err);
              return;
            }
            
            results[index] = { id: this.lastID, changes: this.changes };
            completed++;
            
            if (completed === queries.length) {
              this.db.run('COMMIT', (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              });
            }
          });
        });
      });
    });
  }
}

// Singleton pour la base de données
let dbInstance = null;

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
}

module.exports = { Database, getDatabase };

