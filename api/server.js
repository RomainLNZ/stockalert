const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

//Route product
app.get('/api/products', (req, res) => {
    console.log("📦 GET /api/products - Envoi de la liste des produits");
    
    const products = [
        { id: 1, name: 'Clavier mécanique', stock: 15, minimum: 5 },
        { id: 2, name: 'Souris sans fil', stock: 8, minimum: 10 },
        { id: 3, name: 'Écran 24 pouces', stock: 3, minimum: 5 }
    ];
    
    res.json(products);
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});