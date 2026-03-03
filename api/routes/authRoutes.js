const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../database/init');

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const SALT_ROUNDS = 10;

router.post('/signup', async (req, res) => {
  console.log("🔐 POST /api/auth/signup - Inscription utilisateur");
  const email = req.body.email?.toLowerCase().trim();
  const { password } = req.body;
    
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Données manquantes (email, password requis)' 
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }
  
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      error: 'Mot de passe trop faible (doit contenir au moins 8 caractères, majuscules, minuscules, chiffres et caractères spéciaux)' 
    });
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

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
        
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(201).json({ token, email: newUser.email });
    } catch (error) {
        console.error("Erreur d'insertion:", error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
      }
});

// Route 2 : Connexion
router.post('/login', async (req, res) => {
  console.log("🔐 POST /api/auth/login - Connexion utilisateur");
  const email = req.body.email?.toLowerCase().trim();
  const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Données manquantes (email, password requis)' 
      });
    }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) {
        return res.status(401).json({
          error: "Email ou mot de passe incorrect"
        });
      }

    const passIsValid = await bcrypt.compare(password, user.password_hash);
      if (!passIsValid) {
        return res.status(401).json({
          error: "Email ou mot de passe incorrect"
        });
      }

    const token = jwt.sign(
      { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
      res.json({ token, email: user.email });
  } catch (error) {
      console.error("Erreur de connexion:", error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }


  // anti brute force (limiter le nombre de tentatives de connexion)
});

module.exports = router;