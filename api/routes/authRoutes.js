const express = require('express');
const { normalizeEmail, isValidEmail, isValidPassword } = require('../utils/validation');
const {createUser, loginUser} = require('../services/authService');
const {loginLimiter, registerLoginFailure, clearLoginAttempts} = require('../middleware/loginLimiter');
const router = express.Router();

router.post('/signup', async (req, res, next) => {
  console.log("🔐 POST /api/auth/signup - Inscription utilisateur");
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;
    
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Données manquantes (email, password requis)' 
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }
  
  if (!isValidPassword(password)) {
    return res.status(400).json({ 
      error: 'Mot de passe trop faible (doit contenir au moins 8 caractères, majuscules, minuscules, chiffres et caractères spéciaux)' 
    });
  }

  try {
      const { user, token } = await createUser(email, password);
      res.status(201).json({ token, email: user.email });
    } catch (error) {
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(409).json({ error: 'Email déjà utilisé' });
      }
        next(error);
      }
});

// Route 2 : Connexion
router.post('/login', loginLimiter, async (req, res, next) => {
  console.log("🔐 POST /api/auth/login - Connexion utilisateur");
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Données manquantes (email, password requis)' 
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  try {
    const { user, token } = await loginUser(email, password);

    clearLoginAttempts(req.ip);

    res.json({ token, email: user.email });

  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      registerLoginFailure(req.ip);

      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }
    next(error);
  }
});

module.exports = router;