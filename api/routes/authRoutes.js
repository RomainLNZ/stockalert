const express = require('express');
const bcrypt = require('bcrypt');
const { db } = require('../database/init');
const { generateToken } = require('../utils/jwt');

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const SALT_ROUNDS = 10;

router.post('/signup', async (req, res, next) => {
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

  try {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email déjà utilisé' });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      const insert = db.prepare(`
        INSERT INTO users (email, password_hash) 
        VALUES (?, ?)
      `);
      const result = insert.run(email, password_hash);

      const newUser = {
        id: result.lastInsertRowid,
        email
      };
        
      const token = generateToken(newUser);
      res.status(201).json({ token, email: newUser.email });
    } catch (error) {
        next(error);
      }
});

// Route 2 : Connexion
router.post('/login', async (req, res, next) => {
  console.log("🔐 POST /api/auth/login - Connexion utilisateur");
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

    const token = generateToken(user);
    res.json({ token, email: user.email });
    
  } catch (error) {
      next(error);
    }


  // anti brute force (limiter le nombre de tentatives de connexion)
});

module.exports = router;