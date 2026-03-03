const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db, initDatabase } = require('./database/init');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialiser la base de données au démarrage
(async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
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

app.use('/api/products', productRoutes);