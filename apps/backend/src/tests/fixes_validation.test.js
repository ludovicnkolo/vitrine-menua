const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");

process.env.JWT_SECRET = "TEST_SECRET_FOR_VALIDATION_SUITE_123456789";

const prisma = require("../prisma");

const app = express();
app.use(express.json());

// Mount auth and CRM routers
app.use("/api/auth", require("../routes/auth"));
app.use("/api/crm", require("../routes/crm/clients"));
app.use("/api/crm", require("../routes/crm/users"));
app.use("/api/crm", require("../routes/crm/audit"));

describe("Validation des Correctifs Recette V3", () => {
  let token = "";
  let adminUser = null;
  let testUserId = null;
  let testClientId = null;
  let setupToken = "";

  beforeAll(async () => {
    adminUser = await prisma.utilisateur.findFirst({
      where: { role: { name: "Super-administrateur" } },
      include: { role: true },
    });

    if (!adminUser) {
      throw new Error("Super-administrateur introuvable pour les tests.");
    }

    token = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.utilisateur.delete({ where: { id: testUserId } }).catch(() => {});
    }
    if (testClientId) {
      await prisma.client.delete({ where: { id: testClientId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  test("1. Activation de compte utilisateur via /api/auth/setup-password", async () => {
    setupToken = crypto.randomBytes(32).toString("hex");
    const tempPassword = await bcrypt.hash("OldPassword123!", 10);

    const newUser = await prisma.utilisateur.create({
      data: {
        name: "Test Recette User",
        email: `recette_${Date.now()}@test.menua.local`,
        password: tempPassword,
        resetToken: setupToken,
        resetTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "Invitation envoyée",
        telephone: `+33${Math.floor(100000000 + Math.random() * 900000000)}`,
        lieuResidence: "Paris",
        experienceCle: "Expertise comptable",
        langues: "Français, Anglais",
      },
    });
    testUserId = newUser.id;

    // Call /api/auth/setup-password
    const res = await request(app)
      .post("/api/auth/setup-password")
      .send({
        token: setupToken,
        password: "SuperSecureNewPassword2026!",
      })
      .expect(200);

    expect(res.body.success).toBe(true);

    // Verify user is now Actif and token is cleared
    const updatedUser = await prisma.utilisateur.findUnique({
      where: { id: testUserId },
    });
    expect(updatedUser.status).toBe("Actif");
    expect(updatedUser.resetToken).toBeNull();
    expect(updatedUser.resetTokenExpiry).toBeNull();

    // Verify new password matches
    const isMatch = await bcrypt.compare(
      "SuperSecureNewPassword2026!",
      updatedUser.password,
    );
    expect(isMatch).toBe(true);
  });

  test("2. Création et Modification Client avec Entreprise (gestion casse Société/SOCIETE)", async () => {
    const clientEmail = `client_${Date.now()}@test.menua.local`;

    // Test POST client with type "Société"
    const createRes = await request(app)
      .post("/api/crm/clients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "ACME Corporation",
        email: clientEmail,
        type: "Société",
        siret: "12345678900012",
        raisonSociale: "ACME SAS",
        emailEntreprise: "contact@acme.com",
        telephoneEntreprise: "0102030405",
      })
      .expect(201);

    testClientId = createRes.body.id;
    expect(createRes.body.name).toBe("ACME Corporation");
    expect(createRes.body.type).toBe("SOCIETE");
    expect(createRes.body.entreprise).toBeDefined();
    expect(createRes.body.entreprise.siret).toBe("12345678900012");
    expect(createRes.body.entreprise.raisonSociale).toBe("ACME SAS");

    // Test PATCH client with new corporate details
    const patchRes = await request(app)
      .patch(`/api/crm/clients/${testClientId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        raisonSociale: "ACME Global Holdings",
        siret: "98765432100099",
      })
      .expect(200);

    expect(patchRes.body.entreprise.raisonSociale).toBe("ACME Global Holdings");
    expect(patchRes.body.entreprise.siret).toBe("98765432100099");
  });

  test("3. Service S3 exporte purgeFromS3 pour la suppression versionnée OVH", () => {
    const s3Service = require("../services/s3Service");
    expect(typeof s3Service.purgeFromS3).toBe("function");
    expect(typeof s3Service.deleteFromS3).toBe("function");
  });
});
