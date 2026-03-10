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

  // Créer la table users
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

  // Créer la table teams
  const createTeamsTableQuery = `
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      foreign key (created_by) references users(id) on delete restrict
    )
  `;

  db.exec(createTeamsTableQuery);
  console.log('✅ Table "teams" créée ou déjà existante');

  //Créer la table team_members
  const createTeamMembersTableQuery = `
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      team_id INTEGER NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE RESTRICT
    )
  `;

  db.exec(createTeamMembersTableQuery);
  console.log('✅ Table "team_members" créée ou déjà existante');

  // Créer la table products APRÈS (avec foreign key vers users)
  const createProductsTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255),
      stock INTEGER NOT NULL DEFAULT 0,
      minimum INTEGER NOT NULL DEFAULT 0,
      team_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE RESTRICT
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