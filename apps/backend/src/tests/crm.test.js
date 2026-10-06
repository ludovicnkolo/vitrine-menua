const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
process.env.JWT_SECRET = "CHANGE_MOI_EN_PRODUCTION_openssl_rand_base64_64";

// NO MOCKS for Prisma. Real database connection.
const prisma = require("../prisma");

// Real middlewares and modularized routers
const authMiddleware = require("../middlewares/auth");

const app = express();
app.use(express.json());

// Injecter les vrais routers modulaires
app.use("/api/crm", require("../routes/crm/users"));
app.use("/api/crm", require("../routes/crm/clients"));
app.use("/api/crm", require("../routes/crm/dossiers"));
app.use("/api/crm", require("../routes/crm/audit"));
app.use("/api/crm", require("../routes/crm/missions"));
app.use("/api/crm", require("../routes/crm/taches"));
app.use("/api/crm", require("../routes/crm/documents"));
app.use("/api/crm", require("../routes/crm/messages"));
app.use("/api/crm", require("../routes/crm/dashboard"));
app.use("/api/crm", require("../routes/crm/notifications"));

describe("Suite de tests CRM (Tests RÉELS d'intégration)", () => {
  let token = "";
  let adminUser = null;
  let testRoleId = null;
  let testDossierId = null;

  beforeAll(async () => {
    // Trouver un admin réel dans la base de données locale
    adminUser = await prisma.utilisateur.findFirst({
      where: { role: { name: "Super-administrateur" } },
      include: { role: true },
    });

    if (!adminUser) {
      throw new Error(
        "Impossible de trouver un Super-administrateur pour exécuter les tests réels.",
      );
    }

    // Générer un VRAI token JWT pour l'authentification
    token = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role.name },
      process.env.JWT_SECRET ||
        "CHANGE_MOI_EN_PRODUCTION_openssl_rand_base64_64",
      { expiresIn: "1h" },
    );
  });

  afterAll(async () => {
    // Nettoyage des données créées pendant le test
    if (testRoleId) {
      await prisma.role.delete({ where: { id: testRoleId } }).catch(() => {});
    }
    if (testDossierId) {
      await prisma.dossier
        .delete({ where: { id: testDossierId } })
        .catch(() => {});
    }
    // Fermer la connexion prisma
    await prisma.$disconnect();
  });

  describe("GET /api/crm/dashboard-stats", () => {
    it("devrait retourner les KPIs stratégiques réels avec un code 200", async () => {
      const res = await request(app)
        .get("/api/crm/dashboard-stats")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty("alertesPrioritaires");
      expect(res.body).toHaveProperty("delaisCritiques");
      expect(res.body).toHaveProperty("entonnoirPeriode");
      expect(Array.isArray(res.body.entonnoirPeriode)).toBe(true);
    });
  });

  describe("GET /api/crm/roles", () => {
    it("devrait retourner la liste réelle des rôles", async () => {
      const res = await request(app)
        .get("/api/crm/roles")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/crm/roles", () => {
    it("devrait créer un rôle de test réel dans la base de données", async () => {
      const uniqueRoleName = `RoleTest_${Date.now()}`;

      const res = await request(app)
        .post("/api/crm/roles")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: uniqueRoleName,
          isClient: false,
          permissions: '{"dashboard": true}',
        })
        .expect(200);

      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe(uniqueRoleName);
      testRoleId = res.body.id; // Sauvegarde pour suppression à la fin
    });
  });

  describe("GET /api/crm/users", () => {
    it("devrait retourner la liste réelle des utilisateurs", async () => {
      const res = await request(app)
        .get("/api/crm/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      const adminInResponse = res.body.find((u) => u.id === adminUser.id);
      expect(adminInResponse).toBeDefined();
    });
  });

  describe("GET /api/crm/dossiers", () => {
    it("devrait retourner la liste réelle des dossiers paginée", async () => {
      const res = await request(app)
        .get("/api/crm/dossiers")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty("page");
      expect(res.body).toHaveProperty("totalPages");
    });
  });

  describe("POST /api/crm/dossiers", () => {
    it("devrait créer un dossier de test réel", async () => {
      const res = await request(app)
        .post("/api/crm/dossiers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Dossier de Test Intégration", typeDossier: "Fiscal" })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.name.toLowerCase()).toContain("dossier de test intégration");
      testDossierId = res.body.id; // Sauvegarde pour suppression
    });
  });

  describe("GET /api/crm/taches", () => {
    it("devrait retourner la liste réelle des tâches paginée", async () => {
      const res = await request(app)
        .get("/api/crm/taches")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
