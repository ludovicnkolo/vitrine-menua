import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Role } from "../types/auth";

export interface ContextEntities {
  dossier?: any;
  mission?: any;
  tache?: any;
}

export type HierarchyLevel = "NONE" | "TACHE" | "MISSION" | "DOSSIER" | "SUPER_ADMIN";

export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    const roleName = (typeof user?.role === "object" ? (user?.role as any)?.name : user?.role) as Role | string | undefined;
    const userId = user?.id;

    const isSuperAdmin = Boolean(
      roleName === "Super-administrateur" ||
      userId === "MASTER-ADMIN"
    );

    const isRelecteur = Boolean(roleName === "Relecteur");
    const isResponsable = Boolean(roleName === "Responsable opérationnel");
    const isCollaborateur = Boolean(roleName === "Collaborateur");

    /**
     * Suppression de Dossier (Verrouillage strict) :
     * Exclusivité Super-administrateur. Aucun autre utilisateur (même assigné au dossier)
     * ne peut supprimer un dossier.
     */
    const canDeleteDossier = (_dossier?: any): boolean => {
      return isSuperAdmin;
    };

    /**
     * Modification de Dossier :
     * Super-administrateur ou assigné directement au dossier
     */
    const canModifyDossier = (dossier?: any): boolean => {
      if (isSuperAdmin) return true;
      if (!userId || !dossier) return false;
      return (
        dossier.traitantId === userId ||
        dossier.createdById === userId ||
        (Array.isArray(dossier.assignes) && dossier.assignes.some((a: any) => (a?.id || a) === userId))
      );
    };

    /**
     * Modification de Mission :
     * Super-administrateur, ou assigné au dossier parent (cascade), ou assigné à la mission
     */
    const canModifyMission = (mission?: any, parentDossier?: any): boolean => {
      if (isSuperAdmin) return true;
      if (!userId) return false;

      const dossier = parentDossier || mission?.dossier;
      if (dossier && (dossier.traitantId === userId || dossier.createdById === userId)) {
        return true;
      }

      if (mission && (mission.assignedToId === userId || mission.createdById === userId)) {
        return true;
      }

      return false;
    };

    /**
     * Suppression de Mission :
     * Super-administrateur, ou assigné au dossier parent (cascade descendante)
     */
    const canDeleteMission = (mission?: any, parentDossier?: any): boolean => {
      if (isSuperAdmin) return true;
      if (!userId) return false;

      const dossier = parentDossier || mission?.dossier;
      if (dossier && (dossier.traitantId === userId || dossier.createdById === userId)) {
        return true;
      }

      return false;
    };

    /**
     * Modification de Tâche :
     * Super-administrateur, ou assigné au dossier parent, ou assigné à la mission parente, ou assigné à la tâche
     */
    const canModifyTache = (tache?: any, parentMission?: any, parentDossier?: any): boolean => {
      if (isSuperAdmin) return true;
      if (!userId) return false;

      const dossier = parentDossier || parentMission?.dossier || tache?.mission?.dossier || tache?.dossierTache;
      if (dossier && (dossier.traitantId === userId || dossier.createdById === userId)) {
        return true;
      }

      const mission = parentMission || tache?.mission;
      if (mission && (mission.assignedToId === userId || mission.createdById === userId)) {
        return true;
      }

      if (tache && (tache.assignedToId === userId || tache.createdById === userId)) {
        return true;
      }

      return false;
    };

    /**
     * Suppression de Tâche :
     * Super-administrateur, ou assigné au dossier parent, ou assigné à la mission parente (cascade)
     */
    const canDeleteTache = (tache?: any, parentMission?: any, parentDossier?: any): boolean => {
      if (isSuperAdmin) return true;
      if (!userId) return false;

      const dossier = parentDossier || parentMission?.dossier || tache?.mission?.dossier || tache?.dossierTache;
      if (dossier && (dossier.traitantId === userId || dossier.createdById === userId)) {
        return true;
      }

      const mission = parentMission || tache?.mission;
      if (mission && (mission.assignedToId === userId || mission.createdById === userId)) {
        return true;
      }

      return false;
    };

    /**
     * Calcul des droits effectifs selon le principe d'absorption :
     * Droits effectifs = max(Assignation Dossier, Assignation Mission, Assignation Tâche)
     */
    const getEffectiveRights = (context: ContextEntities = {}) => {
      if (isSuperAdmin) {
        return {
          level: "SUPER_ADMIN" as HierarchyLevel,
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

      if (!userId) {
        return {
          level: "NONE" as HierarchyLevel,
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

      const isAssignedDossier = Boolean(
        dossier && (
          dossier.traitantId === userId ||
          dossier.createdById === userId ||
          (Array.isArray(dossier.assignes) && dossier.assignes.some((a: any) => (a?.id || a) === userId))
        )
      );

      const isAssignedMission = Boolean(
        mission && (
          mission.assignedToId === userId ||
          mission.createdById === userId ||
          mission.relecteurId === userId ||
          (Array.isArray(mission.assignes) && mission.assignes.some((a: any) => (a?.id || a) === userId))
        )
      );

      const isAssignedTache = Boolean(
        tache && (
          tache.assignedToId === userId ||
          tache.createdById === userId ||
          tache.relecteurId === userId ||
          (Array.isArray(tache.assignes) && tache.assignes.some((a: any) => (a?.id || a) === userId))
        )
      );

      let level: HierarchyLevel = "NONE";
      if (isAssignedDossier) {
        level = "DOSSIER";
      } else if (isAssignedMission) {
        level = "MISSION";
      } else if (isAssignedTache) {
        level = "TACHE";
      }

      // Exception Relecteur : visibilité ascendante sur la mission parente et le dossier parent
      const hasUpwardRelecteur = isRelecteur && isAssignedTache;

      return {
        level,
        isAssignedDossier,
        isAssignedMission,
        isAssignedTache,
        canReadDossier: isAssignedDossier || hasUpwardRelecteur,
        canReadMission: isAssignedDossier || isAssignedMission || hasUpwardRelecteur,
        canReadTache: isAssignedDossier || isAssignedMission || isAssignedTache,
        canDeleteDossier: false, // Strictement Super-Admin
        canModifyDossier: isAssignedDossier,
        canModifyMission: isAssignedDossier || isAssignedMission,
        canDeleteMission: isAssignedDossier,
        canModifyTache: isAssignedDossier || isAssignedMission || isAssignedTache,
        canDeleteTache: isAssignedDossier || isAssignedMission,
      };
    };

    return {
      user,
      isSuperAdmin,
      isRelecteur,
      isResponsable,
      isCollaborateur,
      canDeleteDossier,
      canModifyDossier,
      canModifyMission,
      canDeleteMission,
      canModifyTache,
      canDeleteTache,
      getEffectiveRights,
    };
  }, [user]);

  return permissions;
}

export default usePermissions;
