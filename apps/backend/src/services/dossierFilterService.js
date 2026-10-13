/**
 * Service de génération de clauses Prisma pour le contrôle d'accès hiérarchique
 * et l'application du principe d'absorption des droits (Dossier > Mission > Tâche).
 */

const { isRelecteur, isSuperAdmin } = require("../middlewares/rbac");

const HIERARCHY_LEVELS = {
  NONE: 0,
  TACHE: 1,
  MISSION: 2,
  DOSSIER: 3,
  SUPER_ADMIN: 4,
};

/**
 * Construit la clause `where` Prisma pour filtrer les Dossiers selon la matrice pyramidale
 * @param {Object} user - L'utilisateur connecté (req.user)
 * @param {Object} [options] - Options de configuration (ex: { genericSchema: false })
 * @returns {Object} Clause Prisma where
 */
function buildDossierAccessFilter(user, options = {}) {
  const roleName = user?.role?.name || user?.role;

  // 1. Le Super-administrateur voit l'ensemble des dossiers sans restriction
  if (isSuperAdmin ? isSuperAdmin(user) : roleName === "Super-administrateur" || user?.id === "MASTER-ADMIN") {
    return {};
  }

  const userId = user?.id;
  if (!userId) {
    return { id: "__UNAUTHORIZED_EMPTY__" };
  }

  const isUserRelecteur = isRelecteur ? isRelecteur(user) : roleName === "Relecteur";

  // Mode spécification générique (pseudo-code du prompt de cadrage)
  if (options.genericSchema) {
    const conditions = [
      // Règle racine : assigné directement au dossier
      { assignes: { some: { id: userId } } },

      // Règle intermédiaire : assigné à une mission du dossier
      { missions: { some: { assignes: { some: { id: userId } } } } },
    ];

    // Exception Relecteur : visibilité ascendante si assigné à une tâche
    if (isUserRelecteur) {
      conditions.push({
        missions: {
          some: {
            taches: {
              some: {
                assignes: { some: { id: userId } },
              },
            },
          },
        },
      });
    }

    return { OR: conditions };
  }

  // Mode schéma réel (compatibilité base SQLite / schema.prisma)
  const conditions = [
    // Règle racine : assigné directement au dossier (traitant ou créateur)
    { traitantId: userId },
    { createdById: userId },

    // Règle intermédiaire : assigné à une mission du dossier
    {
      missions: {
        some: {
          OR: [
            { assignedToId: userId },
            { relecteurId: userId },
            { createdById: userId },
          ],
        },
      },
    },
  ];

  // Exception Relecteur : visibilité ascendante si assigné à une tâche
  if (isUserRelecteur) {
    conditions.push({
      missions: {
        some: {
          taches: {
            some: {
              OR: [
                { relecteurId: userId },
                { assignedToId: userId },
              ],
            },
          },
        },
      },
    });

    conditions.push({
      tachesLinked: {
        some: {
          OR: [
            { relecteurId: userId },
            { assignedToId: userId },
          ],
        },
      },
    });
  }

  return { OR: conditions };
}

/**
 * Construit la clause `where` Prisma pour filtrer les Missions
 * @param {Object} user - L'utilisateur connecté (req.user)
 * @param {Object} [options] - Options de configuration (ex: { genericSchema: false })
 * @returns {Object} Clause Prisma where
 */
function buildMissionAccessFilter(user, options = {}) {
  const roleName = user?.role?.name || user?.role;

  if (isSuperAdmin ? isSuperAdmin(user) : roleName === "Super-administrateur" || user?.id === "MASTER-ADMIN") {
    return {};
  }

  const userId = user?.id;
  if (!userId) {
    return { id: "__UNAUTHORIZED_EMPTY__" };
  }

  const isUserRelecteur = isRelecteur ? isRelecteur(user) : roleName === "Relecteur";

  // Mode spécification générique
  if (options.genericSchema) {
    const conditions = [
      // Absorption haute : assigné au dossier parent
      { dossier: { assignes: { some: { id: userId } } } },

      // Assigné directement à la mission
      { assignes: { some: { id: userId } } },
    ];

    // Exception Relecteur : visibilité sur la mission parente d'une tâche assignée
    if (isUserRelecteur) {
      conditions.push({
        taches: {
          some: {
            assignes: { some: { id: userId } },
          },
        },
      });
    }

    return { OR: conditions };
  }

  // Mode schéma réel
  const conditions = [
    // Absorption haute : assigné au dossier parent
    { dossier: { traitantId: userId } },
    { dossier: { createdById: userId } },

    // Assigné directement à la mission
    { assignedToId: userId },
    { relecteurId: userId },
    { createdById: userId },
  ];

  // Exception Relecteur : visibilité sur la mission parente d'une tâche assignée
  if (isUserRelecteur) {
    conditions.push({
      taches: {
        some: {
          OR: [
            { relecteurId: userId },
            { assignedToId: userId },
          ],
        },
      },
    });
  }

  return { OR: conditions };
}

/**
 * Construit la clause `where` Prisma pour filtrer les Tâches
 * @param {Object} user - L'utilisateur connecté (req.user)
 * @param {Object} [options] - Options de configuration (ex: { genericSchema: false })
 * @returns {Object} Clause Prisma where
 */
function buildTacheAccessFilter(user, options = {}) {
  const roleName = user?.role?.name || user?.role;

  if (isSuperAdmin ? isSuperAdmin(user) : roleName === "Super-administrateur" || user?.id === "MASTER-ADMIN") {
    return {};
  }

  const userId = user?.id;
  if (!userId) {
    return { id: "__UNAUTHORIZED_EMPTY__" };
  }

  // Mode spécification générique
  if (options.genericSchema) {
    return {
      OR: [
        // Absorption niveau Dossier : assigné au dossier contenant la mission de la tâche
        { mission: { dossier: { assignes: { some: { id: userId } } } } },

        // Absorption niveau Mission : assigné à la mission parente de la tâche
        { mission: { assignes: { some: { id: userId } } } },

        // Assigné directement à la tâche
        { assignes: { some: { id: userId } } },
      ],
    };
  }

  // Mode schéma réel
  return {
    OR: [
      // Absorption niveau Dossier : assigné au dossier contenant la mission de la tâche
      { mission: { dossier: { traitantId: userId } } },
      { mission: { dossier: { createdById: userId } } },
      { dossierTache: { traitantId: userId } },
      { dossierTache: { createdById: userId } },

      // Absorption niveau Mission : assigné à la mission parente de la tâche
      { mission: { assignedToId: userId } },
      { mission: { createdById: userId } },
      { mission: { relecteurId: userId } },

      // Assigné directement à la tâche
      { assignedToId: userId },
      { relecteurId: userId },
      { createdById: userId },
    ],
  };
}

/**
 * Calcule le niveau de droit effectif selon le principe d'absorption :
 * Droits effectifs = max(Assignation Dossier, Assignation Mission, Assignation Tâche)
 *
 * @param {Object} user - Utilisateur
 * @param {Object} context - Contexte d'assignation { dossier, mission, tache }
 * @returns {Object} Résumé des droits effectifs
 */
function getEffectiveRights(user, context = {}) {
  if (isSuperAdmin ? isSuperAdmin(user) : (user?.role?.name || user?.role) === "Super-administrateur" || user?.id === "MASTER-ADMIN") {
    return {
      level: HIERARCHY_LEVELS.SUPER_ADMIN,
      name: "SUPER_ADMIN",
      canReadDossier: true,
      canReadMission: true,
      canReadTache: true,
      canModifyDossier: true,
      canDeleteDossier: true,
      canModifyMission: true,
      canDeleteMission: true,
      canModifyTache: true,
      canDeleteTache: true,
    };
  }

  const userId = user?.id;
  if (!userId) {
    return {
      level: HIERARCHY_LEVELS.NONE,
      name: "NONE",
      canReadDossier: false,
      canReadMission: false,
      canReadTache: false,
      canModifyDossier: false,
      canDeleteDossier: false,
      canModifyMission: false,
      canDeleteMission: false,
      canModifyTache: false,
      canDeleteTache: false,
    };
  }

  const { dossier, mission, tache } = context;
  const isUserRelecteur = isRelecteur ? isRelecteur(user) : (user?.role?.name || user?.role) === "Relecteur";

  const isAssignedDossier = Boolean(
    dossier && (
      dossier.traitantId === userId ||
      dossier.createdById === userId ||
      (Array.isArray(dossier.assignes) && dossier.assignes.some((a) => a.id === userId || a === userId))
    )
  );

  const isAssignedMission = Boolean(
    mission && (
      mission.assignedToId === userId ||
      mission.createdById === userId ||
      mission.relecteurId === userId ||
      (Array.isArray(mission.assignes) && mission.assignes.some((a) => a.id === userId || a === userId))
    )
  );

  const isAssignedTache = Boolean(
    tache && (
      tache.assignedToId === userId ||
      tache.createdById === userId ||
      tache.relecteurId === userId ||
      (Array.isArray(tache.assignes) && tache.assignes.some((a) => a.id === userId || a === userId))
    )
  );

  // Absorption : le conteneur le plus élevé prévaut
  let level = HIERARCHY_LEVELS.NONE;
  let name = "NONE";

  if (isAssignedDossier) {
    level = HIERARCHY_LEVELS.DOSSIER;
    name = "DOSSIER";
  } else if (isAssignedMission) {
    level = HIERARCHY_LEVELS.MISSION;
    name = "MISSION";
  } else if (isAssignedTache) {
    level = HIERARCHY_LEVELS.TACHE;
    name = "TACHE";
  }

  // Exception Relecteur : visibilité ascendante sur la mission parente et le dossier parent
  const hasUpwardRelecteur = isUserRelecteur && isAssignedTache;

  return {
    level,
    name,
    isAssignedDossier,
    isAssignedMission,
    isAssignedTache,
    canReadDossier: isAssignedDossier || hasUpwardRelecteur,
    canReadMission: isAssignedDossier || isAssignedMission || hasUpwardRelecteur,
    canReadTache: isAssignedDossier || isAssignedMission || isAssignedTache,
    // Suppression de Dossier réservée EXCLUSIVEMENT au Super-administrateur
    canDeleteDossier: false,
    canModifyDossier: isAssignedDossier,
    canModifyMission: isAssignedDossier || isAssignedMission,
    // Suppression en cascade des missions par l'assigné Dossier
    canDeleteMission: isAssignedDossier,
    canModifyTache: isAssignedDossier || isAssignedMission || isAssignedTache,
    // Suppression en cascade des tâches par l'assigné Dossier ou Mission
    canDeleteTache: isAssignedDossier || isAssignedMission,
  };
}

module.exports = {
  HIERARCHY_LEVELS,
  buildDossierAccessFilter,
  buildMissionAccessFilter,
  buildTacheAccessFilter,
  getEffectiveRights,
};
