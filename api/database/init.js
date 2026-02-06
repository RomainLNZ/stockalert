const Database = require('better-sqlite3');
const path = require('path');

// Chemin vers le fichier de la base de données
const dbPath = path.join(__dirname, 'stockalert.db');

// Créer/ouvrir la base de données
const db = new Database(dbPath);

// Fonction pour initialiser la base de données
function initDatabase() {
  console.log('📊 Initialisation de la base de données...');

  // Créer la table products si elle n'existe pas
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      minimum INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createTableQuery);
  console.log('✅ Table "products" créée ou déjà existante');

  // Vérifier s'il y a déjà des données
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
  
  if (count.count === 0) {
    console.log('📝 Insertion de données de test...');
    
    // Insérer des données de test
    const insert = db.prepare(`
      INSERT INTO products (name, stock, minimum) 
      VALUES (?, ?, ?)
    `);

    insert.run('Clavier mécanique', 15, 5);
    insert.run('Souris sans fil', 8, 10);
    insert.run('Écran 24 pouces', 3, 5);
    
    console.log('✅ Données de test insérées');
  } else {
    console.log(`ℹ️  La base contient déjà ${count.count} produit(s)`);
  }

  console.log('✅ Base de données prête !');
}

// Exporter la base de données et la fonction d'init
module.exports = { db, initDatabase };