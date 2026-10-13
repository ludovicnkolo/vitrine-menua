const {
  buildDossierAccessFilter,
  buildMissionAccessFilter,
  buildTacheAccessFilter,
  getEffectiveRights,
  HIERARCHY_LEVELS,
} = require("../../src/services/dossierFilterService");

const {
  requireSuperAdminToDeleteDossier,
  isSuperAdmin,
  isRelecteur,
} = require("../../src/middlewares/rbac");

describe("Dossier Filter Service & RBAC Pyramid Tests", () => {
  const superAdminUser = {
    id: "usr-sa-1",
    name: "Admin Super",
    role: { name: "Super-administrateur" },
  };

  const relecteurUser = {
    id: "usr-rel-1",
    name: "Marie Relectrice",
    role: "Relecteur",
  };

  const collaborateurUser = {
    id: "usr-col-1",
    name: "Jean Collaborateur",
    role: "Collaborateur",
  };

  const responsableUser = {
    id: "usr-resp-1",
    name: "Alice Responsable",
    role: "Responsable opérationnel",
  };

  describe("1. buildDossierAccessFilter", () => {
    test("Super-administrateur accède à tous les dossiers sans clause where", () => {
      const filter = buildDossierAccessFilter(superAdminUser);
      expect(filter).toEqual({});
    });

    test("Collaborateur standard ne voit QUE les dossiers où il est traitant ou créateur (aucune remontée ascendante de mission ou tâche)", () => {
      const filter = buildDossierAccessFilter(collaborateurUser);
      expect(filter.OR).toBeDefined();
      expect(Array.isArray(filter.OR)).toBe(true);

      // Doit inclure STRICTEMENT traitantId et createdById
      expect(filter.OR).toEqual([
        { traitantId: collaborateurUser.id },
        { createdById: collaborateurUser.id },
      ]);

      // Ne doit JAMAIS inclure les missions (pas de fuite ascendante de dossier)
      const hasMissionCheck = filter.OR.some(
        (c) => c.missions && c.missions.some
      );
      expect(hasMissionCheck).toBe(false);

      // Ne doit PAS inclure les tâches pour un non-relecteur
      const hasTacheUpward = filter.OR.some(
        (c) => c.missions?.some?.taches !== undefined || c.tachesLinked !== undefined
      );
      expect(hasTacheUpward).toBe(false);
    });

    test("Relecteur bénéficie d'une visibilité ascendante exceptionnelle sur le dossier parent via ses tâches", () => {
      const filter = buildDossierAccessFilter(relecteurUser);
      expect(filter.OR).toBeDefined();

      // Vérifie la présence de l'exception Relecteur vers les tâches
      const hasTacheUpward = filter.OR.some(
        (c) => c.missions?.some?.taches !== undefined || c.tachesLinked !== undefined
      );
      expect(hasTacheUpward).toBe(true);
    });

    test("Mode générique (spécification pure) applique le format assignes.some", () => {
      const filter = buildDossierAccessFilter(collaborateurUser, { genericSchema: true });
      expect(filter).toEqual({
        OR: [
          { assignes: { some: { id: collaborateurUser.id } } },
        ],
      });

      const relFilter = buildDossierAccessFilter(relecteurUser, { genericSchema: true });
      expect(relFilter.OR.length).toBe(2);
      expect(relFilter.OR[1]).toEqual({
        missions: {
          some: {
            taches: {
              some: {
                assignes: { some: { id: relecteurUser.id } },
              },
            },
          },
        },
      });
    });
  });

  describe("2. buildMissionAccessFilter", () => {
    test("Super-administrateur accède à toutes les missions", () => {
      const filter = buildMissionAccessFilter(superAdminUser);
      expect(filter).toEqual({});
    });

    test("Absorption haute : un utilisateur voit la mission s'il est assigné au dossier ou à la mission", () => {
      const filter = buildMissionAccessFilter(collaborateurUser);
      expect(filter.OR).toBeDefined();

      // Dossier parent (absorption)
      expect(filter.OR).toEqual(
        expect.arrayContaining([
          { dossier: { traitantId: collaborateurUser.id } },
          { dossier: { createdById: collaborateurUser.id } },
          { assignedToId: collaborateurUser.id },
        ])
      );

      // Pas de visibilité ascendante sur les tâches pour un simple collaborateur
      const hasTacheUpward = filter.OR.some((c) => c.taches !== undefined);
      expect(hasTacheUpward).toBe(false);
    });

    test("Exception Relecteur : visibilité ascendante sur la mission parente d'une tâche assignée", () => {
      const filter = buildMissionAccessFilter(relecteurUser);
      const hasTacheUpward = filter.OR.some((c) => c.taches !== undefined);
      expect(hasTacheUpward).toBe(true);
    });

    test("Mode générique buildMissionAccessFilter", () => {
      const filter = buildMissionAccessFilter(collaborateurUser, { genericSchema: true });
      expect(filter).toEqual({
        OR: [
          { dossier: { assignes: { some: { id: collaborateurUser.id } } } },
          { assignes: { some: { id: collaborateurUser.id } } },
        ],
      });
    });
  });

  describe("3. buildTacheAccessFilter", () => {
    test("Super-administrateur accède à toutes les tâches", () => {
      const filter = buildTacheAccessFilter(superAdminUser);
      expect(filter).toEqual({});
    });

    test("Filtre Tâche inclut absorption Dossier + absorption Mission + assignation directe", () => {
      const filter = buildTacheAccessFilter(collaborateurUser);
      expect(filter.OR).toBeDefined();

      // Absorption niveau Dossier
      expect(filter.OR).toEqual(
        expect.arrayContaining([
          { mission: { dossier: { traitantId: collaborateurUser.id } } },
          { mission: { assignedToId: collaborateurUser.id } },
          { assignedToId: collaborateurUser.id },
        ])
      );
    });

    test("Mode générique buildTacheAccessFilter", () => {
      const filter = buildTacheAccessFilter(collaborateurUser, { genericSchema: true });
      expect(filter).toEqual({
        OR: [
          { mission: { dossier: { assignes: { some: { id: collaborateurUser.id } } } } },
          { mission: { assignes: { some: { id: collaborateurUser.id } } } },
          { assignes: { some: { id: collaborateurUser.id } } },
        ],
      });
    });
  });

  describe("4. getEffectiveRights (Principe d'absorption des droits)", () => {
    test("Super-administrateur a le niveau maximal et peut supprimer un dossier", () => {
      const rights = getEffectiveRights(superAdminUser, {});
      expect(rights.level).toBe(HIERARCHY_LEVELS.SUPER_ADMIN);
      expect(rights.canDeleteDossier).toBe(true);
      expect(rights.canModifyDossier).toBe(true);
      expect(rights.canDeleteMission).toBe(true);
      expect(rights.canDeleteTache).toBe(true);
    });

    test("Exemple 1 : Assigné à une Mission ET à une Tâche de cette mission -> absorbe au niveau Mission", () => {
      const context = {
        mission: { id: "m-1", assignedToId: collaborateurUser.id },
        tache: { id: "t-1", assignedToId: collaborateurUser.id },
      };

      const rights = getEffectiveRights(collaborateurUser, context);
      expect(rights.level).toBe(HIERARCHY_LEVELS.MISSION);
      expect(rights.name).toBe("MISSION");
      expect(rights.canReadMission).toBe(true);
      expect(rights.canReadTache).toBe(true);
      expect(rights.canModifyMission).toBe(true);
      expect(rights.canModifyTache).toBe(true);
      // L'assigné mission peut supprimer ses tâches rattachées en cascade
      expect(rights.canDeleteTache).toBe(true);
      // Mais ne peut pas supprimer la mission (seul dossier ou admin)
      expect(rights.canDeleteMission).toBe(false);
      // Et JAMAIS supprimer le dossier
      expect(rights.canDeleteDossier).toBe(false);
    });

    test("Exemple 2 : Assigné au Dossier ET à une Mission -> absorbe au niveau Dossier", () => {
      const context = {
        dossier: { id: "d-1", traitantId: collaborateurUser.id },
        mission: { id: "m-1", assignedToId: collaborateurUser.id },
      };

      const rights = getEffectiveRights(collaborateurUser, context);
      expect(rights.level).toBe(HIERARCHY_LEVELS.DOSSIER);
      expect(rights.name).toBe("DOSSIER");
      expect(rights.canReadDossier).toBe(true);
      expect(rights.canReadMission).toBe(true);
      expect(rights.canReadTache).toBe(true);
      expect(rights.canModifyDossier).toBe(true);
      expect(rights.canModifyMission).toBe(true);
      // L'assigné au dossier peut supprimer les missions et les tâches
      expect(rights.canDeleteMission).toBe(true);
      expect(rights.canDeleteTache).toBe(true);
      // VERROUILLAGE STRICT : Aucun utilisateur même assigné au dossier ne peut supprimer un dossier
      expect(rights.canDeleteDossier).toBe(false);
    });

    test("Assigné uniquement à une Tâche : voit et modifie uniquement cette tâche", () => {
      const context = {
        tache: { id: "t-1", assignedToId: collaborateurUser.id },
      };

      const rights = getEffectiveRights(collaborateurUser, context);
      expect(rights.level).toBe(HIERARCHY_LEVELS.TACHE);
      expect(rights.canReadTache).toBe(true);
      expect(rights.canModifyTache).toBe(true);
      expect(rights.canReadDossier).toBe(false);
      expect(rights.canReadMission).toBe(false);
      expect(rights.canDeleteMission).toBe(false);
      expect(rights.canDeleteTache).toBe(false);
    });

    test("Relecteur assigné à une tâche bénéficie de la visibilité ascendante sur mission et dossier", () => {
      const context = {
        tache: { id: "t-1", relecteurId: relecteurUser.id },
      };

      const rights = getEffectiveRights(relecteurUser, context);
      expect(rights.canReadTache).toBe(true);
      expect(rights.canReadMission).toBe(true); // Exception Relecteur
      expect(rights.canReadDossier).toBe(true); // Exception Relecteur
      expect(rights.canDeleteDossier).toBe(false);
      expect(rights.canDeleteMission).toBe(false);
    });
  });

  describe("5. Middleware requireSuperAdminToDeleteDossier", () => {
    test("Autorise le Super-administrateur à supprimer", () => {
      const req = { user: superAdminUser };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      requireSuperAdminToDeleteDossier(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("Rejette avec 403 Forbidden tout autre rôle même Responsable opérationnel", () => {
      const req = { user: responsableUser };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      requireSuperAdminToDeleteDossier(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Accès refusé : seul le Super-administrateur peut supprimer un dossier.",
      });
    });

    test("Rejette avec 403 Forbidden un Collaborateur", () => {
      const req = { user: collaborateurUser };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      requireSuperAdminToDeleteDossier(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
