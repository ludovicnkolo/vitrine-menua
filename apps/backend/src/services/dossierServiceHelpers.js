const prisma = require("../prisma");

const resolveCreatorId = async (req) => {
  let creatorId = req.user.id;
  if (creatorId === "MASTER-ADMIN") {
    let masterUser = await prisma.utilisateur.findUnique({
      where: { email: "contact@menuaconsulting.com" },
    });
    if (!masterUser) masterUser = await prisma.utilisateur.findFirst();
    return masterUser?.id || creatorId;
  }
  return creatorId;
};

const generateReference = async (model, prefix) => {
  const records = await prisma[model].findMany({
    where: { reference: { startsWith: `${prefix}-` } },
    select: { reference: true },
  });

  let maxNum = 0;
  const regex = new RegExp(`^${prefix}-(\\d+)$`);
  for (const r of records) {
    if (!r.reference) continue;
    const match = r.reference.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }

  let nextNum = maxNum + 1;
  let candidate = `${prefix}-${String(nextNum).padStart(2, "0")}`;

  while (await prisma[model].findUnique({ where: { reference: candidate } })) {
    nextNum++;
    candidate = `${prefix}-${String(nextNum).padStart(2, "0")}`;
  }

  return candidate;
};

const generateSubDossierReference = async (parentDossierId) => {
  const parent = await prisma.dossier.findUnique({
    where: { id: parentDossierId },
    select: { reference: true },
  });
  if (!parent || !parent.reference)
    return `DOS-SUB-${Math.floor(Math.random() * 1000)}`;

  const children = await prisma.dossier.findMany({
    where: { parentDossierId },
    select: { reference: true },
  });

  let maxSeq = 0;
  for (const child of children) {
    if (!child.reference) continue;
    const parts = child.reference.split("-");
    if (parts.length >= 3) {
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    } else if (parts.length === 2) {
      const seq = parseInt(parts[1], 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }
  return `${parent.reference}-${String(maxSeq + 1).padStart(2, "0")}`;
};

async function checkAndUpdateMissionStatus(missionId, prismaClient = prisma) {
  const mission = await prismaClient.mission.findUnique({
    where: { id: missionId },
    include: { taches: true, dossier: { include: { missions: true } } },
  });
  if (!mission) return;

  const allTaches = mission.taches;
  let newStatus = mission.status;

  if (allTaches.length > 0 && allTaches.every((t) => t.status === "TERMINE")) {
    newStatus = "TERMINE";
  } else if (
    mission.status === "NOUVEAU" &&
    allTaches.some((t) => t.status !== "NOUVEAU")
  ) {
    newStatus = "NOUVEAU";
  } else if (
    mission.status === "TERMINE" &&
    allTaches.some((t) => t.status !== "TERMINE")
  ) {
    newStatus = "NOUVEAU";
  }

  if (newStatus !== mission.status) {
    await prismaClient.mission.update({
      where: { id: mission.id },
      data: { status: newStatus, previousStatus: mission.status },
    });
    if (newStatus === "TERMINE" && mission.dossier) {
      checkAndUpdateDossierStatus(mission.dossier, prismaClient);
    } else if (
      newStatus === "NOUVEAU" &&
      mission.dossier &&
      mission.dossier.status === "NOUVEAU"
    ) {
      await prismaClient.dossier.update({
        where: { id: mission.dossier.id },
        data: { status: "NOUVEAU" },
      });
    }
  }
}

async function checkAndUpdateDossierStatus(dossier, prismaClient = prisma) {
  const freshDossier = await prismaClient.dossier.findUnique({
    where: { id: dossier.id },
    include: { missions: true },
  });
  if (!freshDossier) return;
  const allMissions = freshDossier.missions;
  if (
    allMissions.length > 0 &&
    allMissions.every((m) => m.status === "TERMINE")
  ) {
    if (
      freshDossier.status !== "TERMINE" &&
      freshDossier.status !== "ARCHIVE" &&
      freshDossier.status !== "BLOQUE"
    ) {
      await prismaClient.dossier.update({
        where: { id: freshDossier.id },
        data: { status: "TERMINE", previousStatus: freshDossier.status },
      });
    }
  } else if (
    freshDossier.status === "TERMINE" &&
    allMissions.some((m) => m.status !== "TERMINE")
  ) {
    await prismaClient.dossier.update({
      where: { id: freshDossier.id },
      data: { status: "NOUVEAU", previousStatus: freshDossier.status },
    });
  }
}

module.exports = {
  resolveCreatorId,
  generateReference,
  generateSubDossierReference,
  checkAndUpdateMissionStatus,
  checkAndUpdateDossierStatus,
};
