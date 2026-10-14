const { canTransitionTache } = require("../../src/utils/statusRules");

describe("Règles Strictes de Transition des Statuts de Tâches", () => {
  const saContext = {
    role: "Super-administrateur",
    isSA: true,
    isAssigned: false,
    isRelecteurAssigned: false,
    isMissionManager: true,
  };

  const assignedWorkerContext = {
    role: "Collaborateur",
    isSA: false,
    isAssigned: true,
    isRelecteurAssigned: false,
    isMissionManager: false,
  };

  const nonAssignedWorkerContext = {
    role: "Collaborateur",
    isSA: false,
    isAssigned: false,
    isRelecteurAssigned: false,
    isMissionManager: false,
  };

  const relecteurContext = {
    role: "Relecteur",
    isSA: false,
    isAssigned: false,
    isRelecteurAssigned: true,
    isMissionManager: false,
  };

  const nonAssignedRelecteurContext = {
    role: "Relecteur",
    isSA: false,
    isAssigned: false,
    isRelecteurAssigned: false,
    isMissionManager: false,
  };

  const missionManagerContext = {
    role: "Responsable opérationnel",
    isSA: false,
    isAssigned: false,
    isRelecteurAssigned: false,
    isMissionManager: true,
  };

  describe("1. Transitions de l'Exécutant / Assigné (+ Super-Admin)", () => {
    test("NOUVEAU -> EN_COURS : Seul l'assigné et le SA peuvent commencer le travail", () => {
      expect(canTransitionTache("NOUVEAU", "EN_COURS", null, assignedWorkerContext)).toBe(true);
      expect(canTransitionTache("NOUVEAU", "EN_COURS", null, saContext)).toBe(true);
      expect(canTransitionTache("NOUVEAU", "EN_COURS", null, nonAssignedWorkerContext)).toBe(false);
      expect(canTransitionTache("NOUVEAU", "EN_COURS", null, relecteurContext)).toBe(false);
      expect(canTransitionTache("NOUVEAU", "EN_COURS", null, missionManagerContext)).toBe(false);
    });

    test("A_CORRIGER -> EN_COURS : Seul l'assigné et le SA peuvent reprendre le travail suite aux remarques", () => {
      expect(canTransitionTache("A_CORRIGER", "EN_COURS", null, assignedWorkerContext)).toBe(true);
      expect(canTransitionTache("A_CORRIGER", "EN_COURS", null, saContext)).toBe(true);
      expect(canTransitionTache("A_CORRIGER", "EN_COURS", null, nonAssignedWorkerContext)).toBe(false);
      expect(canTransitionTache("A_CORRIGER", "EN_COURS", null, relecteurContext)).toBe(false);
      expect(canTransitionTache("A_CORRIGER", "EN_COURS", null, missionManagerContext)).toBe(false);
    });

    test("EN_COURS -> EN_RELECTURE : Seul l'assigné et le SA peuvent soumettre à la relecture", () => {
      expect(canTransitionTache("EN_COURS", "EN_RELECTURE", null, assignedWorkerContext)).toBe(true);
      expect(canTransitionTache("EN_COURS", "EN_RELECTURE", null, saContext)).toBe(true);
      expect(canTransitionTache("EN_COURS", "EN_RELECTURE", null, nonAssignedWorkerContext)).toBe(false);
      expect(canTransitionTache("EN_COURS", "EN_RELECTURE", null, relecteurContext)).toBe(false);
      expect(canTransitionTache("EN_COURS", "EN_RELECTURE", null, missionManagerContext)).toBe(false);
    });
  });

  describe("2. Transitions du Relecteur (+ Super-Admin)", () => {
    test("EN_RELECTURE -> EN_APPROBATION : Seul le relecteur assigné et le SA peuvent valider la conformité", () => {
      expect(canTransitionTache("EN_RELECTURE", "EN_APPROBATION", null, relecteurContext)).toBe(true);
      expect(canTransitionTache("EN_RELECTURE", "EN_APPROBATION", null, saContext)).toBe(true);
      expect(canTransitionTache("EN_RELECTURE", "EN_APPROBATION", null, nonAssignedRelecteurContext)).toBe(false);
      expect(canTransitionTache("EN_RELECTURE", "EN_APPROBATION", null, assignedWorkerContext)).toBe(false);
      expect(canTransitionTache("EN_RELECTURE", "EN_APPROBATION", null, missionManagerContext)).toBe(false);
    });

    test("EN_RELECTURE -> A_CORRIGER : Seul le relecteur assigné et le SA peuvent renvoyer en correction", () => {
      expect(canTransitionTache("EN_RELECTURE", "A_CORRIGER", null, relecteurContext)).toBe(true);
      expect(canTransitionTache("EN_RELECTURE", "A_CORRIGER", null, saContext)).toBe(true);
      expect(canTransitionTache("EN_RELECTURE", "A_CORRIGER", null, nonAssignedRelecteurContext)).toBe(false);
      expect(canTransitionTache("EN_RELECTURE", "A_CORRIGER", null, assignedWorkerContext)).toBe(false);
      expect(canTransitionTache("EN_RELECTURE", "A_CORRIGER", null, missionManagerContext)).toBe(false);
    });

    test("EN_APPROBATION -> A_CORRIGER : Seul le relecteur assigné et le SA peuvent rattraper une erreur avant validation", () => {
      expect(canTransitionTache("EN_APPROBATION", "A_CORRIGER", null, relecteurContext)).toBe(true);
      expect(canTransitionTache("EN_APPROBATION", "A_CORRIGER", null, saContext)).toBe(true);
      expect(canTransitionTache("EN_APPROBATION", "A_CORRIGER", null, nonAssignedRelecteurContext)).toBe(false);
      expect(canTransitionTache("EN_APPROBATION", "A_CORRIGER", null, assignedWorkerContext)).toBe(false);
      expect(canTransitionTache("EN_APPROBATION", "A_CORRIGER", null, missionManagerContext)).toBe(false);
    });
  });

  describe("3. Transitions du Responsable / Mission Manager (+ Super-Admin)", () => {
    test("EN_APPROBATION -> APPROUVEE : Le Mission Manager et le SA valident définitivement", () => {
      expect(canTransitionTache("EN_APPROBATION", "APPROUVEE", null, missionManagerContext)).toBe(true);
      expect(canTransitionTache("EN_APPROBATION", "APPROUVEE", null, saContext)).toBe(true);
      expect(canTransitionTache("EN_APPROBATION", "APPROUVEE", null, assignedWorkerContext)).toBe(false);
      expect(canTransitionTache("EN_APPROBATION", "APPROUVEE", null, relecteurContext)).toBe(false);
    });

    test("APPROUVEE -> TERMINE : Le Mission Manager et le SA clôturent la tâche", () => {
      expect(canTransitionTache("APPROUVEE", "TERMINE", null, missionManagerContext)).toBe(true);
      expect(canTransitionTache("APPROUVEE", "TERMINE", null, saContext)).toBe(true);
      expect(canTransitionTache("APPROUVEE", "TERMINE", null, assignedWorkerContext)).toBe(false);
      expect(canTransitionTache("APPROUVEE", "TERMINE", null, relecteurContext)).toBe(false);
    });
  });
});
