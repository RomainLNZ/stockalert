const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  //vérifier que le header existe
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token manquant' });
    }

  //Extraire le token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Format de token invalide' });
    }

  //Vérifier et décoder le token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //Stocker l'info de l'user dans req pour les routes suivantes
        req.user = decoded;  // { id: 123, email: "user@mail.com" }
    
    //Passer au middleware/route suivant
    next();
    
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expiré' });
      }

      return res.status(403).json({ error: 'Token invalide' });
    }
}

module.exports = authenticateToken;