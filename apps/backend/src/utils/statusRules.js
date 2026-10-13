const ROLES = {
  SUPER_ADMIN: "Super-administrateur",
  RESPONSABLE: "Responsable opérationnel",
  RELECTEUR: "Relecteur",
  COLLABORATEUR: "Collaborateur",
  ADMIN_TECH: "Administrateur technique",
};

/**
 * Normalise un statut en supprimant tout accent, en passant en majuscules
 * et en retirant les espaces superflus.
 * Exemples : "TRAITÉ" -> "TRAITE", "GAGNÉ" -> "GAGNE", "REFUSÉ" -> "REFUSE"
 */
const normalizeStatus = (status) => {
  if (!status || typeof status !== "string") return status;
  return status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
};

/**
 * Matrice déterministe pour TÂCHE :
 * context = { role, isSA, isAssigned, isRelecteurAssigned, isMissionManager }
 */
const TACHE_TRANSITIONS = {
  NOUVEAU: {
    EN_COURS: (ctx) => ctx.isSA || ctx.isAssigned,
    EN_ATTENTE: (ctx) => ctx.isSA || ctx.isMissionManager,
    BLOQUE: (ctx) => ctx.isSA,
  },
  EN_COURS: {
    EN_RELECTURE: (ctx) => ctx.isSA || ctx.isAssigned,
    EN_ATTENTE: (ctx) => ctx.isSA || ctx.isMissionManager,
    BLOQUE: (ctx) => ctx.isSA,
  },
  EN_RELECTURE: {
    EN_APPROBATION: (ctx) => ctx.isSA || ctx.isRelecteurAssigned,
    A_CORRIGER: (ctx) => ctx.isSA || ctx.isRelecteurAssigned,
    EN_ATTENTE: (ctx) => ctx.isSA || ctx.isMissionManager,
    BLOQUE: (ctx) => ctx.isSA,
  },
  EN_APPROBATION: {
    APPROUVEE: (ctx) => ctx.isSA || ctx.isMissionManager,
    A_CORRIGER: (ctx) => ctx.isSA || ctx.isMissionManager || ctx.isRelecteurAssigned,
    EN_ATTENTE: (ctx) => ctx.isSA || ctx.isMissionManager,
    BLOQUE: (ctx) => ctx.isSA,
  },
  APPROUVEE: {
    TERMINE: (ctx) => ctx.isSA || ctx.isMissionManager,
    BLOQUE: (ctx) => ctx.isSA,
  },
  A_CORRIGER: {
    EN_COURS: (ctx) => ctx.isSA || ctx.isAssigned,
    EN_ATTENTE: (ctx) => ctx.isSA || ctx.isMissionManager,
    BLOQUE: (ctx) => ctx.isSA,
  },
  EN_ATTENTE: {
    RESUME: (ctx) => ctx.isSA || ctx.isMissionManager,
    BLOQUE: (ctx) => ctx.isSA,
  },
  BLOQUE: {
    RESUME: (ctx) => ctx.isSA,
  },
  TERMINE: {
    EN_COURS: (ctx) => ctx.isSA,
  },
};

function canTransitionTache(from, to, previousStatus, context) {
  if (!context || context.role === ROLES.ADMIN_TECH) return false;
  from = normalizeStatus(from);
  to = normalizeStatus(to);

  if (!to || from === to) return true;

  // Gestion des retours d'attente / blocage
  if (from === "EN_ATTENTE" || from === "BLOQUE") {
    if (to === "BLOQUE" && context.isSA) return true;
    const expected = normalizeStatus(previousStatus) || "NOUVEAU";
    if (to === expected) {
      return from === "BLOQUE"
        ? TACHE_TRANSITIONS.BLOQUE.RESUME(context)
        : TACHE_TRANSITIONS.EN_ATTENTE.RESUME(context);
    }
    return false;
  }

  const allowedRule = TACHE_TRANSITIONS[from]?.[to];
  return typeof allowedRule === "function" ? allowedRule(context) : false;
}

/**
 * Matrice déterministe pour MISSION :
 * context = { role, isSA, isMissionManager, isDossierManager }
 */
const MISSION_TRANSITIONS = {
  NOUVEAU: {
    EN_COURS: (ctx) => ctx.isSA || ctx.isMissionManager || ctx.isDossierManager,
    EN_ATTENTE: (ctx) => ctx.isSA || ctx.isMissionManager || ctx.isDossierManager,
    BLOQUE: (ctx) => ctx.isSA,
  },
  EN_COURS: {
    TERMINE: (ctx) => ctx.isSA || ctx.isMissionManager || ctx.isDossierManager,
    EN_ATTENTE: (ctx) => ctx.isSA || ctx.isMissionManager || ctx.isDossierManager,
    BLOQUE: (ctx) => ctx.isSA,
    ANNULEE: (ctx) => ctx.isSA || ctx.isMissionManager || ctx.isDossierManager,
  },
  EN_ATTENTE: {
    RESUME: (ctx) => ctx.isSA || ctx.isMissionManager || ctx.isDossierManager,
    BLOQUE: (ctx) => ctx.isSA,
    ANNULEE: (ctx) => ctx.isSA || ctx.isMissionManager || ctx.isDossierManager,
  },
  BLOQUE: {
    RESUME: (ctx) => ctx.isSA,
  },
  TERMINE: {
    EN_COURS: (ctx) => ctx.isSA,
  },
};

function canTransitionMission(from, to, previousStatus, context) {
  if (!context || context.role === ROLES.ADMIN_TECH) return false;
  from = normalizeStatus(from);
  to = normalizeStatus(to);

  if (!to || from === to) return true;

  if (from === "EN_ATTENTE" || from === "BLOQUE") {
    if (to === "BLOQUE" && context.isSA) return true;
    if (to === "ANNULEE" && (context.isSA || context.isMissionManager || context.isDossierManager)) return true;
    const expected = normalizeStatus(previousStatus) || "NOUVEAU";
    if (to === expected) {
      return from === "BLOQUE"
        ? MISSION_TRANSITIONS.BLOQUE.RESUME(context)
        : MISSION_TRANSITIONS.EN_ATTENTE.RESUME(context);
    }
    return false;
  }

  const allowedRule = MISSION_TRANSITIONS[from]?.[to];
  return typeof allowedRule === "function" ? allowedRule(context) : false;
}

// Helpers de rétro-compatibilité
const isSuperAdminRole = (role) => role === ROLES.SUPER_ADMIN;
const isRespRole = (role) => role === ROLES.RESPONSABLE;

const validateTacheStatus = (fromStatus, toStatus, role, previousStatus = null) => {
  const isSA = isSuperAdminRole(role);
  const isRO = isRespRole(role);
  const ctx = {
    role,
    isSA,
    isAssigned: isSA || role === ROLES.COLLABORATEUR,
    isRelecteurAssigned: isSA || role === ROLES.RELECTEUR,
    isMissionManager: isSA || isRO,
  };
  return canTransitionTache(fromStatus, toStatus, previousStatus, ctx);
};

const validateMissionStatus = (fromStatus, toStatus, role, previousStatus = null) => {
  const isSA = isSuperAdminRole(role);
  const isRO = isRespRole(role);
  const ctx = {
    role,
    isSA,
    isMissionManager: isSA || isRO,
    isDossierManager: isSA || isRO,
  };
  return canTransitionMission(fromStatus, toStatus, previousStatus, ctx);
};

const validateMessageStatus = (fromStatus, toStatus, category, role) => {
  fromStatus = normalizeStatus(fromStatus);
  toStatus = normalizeStatus(toStatus);
  if (!toStatus || fromStatus === toStatus) return true;
  const isSA = isSuperAdminRole(role);
  const isRO = isRespRole(role);

  if (!isSA && !isRO && category !== "interne") return false;

  let rule = null;
  if (category === "contact") {
    rule = {
      NOUVEAU: ["A_RAPPELER", "DISCUSSION", "SANS_SUITE", "GAGNE"],
      A_RAPPELER: ["DISCUSSION", "SANS_SUITE", "GAGNE"],
      DISCUSSION: ["A_RAPPELER", "SANS_SUITE", "GAGNE"],
      SANS_SUITE: ["DISCUSSION"],
      GAGNE: [],
    };
  } else if (category === "recrutement") {
    rule = {
      NOUVEAU: ["A_RAPPELER", "ENTRETIEN", "REFUSE"],
      A_RAPPELER: ["ENTRETIEN", "REFUSE"],
      ENTRETIEN: ["A_RAPPELER", "RETENU", "REFUSE"],
      RETENU: [],
      REFUSE: [],
    };
  } else if (category === "interne") {
    rule = {
      NON_CONSULTE: ["CONSULTE"],
      CONSULTE: ["NON_CONSULTE"],
    };
  } else {
    rule = {
      NOUVEAU: ["A_RAPPELER", "TRAITE"],
      A_RAPPELER: ["TRAITE"],
      TRAITE: ["NOUVEAU"],
    };
  }

  const allowed = rule[fromStatus] || [];
  return allowed.includes(toStatus);
};

module.exports = {
  ROLES,
  normalizeStatus,
  TACHE_TRANSITIONS,
  canTransitionTache,
  MISSION_TRANSITIONS,
  canTransitionMission,
  validateTacheStatus,
  validateMissionStatus,
  validateMessageStatus,
};
