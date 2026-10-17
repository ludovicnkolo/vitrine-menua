const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const JWT_SECRET = process.env.JWT_SECRET;

// ─── HELPERS DE RÔLE CENTRALISÉS (RBAC STRICT) ──────────────────────────────
// RÈGLE CORRIGÉE (SEC-02): Élimination des .includes('admin') permissifs
const SUPER_ADMIN_ROLES = ["Super-administrateur"];
const ADMIN_ROLES = ["Super-administrateur"];
const MANAGER_ROLES = ["Super-administrateur", "Responsable opérationnel"];

const SUPER_ADMIN_SET = new Set(SUPER_ADMIN_ROLES);
const ADMIN_SET = new Set(ADMIN_ROLES);
const MANAGER_SET = new Set(MANAGER_ROLES);

const isSuperAdmin = (role) => {
  if (!role || typeof role !== "string") return false;
  return SUPER_ADMIN_SET.has(role.trim());
};

const isAdmin = (role) => {
  if (!role || typeof role !== "string") return false;
  return ADMIN_SET.has(role.trim());
};

const isManager = (role) => {
  if (!role || typeof role !== "string") return false;
  return MANAGER_SET.has(role.trim());
};

// ─── MIDDLEWARE AUTHENTIFICATION ──────────────────────────────────────────────
// RÈGLE CORRIGÉE: jwt.verify synchrone dans try/catch au sein d'un middleware async (pas de callback async non capté)
// RÈGLE CORRIGÉE (SEC-03): Suppression de req.query.token pour éviter toute fuite dans les logs URL
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const raw = authHeader.split(" ")[1];
    if (raw && raw !== "null" && raw !== "undefined" && raw !== "") {
      token = raw.trim();
    }
  }

  if (!token && req.cookies && req.cookies.token) {
    token = String(req.cookies.token).trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Accès non autorisé : Token manquant.",
      action: "REQUIRE_AUTH",
    });
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
  } catch (jwtErr) {
    return res.status(401).json({
      success: false,
      error: "Token invalide ou expiré.",
      action: "FORCE_LOGOUT",
    });
  }

  if (user.id === "MASTER-ADMIN") {
    req.user = {
      ...user,
      role: "Super-administrateur",
      name: process.env.MASTER_ADMIN_NAME || "Super Administrateur",
      clientId: null,
    };
    return next();
  }

  try {
    const dbUser = await prisma.utilisateur.findUnique({
      where: { id: user.id },
      include: { role: true },
    });

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur introuvable en base. Veuillez vous reconnecter.",
        action: "FORCE_LOGOUT",
      });
    }

    if (dbUser.isBlocked) {
      return res.status(403).json({
        success: false,
        error: "Votre compte a été désactivé par l'administrateur.",
        action: "FORCE_LOGOUT",
      });
    }

    // Si le mot de passe a été supprimé par l'administrateur (réinitialisation en attente)
    if (dbUser.password && dbUser.password.startsWith("RESET_PENDING")) {
      return res.status(401).json({
        success: false,
        error: "Votre mot de passe a été réinitialisé par un administrateur. Session interrompue.",
        action: "FORCE_LOGOUT",
      });
    }

    // Validation rétrocompatible de session: seulement si sessionSig est fourni dans le token
    if (user.sessionSig && typeof user.sessionSig === "string") {
      const currentSig = dbUser.password
        ? dbUser.password.substring(dbUser.password.length - 10)
        : "";
      if (user.sessionSig !== currentSig) {
        return res.status(401).json({
          success: false,
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

    return next();
  } catch (dbError) {
    console.error("[AUTH DB ERROR]", dbError?.message || dbError);
    return res.status(500).json({
      success: false,
      error: "Erreur de vérification utilisateur: service indisponible.",
    });
  }
};

// ─── MIDDLEWARE VÉRIFICATION DES RÔLES ───────────────────────────────────────
const requireRoles = (...allowedRoles) => {
  const allowedSet = new Set(allowedRoles);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Non authentifié." });
    }

    // Super-Admin et Master Admin ont toujours accès complet
    if (req.user.role === "Super-administrateur" || req.user.id === "MASTER-ADMIN") {
      return next();
    }

    if (allowedSet.has(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: "Accès interdit : privilèges insuffisants.",
    });
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
