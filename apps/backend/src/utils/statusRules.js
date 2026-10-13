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

const validateTacheStatus = (fromStatus, toStatus, role) => {
  fromStatus = normalizeStatus(fromStatus);
  toStatus = normalizeStatus(toStatus);
  if (!toStatus || fromStatus === toStatus) return true;
  const isSA = isSuperAdmin(role);
  const isRO = isResp(role);
  const isRel = isRelecteur(role);
  const isCol = isCollab(role);
  const isRespOrAdmin = isSA || isRO;

  const VALID_TRANSITIONS = {
    NOUVEAU: {
      allowed: ["EN_COURS", "EN_ATTENTE", "BLOQUE"],
      check: () => true
    },
    EN_COURS: {
      allowed: ["EN_RELECTURE", "BLOQUE", "EN_ATTENTE"],
      check: (t) => {
        if (t === "BLOQUE" && isCol) return false;
        return true;
      }
    },
    EN_RELECTURE: {
      allowed: ["EN_APPROBATION", "A_CORRIGER", "EN_ATTENTE"],
      check: () => isSA || isRel
    },
    EN_APPROBATION: {
      allowed: ["APPROUVEE", "A_CORRIGER", "EN_COURS"],
      check: () => isSA || isRO
    },
    APPROUVEE: {
      allowed: ["EN_COURS"],
      check: () => isSA
    },
    A_CORRIGER: {
      allowed: ["EN_COURS", "BLOQUE"],
      check: () => true
    },
    BLOQUE: {
      allowed: ["EN_COURS"],
      check: () => true
    },
    EN_ATTENTE: {
      allowed: ["EN_COURS"],
      check: () => true
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

const validateMissionStatus = (fromStatus, toStatus, role) => {
  fromStatus = normalizeStatus(fromStatus);
  toStatus = normalizeStatus(toStatus);
  if (!toStatus || fromStatus === toStatus) return true;
  const isSA = isSuperAdmin(role);
  const isRO = isResp(role);
  const isRespOrAdmin = isSA || isRO;

  const VALID_TRANSITIONS = {
    NOUVEAU: {
      allowed: ["EN_COURS", "EN_ATTENTE", "BLOQUE"],
      check: () => isRespOrAdmin
    },
    EN_COURS: {
      allowed: ["TERMINE", "BLOQUE", "EN_ATTENTE"],
      check: () => isRespOrAdmin
    },
    BLOQUE: {
      allowed: ["EN_COURS"],
      check: () => isRespOrAdmin
    },
    EN_ATTENTE: {
      allowed: ["EN_COURS"],
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
