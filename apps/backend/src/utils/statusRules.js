const isSuperAdmin = (role) => role === "Super-administrateur";
const isResp = (role) => role === "Responsable opérationnel";
const isRelecteur = (role) => role === "Relecteur";
const isCollab = (role) => role === "Collaborateur";

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

const validateTacheStatus = (fromStatus, toStatus, role, previousStatus = null) => {
  fromStatus = normalizeStatus(fromStatus);
  toStatus = normalizeStatus(toStatus);
  if (!toStatus || fromStatus === toStatus) return true;
  
  // L'Administrateur technique ne gère pas les tâches opérationnelles
  if (role === "Administrateur technique") return false;

  const isSA = isSuperAdmin(role);
  const isRO = isResp(role);
  const isRel = isRelecteur(role);
  const isCol = isCollab(role);
  const isRespOrAdmin = isSA || isRO;

  // Règle d'or : depuis EN_ATTENTE, on ne peut que retourner au previousStatus (ou BLOQUE par SA)
  if (fromStatus === "EN_ATTENTE") {
    if (toStatus === "BLOQUE") return isSA;
    if (previousStatus && toStatus === normalizeStatus(previousStatus)) {
      return isRespOrAdmin; // Seul SA ou Responsable
    }
    return false;
  }

  // Depuis BLOQUE : uniquement previousStatus par Super-Admin
  if (fromStatus === "BLOQUE") {
    if (previousStatus && toStatus === normalizeStatus(previousStatus)) {
      return isSA;
    }
    return false;
  }

  const VALID_TRANSITIONS = {
    NOUVEAU: {
      allowed: ["EN_COURS", "EN_ATTENTE", "BLOQUE"],
      check: (t) => {
        if (t === "EN_ATTENTE") return isRespOrAdmin;
        if (t === "BLOQUE") return isSA;
        return true;
      }
    },
    EN_COURS: {
      allowed: ["EN_RELECTURE", "BLOQUE", "EN_ATTENTE"],
      check: (t) => {
        if (t === "EN_ATTENTE") return isRespOrAdmin;
        if (t === "BLOQUE") return isSA;
        return true;
      }
    },
    EN_RELECTURE: {
      allowed: ["EN_APPROBATION", "A_CORRIGER", "EN_ATTENTE", "BLOQUE"],
      check: (t) => {
        if (t === "EN_ATTENTE") return isRespOrAdmin;
        if (t === "BLOQUE") return isSA;
        return isSA || isRel;
      }
    },
    EN_APPROBATION: {
      allowed: ["APPROUVEE", "A_CORRIGER", "EN_COURS", "EN_ATTENTE", "BLOQUE"],
      check: (t) => {
        if (t === "EN_ATTENTE") return isRespOrAdmin;
        if (t === "BLOQUE") return isSA;
        return isSA || isRO;
      }
    },
    APPROUVEE: {
      allowed: ["TERMINE", "EN_COURS", "BLOQUE"],
      check: () => isSA
    },
    A_CORRIGER: {
      allowed: ["EN_COURS", "EN_ATTENTE", "BLOQUE"],
      check: (t) => {
        if (t === "EN_ATTENTE") return isRespOrAdmin;
        if (t === "BLOQUE") return isSA;
        return true;
      }
    },
    TERMINE: {
      allowed: ["EN_COURS"],
      check: () => isSA
    }
  };

  const rule = VALID_TRANSITIONS[fromStatus];
  if (!rule || !rule.allowed.includes(toStatus)) return false;
  return rule.check(toStatus);
};

const validateMissionStatus = (fromStatus, toStatus, role, previousStatus = null) => {
  fromStatus = normalizeStatus(fromStatus);
  toStatus = normalizeStatus(toStatus);
  if (!toStatus || fromStatus === toStatus) return true;

  if (role === "Administrateur technique") return false;

  const isSA = isSuperAdmin(role);
  const isRO = isResp(role);
  const isRespOrAdmin = isSA || isRO;

  if (fromStatus === "EN_ATTENTE") {
    if (toStatus === "BLOQUE") return isSA;
    if (previousStatus && toStatus === normalizeStatus(previousStatus)) {
      return isRespOrAdmin;
    }
    return false;
  }

  if (fromStatus === "BLOQUE") {
    if (previousStatus && toStatus === normalizeStatus(previousStatus)) {
      return isSA;
    }
    return false;
  }

  const VALID_TRANSITIONS = {
    NOUVEAU: {
      allowed: ["EN_COURS", "EN_ATTENTE", "BLOQUE"],
      check: () => isRespOrAdmin
    },
    EN_COURS: {
      allowed: ["TERMINE", "BLOQUE", "EN_ATTENTE"],
      check: () => isRespOrAdmin
    },
    TERMINE: {
      allowed: ["EN_COURS"],
      check: () => isSA
    }
  };

  const rule = VALID_TRANSITIONS[fromStatus];
  if (!rule || !rule.allowed.includes(toStatus)) return false;
  return rule.check(toStatus);
};

const validateMessageStatus = (fromStatus, toStatus, category, role) => {
  fromStatus = normalizeStatus(fromStatus);
  toStatus = normalizeStatus(toStatus);
  if (!toStatus || fromStatus === toStatus) return true;
  const isSA = isSuperAdmin(role);
  const isRO = isResp(role);

  if (!isSA && !isRO && category !== "interne") return false;

  let rule = null;
  if (category === "contact") {
    rule = {
      NOUVEAU: ["A_RAPPELER", "DISCUSSION", "SANS_SUITE", "GAGNE"],
      A_RAPPELER: ["DISCUSSION", "SANS_SUITE", "GAGNE"],
      DISCUSSION: ["A_RAPPELER", "SANS_SUITE", "GAGNE"],
      SANS_SUITE: ["DISCUSSION"],
      GAGNE: []
    };
  } else if (category === "recrutement") {
    rule = {
      NOUVEAU: ["A_RAPPELER", "ENTRETIEN", "REFUSE"],
      A_RAPPELER: ["ENTRETIEN", "REFUSE"],
      ENTRETIEN: ["A_RAPPELER", "RETENU", "REFUSE"],
      RETENU: [],
      REFUSE: []
    };
  } else if (category === "interne") {
    rule = {
      NON_CONSULTE: ["CONSULTE"],
      CONSULTE: ["NON_CONSULTE"]
    };
  } else {
    rule = {
      NOUVEAU: ["A_RAPPELER", "TRAITE"],
      A_RAPPELER: ["TRAITE"],
      TRAITE: ["NOUVEAU"]
    };
  }

  const allowed = rule[fromStatus] || [];
  return allowed.includes(toStatus);
};

module.exports = {
  normalizeStatus,
  validateTacheStatus,
  validateMissionStatus,
  validateMessageStatus
};
