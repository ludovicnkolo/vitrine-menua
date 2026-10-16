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
    ];

    // Exception Relecteur : visibilité ascendante exceptionnelle si assigné en relecture
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
  // Règle d'accès aux dossiers :
  // Toute personne assignée à un dossier, une mission ou une tâche (assigné, relecteur ou créateur)
  // voit automatiquement le dossier rattaché dans le CRM et dans la GED.
  const conditions = [
    // 1. Assignation directe au dossier
    { traitantId: userId },
    { createdById: userId },
    { targetUserId: userId },
  ];

  if (user?.clientId) {
    conditions.push({ clientId: user.clientId });
  }

  // 2. Assigné, relecteur ou créateur d'une mission de ce dossier
  conditions.push({
    missions: {
      some: {
        OR: [
          { assignedToId: userId },
          { relecteurId: userId },
          { createdById: userId },
        ],
      },
    },
  });

  // 3. Assigné, relecteur ou créateur d'une tâche de ce dossier (via mission parente)
  conditions.push({
    missions: {
      some: {
        taches: {
          some: {
            OR: [
              { assignedToId: userId },
              { relecteurId: userId },
              { createdById: userId },
            ],
          },
        },
      },
    },
  });

  // 4. Missions et Tâches liées directement au dossier
  conditions.push({
    missionsLinked: {
      some: {
        OR: [
          { assignedToId: userId },
          { relecteurId: userId },
          { createdById: userId },
        ],
      },
    },
  });

  conditions.push({
    tachesLinked: {
      some: {
        OR: [
          { assignedToId: userId },
          { relecteurId: userId },
          { createdById: userId },
        ],
      },
    },
  });

  // 5. Visibilité hiérarchique pour la GED :
  // Si un sous-dossier contient une mission/tâche de l'utilisateur, le dossier racine est visible pour naviguer
  conditions.push({
    subDossiers: {
      some: {
        OR: [
          { traitantId: userId },
          { createdById: userId },
          { targetUserId: userId },
          {
            missions: {
              some: {
                OR: [
                  { assignedToId: userId },
                  { relecteurId: userId },
                  { createdById: userId },
                  {
                    taches: {
                      some: {
                        OR: [
                          { assignedToId: userId },
                          { relecteurId: userId },
                          { createdById: userId },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            tachesLinked: {
              some: {
                OR: [
                  { assignedToId: userId },
                  { relecteurId: userId },
                  { createdById: userId },
                ],
              },
            },
          },
        ],
      },
    },
  });

  // Et les sous-dossiers d'un dossier parent accessible sont également visibles
  conditions.push({
    parentDossier: {
      OR: [
        { traitantId: userId },
        { createdById: userId },
        { targetUserId: userId },
      ],
    },
  });

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

    // Visibilité sur la mission parente d'une tâche assignée
    conditions.push({
      taches: {
        some: {
          assignes: { some: { id: userId } },
        },
      },
    });

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

    // Visibilité sur la mission parente d'une tâche assignée ou dont l'utilisateur est relecteur
    {
      taches: {
        some: {
          OR: [
            { relecteurId: userId },
            { assignedToId: userId },
            { createdById: userId },
          ],
        },
      },
    },
  ];

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

  // Visibilité ascendante : toute personne assignée à une tâche ou une mission voit la mission parente et le dossier rattaché
  const hasAccess = isAssignedDossier || isAssignedMission || isAssignedTache;

  return {
    level,
    name,
    isAssignedDossier,
    isAssignedMission,
    isAssignedTache,
    canReadDossier: hasAccess,
    canReadMission: hasAccess,
    canReadTache: hasAccess,
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
