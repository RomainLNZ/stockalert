const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db, initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialiser la base de données au démarrage
initDatabase();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'StockAlert API is running!',
    timestamp: new Date().toISOString()
  });
});

// Route products - MODIFIÉE pour lire depuis la BDD
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
  
// 1. Récupère l'ID depuis l'URL
  const id = req.params.id;
  
  try {
    // 2. Fais la requête SQL pour récupérer le produit
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    
    // 3. Vérifie si le produit existe
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    
    // 4. Renvoie le produit
    res.json(product);
    
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});