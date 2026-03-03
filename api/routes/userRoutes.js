const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, initDatabase } = require('../database/init');

const router = express.Router();

router.get('/', (req, res) => {
  console.log("📦 GET /api/users - Lecture depuis la BDD");
  
  try {
    // Lire tous les utilisateurs depuis la base de données
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
  } catch (error) {
    console.error("Erreur BDD:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', (req, res) => {
  console.log("📦 GET /api/users/:id - Lecture depuis la BDD");
  
  const id = req.params.id;
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    
    res.json(user);
    
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.put('/:id', (req, res) => {
  console.log("📦 PUT /api/users/:id - Mise à jour d'un utilisateur");
  
  const id = req.params.id;
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    
    res.json(user);
    
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;