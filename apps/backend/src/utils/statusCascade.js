const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function notifyUsers(recipients, payload) {
  if (!recipients || recipients.length === 0) return;
  const uniqueRecipients = [...new Set(recipients)];
  await prisma.notification.createMany({
    data: uniqueRecipients.map((userId) => ({
      userId,
      ...payload,
    })),
  });
}

async function cascadePauseDossier(dossierId) {
  // Find active missions
  const missionsToPause = await prisma.mission.findMany({
     where: { dossierId: dossierId, status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE", "BLOQUE", "EN_ATTENTE"] } },
     select: { id: true, status: true, reference: true, assignedToId: true }
  });
  
  const missionRecipients = [];
  
  for (const m of missionsToPause) {
     await prisma.mission.update({
        where: { id: m.id },
        data: { status: "EN_ATTENTE", previousStatus: m.status }
     });
     if (m.assignedToId) {
       missionRecipients.push(m.assignedToId);
     }
  }

  // Find active tasks
  const tachesToPause = await prisma.tache.findMany({
     where: { 
        OR: [
          { mission: { dossierId: dossierId } },
          { dossierTacheId: dossierId }
        ], 
        status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE", "BLOQUE", "EN_ATTENTE", "VALIDEE"] } 
     },
     select: { id: true, status: true, reference: true, assignedToId: true }
  });
  
  const tacheRecipients = [];

  for (const t of tachesToPause) {
     await prisma.tache.update({
        where: { id: t.id },
        data: { status: "EN_ATTENTE", previousStatus: t.status }
     });
     if (t.assignedToId) {
       tacheRecipients.push(t.assignedToId);
     }
  }

  // Notify affected users
  if (missionRecipients.length > 0) {
    await notifyUsers(missionRecipients, {
      type: "MISSION_EN_ATTENTE",
      title: "Mission mise en attente",
      message: `Une mission sur laquelle vous êtes assigné a été mise en attente suite à la mise en attente de son dossier parent.`,
      targetType: "MISSION",
    });
  }

  if (tacheRecipients.length > 0) {
    await notifyUsers(tacheRecipients, {
      type: "TACHE_EN_ATTENTE",
      title: "Tâche mise en attente",
      message: `Une tâche sur laquelle vous êtes assigné a été mise en attente.`,
      targetType: "TACHE",
    });
  }
}

async function cascadePauseMission(missionId) {
  // Find active tasks
  const tachesToPause = await prisma.tache.findMany({
     where: { 
        missionId: missionId,
        status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE", "BLOQUE", "EN_ATTENTE", "VALIDEE"] } 
     },
     select: { id: true, status: true, reference: true, assignedToId: true }
  });
  
  const tacheRecipients = [];

  for (const t of tachesToPause) {
     await prisma.tache.update({
        where: { id: t.id },
        data: { status: "EN_ATTENTE", previousStatus: t.status }
     });
     if (t.assignedToId) {
       tacheRecipients.push(t.assignedToId);
     }
  }

  // Notify affected users
  if (tacheRecipients.length > 0) {
    await notifyUsers(tacheRecipients, {
      type: "TACHE_EN_ATTENTE",
      title: "Tâche mise en attente",
      message: `Une tâche sur laquelle vous êtes assigné a été mise en attente suite à la mise en attente de sa mission parente.`,
      targetType: "TACHE",
    });
  }
}

module.exports = {
  cascadePauseDossier,
  cascadePauseMission
};
