const prisma = require("../prisma");
const { isSuperAdmin } = require("../middlewares/rbac");
const { logAudit } = require("../utils/audit");

const handleDeleteDossier = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const dossier = await tx.dossier.findUnique({
        where: { id },
      });
      if (!dossier) throw new Error("Dossier introuvable.");

      if (dossier.isSystem) {
        throw new Error(
          "Ce dossier est géré automatiquement par le système. Pour le supprimer, supprimez la mission ou le dossier parent associé."
        );
      }

      // 1. Archiver le statut courant du dossier avant corbeille
      await tx.dossier.update({
        where: { id },
        data: { status: "CORBEILLE", statusBeforeTrash: dossier.status },
      });

      // 2. Archiver et marquer les missions du dossier
      const missions = await tx.mission.findMany({
        where: { dossierId: id, status: { not: "CORBEILLE" } },
      });
      for (const m of missions) {
        await tx.mission.update({
          where: { id: m.id },
          data: { status: "CORBEILLE", statusBeforeTrash: m.status },
        });
      }

      // 3. Archiver et marquer les tâches rattachées au dossier ou à ses missions
      const taches = await tx.tache.findMany({
        where: {
          OR: [
            { dossierTacheId: id },
            { mission: { dossierId: id } }
          ],
          status: { not: "CORBEILLE" },
        },
      });
      for (const t of taches) {
        await tx.tache.update({
          where: { id: t.id },
          data: { status: "CORBEILLE", statusBeforeTrash: t.status },
        });
      }

      // 4. Sous-dossiers récursivement
      const markSubFolders = async (parentId) => {
        const children = await tx.dossier.findMany({
          where: { parentDossierId: parentId, status: { not: "CORBEILLE" } },
        });
        for (const child of children) {
          await tx.dossier.update({
            where: { id: child.id },
            data: { status: "CORBEILLE", statusBeforeTrash: child.status },
          });
          const childMissions = await tx.mission.findMany({
            where: { dossierId: child.id, status: { not: "CORBEILLE" } },
          });
          for (const cm of childMissions) {
            await tx.mission.update({
              where: { id: cm.id },
              data: { status: "CORBEILLE", statusBeforeTrash: cm.status },
            });
          }
          const childTaches = await tx.tache.findMany({
            where: {
              OR: [
                { dossierTacheId: child.id },
                { mission: { dossierId: child.id } }
              ],
              status: { not: "CORBEILLE" },
            },
          });
          for (const ct of childTaches) {
            await tx.tache.update({
              where: { id: ct.id },
              data: { status: "CORBEILLE", statusBeforeTrash: ct.status },
            });
          }
          await markSubFolders(child.id);
        }
      };
      await markSubFolders(id);
    });

    await logAudit(
      req.user?.id,
      "SUPPRESSION_DOSSIER",
      req.params.id,
      "DOSSIER",
      `Dossier et dépendances déplacés dans la corbeille: ${req.params.id}`,
      null,
    );

    res.json({
      success: true,
      message: "Dossier et dépendances déplacés dans la corbeille (soft-delete).",
    });
  } catch (error) {
    console.error(error);
    const status = error.message && error.message.includes("système") ? 403 : 500;
    res.status(status).json({ error: "Erreur lors de la suppression: " + error.message });
  }
};

const handleRestoreDossier = async (req, res) => {
  try {
    if (!isSuperAdmin(req.user.role)) {
      return res.status(403).json({
        error: "Accès refusé. Seul un Super-Administrateur peut restaurer un dossier.",
      });
    }

    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const dossier = await tx.dossier.findUnique({ where: { id } });
      if (!dossier) throw new Error("Dossier introuvable.");
      if (dossier.status !== "CORBEILLE") {
        throw new Error("Ce dossier n'est pas en corbeille.");
      }

      // 1. Restaurer le dossier
      await tx.dossier.update({
        where: { id },
        data: {
          status: dossier.statusBeforeTrash || dossier.previousStatus || "NOUVEAU",
          statusBeforeTrash: null,
        },
      });

      // 2. Restaurer toutes les missions avec leur statut initial
      const missions = await tx.mission.findMany({
        where: { dossierId: id, status: "CORBEILLE" },
      });
      for (const m of missions) {
        await tx.mission.update({
          where: { id: m.id },
          data: {
            status: m.statusBeforeTrash || m.previousStatus || "NOUVEAU",
            statusBeforeTrash: null,
          },
        });
      }

      // 3. Restaurer toutes les tâches avec leur statut initial
      const taches = await tx.tache.findMany({
        where: {
          OR: [
            { dossierTacheId: id },
            { mission: { dossierId: id } }
          ],
          status: "CORBEILLE",
        },
      });
      for (const t of taches) {
        await tx.tache.update({
          where: { id: t.id },
          data: {
            status: t.statusBeforeTrash || t.previousStatus || "NOUVEAU",
            statusBeforeTrash: null,
          },
        });
      }

      // 4. Restaurer récursivement les sous-dossiers
      const restoreSubHierarchy = async (parentId) => {
        const children = await tx.dossier.findMany({
          where: { parentDossierId: parentId, status: "CORBEILLE" },
        });
        for (const child of children) {
          await tx.dossier.update({
            where: { id: child.id },
            data: {
              status: child.statusBeforeTrash || child.previousStatus || "NOUVEAU",
              statusBeforeTrash: null,
            },
          });
          const childMissions = await tx.mission.findMany({
            where: { dossierId: child.id, status: "CORBEILLE" },
          });
          for (const cm of childMissions) {
            await tx.mission.update({
              where: { id: cm.id },
              data: {
                status: cm.statusBeforeTrash || cm.previousStatus || "NOUVEAU",
                statusBeforeTrash: null,
              },
            });
          }
          const childTaches = await tx.tache.findMany({
            where: {
              OR: [
                { dossierTacheId: child.id },
                { mission: { dossierId: child.id } }
              ],
              status: "CORBEILLE",
            },
          });
          for (const ct of childTaches) {
            await tx.tache.update({
              where: { id: ct.id },
              data: {
                status: ct.statusBeforeTrash || ct.previousStatus || "NOUVEAU",
                statusBeforeTrash: null,
              },
            });
          }
          await restoreSubHierarchy(child.id);
        }
      };
      await restoreSubHierarchy(id);
    });

    await logAudit(
      req.user?.id,
      "RESTAURATION_DOSSIER",
      id,
      "DOSSIER",
      `Dossier et composants restaurés avec succès: ${id}`,
      null,
    );
    res.json({ success: true, message: "Dossier et composants restaurés avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la restauration: " + error.message });
  }
};


module.exports = {
  handleDeleteDossier,
  handleRestoreDossier,
};
