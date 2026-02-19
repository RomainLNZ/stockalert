const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db, initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialiser la base de données au démarrage
(async () => {
  await initDatabase();
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
})();


// Middlewares
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'StockAlert API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/products', (req, res) => {
  console.log("📦 GET /api/products - Lecture depuis la BDD");
  
  try {
    // Lire tous les produits depuis la base de données
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  } catch (error) {
    console.error("Erreur BDD:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/products/:id', (req, res) => {
  console.log("📦 GET /api/products/:id - Lecture depuis la BDD");
  
  const id = req.params.id;
  
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    
    res.json(product);
    
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/products', (req, res) => {
  console.log("➕ POST /api/products - Création d'un produit");
  
  const { name, stock, minimum } = req.body;

  if (!name || stock === undefined || minimum === undefined) {
    return res.status(400).json({ 
      error: 'Données manquantes (name, stock, minimum requis)' 
    });
  }

    try {
      const insert = db.prepare(`
        INSERT INTO products (name, stock, minimum) 
        VALUES (?, ?, ?)
      `);
      const result = insert.run(name, stock, minimum);
      const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
        
      res.status(201).json(newProduct);
    } catch (error) {
        console.error("Erreur d'insertion:", error);
        res.status(500).json({ error: 'Erreur lors de la création du produit' });
      }
});

app.put('/api/products/:id', (req, res) => {  // ✅ Ajout de /:id
  console.log("✏️ PUT /api/products/:id - Modification d'un produit");
  
  const id = req.params.id;
  const { name, stock, minimum } = req.body;

  try {

    if (!name || stock === undefined || minimum === undefined) {
      return res.status(400).json({ 
        error: 'Données manquantes (name, stock, minimum requis)' 
      });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }

    db.prepare('UPDATE products SET name = ?, stock = ?, minimum = ? WHERE id = ?').run(
      name,
      stock,
      minimum,
      id
    );

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    res.json(updatedProduct);

  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  console.log("🗑️ DELETE /api/products/:id - Suppression d'un produit");

  const id = req.params.id;

  try  {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable'});
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    res.json({ message: 'Produit supprimé avec succès',
      deletedProduct: product
    });

  } catch (error) {
    console.error("Erreur de suppression:", error);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});