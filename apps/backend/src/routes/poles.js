const express = require("express");
const prisma = require("../prisma");
const { authenticateJWT, requireRoles } = require("../middlewares/auth");

const router = express.Router();

// GET /api/poles
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const poles = await prisma.poleActivite.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(poles);
  } catch (error) {
    console.error("Erreur GET /api/poles:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/poles
router.post("/", authenticateJWT, requireRoles("Super-administrateur", "Administrateur", "Associé"), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Le nom est requis." });

    const newPole = await prisma.poleActivite.create({
      data: { name, description },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id !== "MASTER-ADMIN" ? req.user.id : null,
        action: "CREATION_POLE",
        details: `Création du pôle : ${name}`,
      },
    });

    res.json(newPole);
  } catch (error) {
    console.error("Erreur POST /api/poles:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Un pôle avec ce nom existe déjà." });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/poles/:id
router.put("/:id", authenticateJWT, requireRoles("Super-administrateur", "Administrateur", "Associé"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedPole = await prisma.poleActivite.update({
      where: { id },
      data: { name, description },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id !== "MASTER-ADMIN" ? req.user.id : null,
        action: "MODIFICATION_POLE",
        details: `Modification du pôle : ${updatedPole.name}`,
      },
    });

    res.json(updatedPole);
  } catch (error) {
    console.error("Erreur PUT /api/poles/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/poles/:id
router.delete("/:id", authenticateJWT, requireRoles("Super-administrateur", "Administrateur", "Associé"), async (req, res) => {
  try {
    const { id } = req.params;

    const pole = await prisma.poleActivite.findUnique({ where: { id } });
    if (!pole) return res.status(404).json({ error: "Pôle introuvable" });

    await prisma.poleActivite.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id !== "MASTER-ADMIN" ? req.user.id : null,
        action: "SUPPRESSION_POLE",
        details: `Suppression du pôle : ${pole.name}`,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/poles/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
