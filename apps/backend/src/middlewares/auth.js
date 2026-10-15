const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const JWT_SECRET = process.env.JWT_SECRET;

// ─── HELPERS DE RÔLE CENTRALISÉS ─────────────────────────────────────────────
// Seuls ces rôles voient les éléments BLOQUÉS et peuvent les créer
const SUPER_ADMIN_ROLES = ["Super-administrateur"];

// Ces rôles ont accès admin complet au CRM
const ADMIN_ROLES = ["Super-administrateur"];

// Ces rôles peuvent créer des dossiers et des missions
const MANAGER_ROLES = ["Super-administrateur", "Responsable opérationnel"];

// Helpers booléens
const isSuperAdmin = (role) => {
  if (!role) return false;
  return SUPER_ADMIN_ROLES.includes(role) || role.toLowerCase().includes('super-admin');
};
const isAdmin = (role) => {
  if (!role) return false;
  return isSuperAdmin(role) || ADMIN_ROLES.includes(role) || role.toLowerCase().includes('admin');
};
const isManager = (role) => {
  if (!role) return false;
  return isAdmin(role) || MANAGER_ROLES.includes(role) || role.toLowerCase().includes('responsable');
};

// ─── MIDDLEWARE AUTHENTIFICATION ──────────────────────────────────────────────
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const raw = authHeader.split(" ")[1];
    if (raw && raw !== "null" && raw !== "undefined" && raw !== "") {
      token = raw;
    }
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (!token && req.query && req.query.token) {
    token = req.query.token;
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).json({ error: "Token invalide ou expiré." });
      }

      if (user.id === "MASTER-ADMIN") {
        req.user = { ...user, role: "Super-administrateur" };
        return next();
      }

      try {
        const dbUser = await prisma.utilisateur.findUnique({
          where: { id: user.id },
          include: { role: true },
        });
        if (!dbUser) {
          return res
            .status(401)
            .json({
              error:
                "Utilisateur introuvable en base. Veuillez vous reconnecter.",
              action: "FORCE_LOGOUT",
            });
        }
        if (dbUser.isBlocked) {
          return res
            .status(401)
            .json({
              error: "Votre compte a été désactivé par l'administrateur.",
              action: "FORCE_LOGOUT",
            });
        }
        
        // Validation de session: si le mot de passe a changé, la signature change
        if (user.sessionSig !== undefined) {
          const currentSig = dbUser.password ? dbUser.password.substring(dbUser.password.length - 10) : "";
          if (user.sessionSig !== currentSig) {
            return res
              .status(401)
              .json({
                error: "Session expirée suite à une modification du mot de passe. Veuillez vous reconnecter.",
                action: "FORCE_LOGOUT",
              });
          }
        }
        req.user = {
          ...user,
          role: dbUser.role?.name || user.role || "Collaborateur",
          name: dbUser.name,
          email: dbUser.email,
          clientId: dbUser.clientId || null,
        };
      } catch (dbError) {
        console.error("[AUTH DB ERROR]", dbError?.message || dbError);
        return res
          .status(500)
          .json({
            error: "Erreur de vérification utilisateur: service indisponible.",
          });
      }

      next();
    });
  } else {
    res.status(401).json({ error: "Accès non autorisé. Token manquant." });
  }
};

// ─── MIDDLEWARE VÉRIFICATION DES RÔLES ───────────────────────────────────────
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Non authentifié." });
    }
    // Super-Admin a toujours accès complet
    const isSuperAdm = req.user.role === "Super-administrateur";
    if (isSuperAdm || req.user.id === "MASTER-ADMIN") {
      return next();
    }
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res
      .status(403)
      .json({ error: "Accès interdit : privilèges insuffisants." });
  };
};

module.exports = {
  authenticateJWT,
  requireRoles,
  JWT_SECRET,
  isSuperAdmin,
  isAdmin,
  isManager,
  SUPER_ADMIN_ROLES,
  ADMIN_ROLES,
  MANAGER_ROLES,
};
