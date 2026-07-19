const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token invalide ou expiré.' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
  }
};

module.exports = { authenticateJWT, JWT_SECRET };
