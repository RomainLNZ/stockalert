const express = require('express');
const { db, initDatabase } = require('../database/init');
const router = express.Router();

app.get('/api/users', (req, res) => {
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

app.post('/api/users', (req, res) => {
  console.log("➕ POST /api/users - Création d'un utilisateur");
  
  const { email, password_hash } = req.body;
  
  if (!email || !password_hash) {
    return res.status(400).json({ 
      error: 'Données manquantes (email, password requis)' 
    });
  }

    try {

      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email déjà utilisé' });
      }

      const insert = db.prepare(`
        INSERT INTO users (email, password_hash) 
        VALUES (?, ?)
      `);
      const result = insert.run(email, password_hash);
      const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
        
      res.status(201).json(newUser);
    } catch (error) {
        console.error("Erreur d'insertion:", error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
      }
});

app.get('/api/users/:id', (req, res) => {
  console.log("📦 GET /api/users/:id - Lecture depuis la BDD");
  
  const id = req.params.id;
  
  try {
    const product = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    
    res.json(product);
    
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});