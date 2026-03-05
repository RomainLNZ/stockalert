const Database = require('better-sqlite3');
const path = require('path');

// Chemin vers le fichier de la base de données
const dbPath = path.join(__dirname, 'stockalert.db');

// Créer/ouvrir la base de données
const db = new Database(dbPath);

// Activer les foreign keys (désactivées par défaut dans SQLite)
db.pragma('foreign_keys = ON');

// Fonction pour initialiser la base de données
function initDatabase() {
  console.log('📊 Initialisation de la base de données...');

  // Créer la table users EN PREMIER (products en dépend)
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createUsersTableQuery);
  console.log('✅ Table "users" créée ou déjà existante');

  // Créer la table products APRÈS (avec foreign key vers users)
  const createProductsTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      minimum INTEGER NOT NULL DEFAULT 0,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
    )
  `;

  db.exec(createProductsTableQuery);
  console.log('✅ Table "products" créée ou déjà existante');

  // Vérifier s'il y a déjà des données
  const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const countProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
  
  console.log(`ℹ️  La base contient déjà ${countUsers.count} utilisateur(s)`);
  console.log(`ℹ️  La base contient déjà ${countProducts.count} produit(s)`);
  console.log('✅ Base de données prête !');
}

// Exporter la base de données et la fonction d'init
module.exports = { db, initDatabase };