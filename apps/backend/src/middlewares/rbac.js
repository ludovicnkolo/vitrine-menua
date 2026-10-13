/**
 * Middlewares de contrôle d'accès basé sur les rôles (RBAC)
 * et gestion des permissions pyramidales Dossier > Mission > Tâche
 */

/**
 * Détermine si l'utilisateur possède le rôle Super-administrateur
 */
const isSuperAdmin = (user) => {
  const roleName = user?.role?.name || user?.role;
  return roleName === "Super-administrateur" || user?.id === "MASTER-ADMIN";
};

/**
 * Détermine si l'utilisateur possède le rôle Relecteur
 */
const isRelecteur = (user) => {
  const roleName = user?.role?.name || user?.role;
  return roleName === "Relecteur";
};

/**
 * Détermine si l'utilisateur possède le rôle Responsable opérationnel
 */
const isResponsable = (user) => {
  const roleName = user?.role?.name || user?.role;
  return roleName === "Responsable opérationnel";
};

/**
 * Vérifie l'interdiction stricte de supprimer un dossier pour les non Super-administrateurs
 * Rejet impératif avec une erreur 403 Forbidden
 */
const requireSuperAdminToDeleteDossier = (req, res, next) => {
  const roleName = req.user?.role?.name || req.user?.role;
  if (roleName !== "Super-administrateur" && req.user?.id !== "MASTER-ADMIN") {
    return res.status(403).json({
      error: "Accès refusé : seul le Super-administrateur peut supprimer un dossier.",
    });
  }
  next();
};

/**
 * Vérifie si un utilisateur a le droit de modifier une mission
 * - Super-admin : toujours autorisé
 * - Assigné au dossier parent : autorisé (droit cascade descendant)
 * - Assigné directement à la mission : autorisé
 */
const canModifyMission = (user, mission, parentDossier) => {
  if (isSuperAdmin(user)) return true;
  const userId = user?.id;
  if (!userId) return false;

  // Assigné au dossier parent (absorption des droits)
  if (parentDossier && (parentDossier.traitantId === userId || parentDossier.createdById === userId)) {
    return true;
  }
  if (mission?.dossier && (mission.dossier.traitantId === userId || mission.dossier.createdById === userId)) {
    return true;
  }

  // Assigné à la mission
  if (mission && (mission.assignedToId === userId || mission.createdById === userId)) {
    return true;
  }

  return false;
};

/**
 * Vérifie si un utilisateur a le droit de supprimer une mission
 * - Super-admin : toujours autorisé
 * - Assigné au dossier parent : autorisé (droit cascade descendant)
 */
const canDeleteMission = (user, mission, parentDossier) => {
  if (isSuperAdmin(user)) return true;
  const userId = user?.id;
  if (!userId) return false;

  if (parentDossier && (parentDossier.traitantId === userId || parentDossier.createdById === userId)) {
    return true;
  }
  if (mission?.dossier && (mission.dossier.traitantId === userId || mission.dossier.createdById === userId)) {
    return true;
  }

  return false;
};

/**
 * Vérifie si un utilisateur a le droit de modifier une tâche
 * - Super-admin : toujours autorisé
 * - Assigné au dossier parent : autorisé (droit cascade descendant)
 * - Assigné à la mission parente : autorisé (droit cascade descendant)
 * - Assigné directement à la tâche : autorisé
 */
const canModifyTache = (user, tache, parentMission, parentDossier) => {
  if (isSuperAdmin(user)) return true;
  const userId = user?.id;
  if (!userId) return false;

  // Assigné au dossier racine
  const dossier = parentDossier || parentMission?.dossier || tache?.mission?.dossier;
  if (dossier && (dossier.traitantId === userId || dossier.createdById === userId)) {
    return true;
  }

  // Assigné à la mission parente
  const mission = parentMission || tache?.mission;
  if (mission && (mission.assignedToId === userId || mission.createdById === userId)) {
    return true;
  }

  // Assigné à la tâche
  if (tache && (tache.assignedToId === userId || tache.createdById === userId)) {
    return true;
  }

  return false;
};

/**
 * Vérifie si un utilisateur a le droit de supprimer une tâche
 * - Super-admin : toujours autorisé
 * - Assigné au dossier parent : autorisé (droit cascade descendant)
 * - Assigné à la mission parente : autorisé (droit cascade descendant)
 */
const canDeleteTache = (user, tache, parentMission, parentDossier) => {
  if (isSuperAdmin(user)) return true;
  const userId = user?.id;
  if (!userId) return false;

  const dossier = parentDossier || parentMission?.dossier || tache?.mission?.dossier;
  if (dossier && (dossier.traitantId === userId || dossier.createdById === userId)) {
    return true;
  }

  const mission = parentMission || tache?.mission;
  if (mission && (mission.assignedToId === userId || mission.createdById === userId)) {
    return true;
  }

  return false;
};

module.exports = {
  isSuperAdmin,
  isRelecteur,
  isResponsable,
  requireSuperAdminToDeleteDossier,
  canModifyMission,
  canDeleteMission,
  canModifyTache,
  canDeleteTache,
};
