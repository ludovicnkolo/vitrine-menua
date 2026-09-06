const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Token invalide ou expiré.' });
      }
      
      if (user.id === 'MASTER-ADMIN') {
        req.user = user;
        return next();
      }

      try {
        const dbUser = await prisma.utilisateur.findUnique({ where: { id: user.id } });
        if (!dbUser) {
          return res.status(401).json({ error: 'Utilisateur introuvable en base. Veuillez vous reconnecter.', action: 'FORCE_LOGOUT' });
        }
        if (dbUser.isBlocked) {
          return res.status(401).json({ error: 'Votre compte a été désactivé par l\'administrateur.', action: 'FORCE_LOGOUT' });
        }
      } catch (dbError) {
        return res.status(500).json({ error: 'Erreur de vérification utilisateur' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
  }
};

const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié.' });
    }
    // Super-administrateur always has full privileges
    if (req.user.role === 'Super-administrateur' || req.user.id === 'MASTER-ADMIN') {
      return next();
    }
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: 'Accès interdit : privilèges insuffisants.' });
  };
};

module.exports = { authenticateJWT, requireRoles, JWT_SECRET };
