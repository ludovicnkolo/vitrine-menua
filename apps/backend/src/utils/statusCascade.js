const prisma = require("../prisma");

async function notifyUsers(recipients, payload) {
  if (!recipients || recipients.length === 0) return;
  const uniqueRecipients = [...new Set(recipients)];
  await prisma.notification.createMany({
    data: uniqueRecipients.map((userId) => ({
      userId,
      ...payload,
    })),
  }).catch(() => {});
}

async function cascadePauseDossier(dossierId, tx = prisma) {
  // 1. Mettre en attente les missions actives
  const missionsToPause = await tx.mission.findMany({
    where: {
      dossierId: dossierId,
      status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE", "BLOQUE", "EN_ATTENTE"] },
    },
    select: { id: true, status: true, reference: true, assignedToId: true },
  });

  const missionRecipients = [];

  for (const m of missionsToPause) {
    await tx.mission.update({
      where: { id: m.id },
      data: { status: "EN_ATTENTE", previousStatus: m.status },
    });
    if (m.assignedToId) {
      missionRecipients.push(m.assignedToId);
    }
  }

  // 2. Mettre en attente les tâches actives
  const tachesToPause = await tx.tache.findMany({
    where: {
      OR: [
        { mission: { dossierId: dossierId } },
        { dossierTacheId: dossierId },
      ],
      status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE", "BLOQUE", "EN_ATTENTE"] },
    },
    select: { id: true, status: true, reference: true, assignedToId: true },
  });

  const tacheRecipients = [];

  for (const t of tachesToPause) {
    await tx.tache.update({
      where: { id: t.id },
      data: { status: "EN_ATTENTE", previousStatus: t.status },
    });
    if (t.assignedToId) {
      tacheRecipients.push(t.assignedToId);
    }
  }

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
      message: `Une tâche sur laquelle vous êtes assigné a été mise en attente suite à la mise en attente de son dossier parent.`,
      targetType: "TACHE",
    });
  }
}

async function cascadeResumeDossier(dossierId, tx = prisma) {
  // 1. Débloquer et restaurer les missions
  const missionsToResume = await tx.mission.findMany({
    where: { dossierId, status: "EN_ATTENTE" },
    select: { id: true, previousStatus: true, assignedToId: true },
  });

  const missionRecipients = [];
  for (const m of missionsToResume) {
    const targetStatus = m.previousStatus || "EN_COURS";
    await tx.mission.update({
      where: { id: m.id },
      data: { status: targetStatus, previousStatus: "EN_ATTENTE" },
    });
    if (m.assignedToId) missionRecipients.push(m.assignedToId);
  }

  // 2. Débloquer et restaurer les tâches à leur étape opérationnelle exacte
  const tachesToResume = await tx.tache.findMany({
    where: {
      OR: [
        { mission: { dossierId } },
        { dossierTacheId: dossierId },
      ],
      status: "EN_ATTENTE",
    },
    select: { id: true, previousStatus: true, assignedToId: true },
  });

  const tacheRecipients = [];
  for (const t of tachesToResume) {
    const targetStatus = t.previousStatus || "EN_COURS";
    await tx.tache.update({
      where: { id: t.id },
      data: { status: targetStatus, previousStatus: "EN_ATTENTE" },
    });
    if (t.assignedToId) tacheRecipients.push(t.assignedToId);
  }

  if (missionRecipients.length > 0) {
    await notifyUsers(missionRecipients, {
      type: "MISSION_REPRISE",
      title: "Mission réactivée",
      message: `Votre mission a été réactivée suite au déblocage de son dossier parent.`,
      targetType: "MISSION",
    });
  }

  if (tacheRecipients.length > 0) {
    await notifyUsers(tacheRecipients, {
      type: "TACHE_REPRISE",
      title: "Tâche réactivée",
      message: `Votre tâche a été réactivée suite au déblocage de son dossier parent.`,
      targetType: "TACHE",
    });
  }
}

async function cascadeBlockDossier(dossierId, tx = prisma) {
  // 1. Bloquer les missions actives
  const missionsToBlock = await tx.mission.findMany({
    where: {
      dossierId: dossierId,
      status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE", "BLOQUE"] },
    },
    select: { id: true, status: true, assignedToId: true },
  });

  const missionRecipients = [];
  for (const m of missionsToBlock) {
    await tx.mission.update({
      where: { id: m.id },
      data: { status: "BLOQUE", previousStatus: m.status },
    });
    if (m.assignedToId) missionRecipients.push(m.assignedToId);
  }

  // 2. Bloquer les tâches actives
  const tachesToBlock = await tx.tache.findMany({
    where: {
      OR: [
        { mission: { dossierId: dossierId } },
        { dossierTacheId: dossierId },
      ],
      status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE", "BLOQUE"] },
    },
    select: { id: true, status: true, assignedToId: true },
  });

  const tacheRecipients = [];
  for (const t of tachesToBlock) {
    await tx.tache.update({
      where: { id: t.id },
      data: { status: "BLOQUE", previousStatus: t.status },
    });
    if (t.assignedToId) tacheRecipients.push(t.assignedToId);
  }

  if (missionRecipients.length > 0) {
    await notifyUsers(missionRecipients, {
      type: "MISSION_BLOQUEE",
      title: "Mission bloquée",
      message: `Une mission sur laquelle vous êtes assigné a été bloquée suite au blocage du dossier parent.`,
      targetType: "MISSION",
    });
  }

  if (tacheRecipients.length > 0) {
    await notifyUsers(tacheRecipients, {
      type: "TACHE_BLOQUEE",
      title: "Tâche bloquée",
      message: `Une tâche sur laquelle vous êtes assigné a été bloquée suite au blocage du dossier parent.`,
      targetType: "TACHE",
    });
  }
}

async function cascadeUnblockDossier(dossierId, tx = prisma) {
  // 1. Débloquer les missions
  const missionsToUnblock = await tx.mission.findMany({
    where: { dossierId, status: "BLOQUE" },
    select: { id: true, previousStatus: true, assignedToId: true },
  });

  const missionRecipients = [];
  for (const m of missionsToUnblock) {
    const targetStatus = m.previousStatus || "EN_COURS";
    await tx.mission.update({
      where: { id: m.id },
      data: { status: targetStatus, previousStatus: "BLOQUE" },
    });
    if (m.assignedToId) missionRecipients.push(m.assignedToId);
  }

  // 2. Débloquer les tâches
  const tachesToUnblock = await tx.tache.findMany({
    where: {
      OR: [
        { mission: { dossierId } },
        { dossierTacheId: dossierId },
      ],
      status: "BLOQUE",
    },
    select: { id: true, previousStatus: true, assignedToId: true },
  });

  const tacheRecipients = [];
  for (const t of tachesToUnblock) {
    const targetStatus = t.previousStatus || "EN_COURS";
    await tx.tache.update({
      where: { id: t.id },
      data: { status: targetStatus, previousStatus: "BLOQUE" },
    });
    if (t.assignedToId) tacheRecipients.push(t.assignedToId);
  }

  if (missionRecipients.length > 0) {
    await notifyUsers(missionRecipients, {
      type: "MISSION_DEBLOQUEE",
      title: "Mission débloquée",
      message: `Votre mission a été débloquée suite au déblocage du dossier parent.`,
      targetType: "MISSION",
    });
  }

  if (tacheRecipients.length > 0) {
    await notifyUsers(tacheRecipients, {
      type: "TACHE_DEBLOQUEE",
      title: "Tâche débloquée",
      message: `Votre tâche a été débloquée suite au déblocage du dossier parent.`,
      targetType: "TACHE",
    });
  }
}

/**
 * Lorsque le client passe en INACTIF :
 * Tous ses dossiers passent au statut BLOQUE en cascade (missions & tâches).
 * Son accès utilisateur est désactivé.
 */
async function cascadeBlockClient(clientId, tx = prisma) {
  // 1. Trouver les dossiers actifs de ce client
  const dossiersToBlock = await tx.dossier.findMany({
    where: {
      clientId: clientId,
      status: { notIn: ["CORBEILLE", "ARCHIVE", "BLOQUE"] },
    },
    select: { id: true, status: true },
  });

  for (const d of dossiersToBlock) {
    await tx.dossier.update({
      where: { id: d.id },
      data: { status: "BLOQUE", previousStatus: d.status },
    });
    await cascadeBlockDossier(d.id, tx);
  }

  // 2. Bloquer l'utilisateur portail rattaché au client
  await tx.utilisateur.updateMany({
    where: { clientId: clientId },
    data: { isBlocked: true },
  });
}

/**
 * Lorsque le client est réactivé (ACTIF) :
 * Ses dossiers bloqués sont débloqués en cascade vers leur statut précédent.
 * Son accès utilisateur est réactivé.
 */
async function cascadeUnblockClient(clientId, tx = prisma) {
  const dossiersToUnblock = await tx.dossier.findMany({
    where: {
      clientId: clientId,
      status: "BLOQUE",
    },
    select: { id: true, previousStatus: true },
  });

  for (const d of dossiersToUnblock) {
    const targetStatus = d.previousStatus || "EN_COURS";
    await tx.dossier.update({
      where: { id: d.id },
      data: { status: targetStatus, previousStatus: "BLOQUE" },
    });
    await cascadeUnblockDossier(d.id, tx);
  }

  // Réactiver l'utilisateur portail rattaché au client
  await tx.utilisateur.updateMany({
    where: { clientId: clientId },
    data: { isBlocked: false },
  });
}

async function cascadePauseMission(missionId, tx = prisma) {
  const tachesToPause = await tx.tache.findMany({
    where: {
      missionId: missionId,
      status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE", "BLOQUE", "EN_ATTENTE"] },
    },
    select: { id: true, status: true, reference: true, assignedToId: true },
  });

  const tacheRecipients = [];

  for (const t of tachesToPause) {
    await tx.tache.update({
      where: { id: t.id },
      data: { status: "EN_ATTENTE", previousStatus: t.status },
    });
    if (t.assignedToId) {
      tacheRecipients.push(t.assignedToId);
    }
  }

  if (tacheRecipients.length > 0) {
    await notifyUsers(tacheRecipients, {
      type: "TACHE_EN_ATTENTE",
      title: "Tâche mise en attente",
      message: `Une tâche sur laquelle vous êtes assigné a été mise en attente suite à la mise en attente de sa mission parente.`,
      targetType: "TACHE",
    });
  }
}

async function cascadeResumeMission(missionId, tx = prisma) {
  const tachesToResume = await tx.tache.findMany({
    where: {
      missionId: missionId,
      status: "EN_ATTENTE",
    },
    select: { id: true, previousStatus: true, assignedToId: true },
  });

  const tacheRecipients = [];

  for (const t of tachesToResume) {
    const targetStatus = t.previousStatus || "EN_COURS";
    await tx.tache.update({
      where: { id: t.id },
      data: { status: targetStatus, previousStatus: "EN_ATTENTE" },
    });
    if (t.assignedToId) {
      tacheRecipients.push(t.assignedToId);
    }
  }

  if (tacheRecipients.length > 0) {
    await notifyUsers(tacheRecipients, {
      type: "TACHE_REPRISE",
      title: "Tâche réactivée",
      message: `Votre tâche a été réactivée suite au déblocage de sa mission parente.`,
      targetType: "TACHE",
    });
  }
}

module.exports = {
  cascadePauseDossier,
  cascadeResumeDossier,
  cascadeBlockDossier,
  cascadeUnblockDossier,
  cascadeBlockClient,
  cascadeUnblockClient,
  cascadePauseMission,
  cascadeResumeMission,
};
