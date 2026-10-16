const prisma = require("../prisma");

/**
 * Génère une référence séquentielle de sous-dossier (ex: DOS-01-01)
 */
async function generateSubDossierRef(parentDossierId, tx = prisma) {
  const parent = await tx.dossier.findUnique({
    where: { id: parentDossierId },
    select: { reference: true },
  });
  if (!parent || !parent.reference) {
    return `DOS-SUB-${Math.floor(Math.random() * 1000)}`;
  }

  const existingWithPrefix = await tx.dossier.findMany({
    where: { reference: { startsWith: `${parent.reference}-` } },
    select: { reference: true },
  });

  let maxSeq = 0;
  for (const item of existingWithPrefix) {
    if (!item.reference) continue;
    const parts = item.reference.split("-");
    if (parts.length >= 2) {
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }

  let nextSeq = maxSeq + 1;
  let candidate = `${parent.reference}-${String(nextSeq).padStart(2, "0")}`;

  while (await tx.dossier.findUnique({ where: { reference: candidate } })) {
    nextSeq++;
    candidate = `${parent.reference}-${String(nextSeq).padStart(2, "0")}`;
  }

  return candidate;
}

/**
 * Assure que le dossier client possède bien l'arborescence :
 * └── [Dossier Client Parent]
 *     └── Partage documents
 *         ├── Sortant  (Documents transmis par MENUA au client)
 *         └── Entrant  (Documents transmis par le client à MENUA)
 *
 * @param {string} dossierId - ID du dossier racine ou d'un sous-dossier
 * @param {object} [tx] - Client ou transaction Prisma
 * @returns {Promise<{ rootDossier: object, partageFolder: object, sortantFolder: object, entrantFolder: object }>}
 */
async function ensureClientSharingFolders(dossierId, tx = prisma) {
  if (!dossierId) return null;

  // 1. Récupérer le dossier cible et remonter à la racine client si besoin
  let current = await tx.dossier.findUnique({
    where: { id: dossierId },
  });
  if (!current) return null;

  let rootDossier = current;
  while (rootDossier.parentDossierId) {
    const parent = await tx.dossier.findUnique({
      where: { id: rootDossier.parentDossierId },
    });
    if (!parent) break;
    rootDossier = parent;
  }

  const clientId = rootDossier.clientId;
  const creatorId = rootDossier.createdById;

  // 2. Chercher ou créer le sous-dossier « Partage documents »
  let partageFolder = await tx.dossier.findFirst({
    where: {
      parentDossierId: rootDossier.id,
      status: { not: "CORBEILLE" },
      OR: [
        { name: { contains: "partage" } },
        { name: { contains: "partage documents" } },
      ],
    },
  });

  if (!partageFolder) {
    const ref = await generateSubDossierRef(rootDossier.id, tx);
    partageFolder = await tx.dossier.create({
      data: {
        reference: ref,
        name: `${ref}_partage_documents`,
        description: "Espace d'échange et de partage de documents avec le client",
        priority: "NORMAL",
        status: "NOUVEAU",
        origin: rootDossier.origin || "INTERNE",
        createdById: creatorId,
        clientId: clientId || null,
        parentDossierId: rootDossier.id,
      },
    });
  }

  // 3. Chercher ou créer le sous-dossier « Sortant »
  let sortantFolder = await tx.dossier.findFirst({
    where: {
      parentDossierId: partageFolder.id,
      status: { not: "CORBEILLE" },
      name: { contains: "sortant" },
    },
  });

  if (!sortantFolder) {
    const ref = await generateSubDossierRef(partageFolder.id, tx);
    sortantFolder = await tx.dossier.create({
      data: {
        reference: ref,
        name: `${ref}_sortant`,
        description: "Livrables et documents transmis par MENUA au client",
        priority: "NORMAL",
        status: "NOUVEAU",
        origin: rootDossier.origin || "INTERNE",
        createdById: creatorId,
        clientId: clientId || null,
        parentDossierId: partageFolder.id,
      },
    });
  }

  // 4. Chercher ou créer le sous-dossier « Entrant »
  let entrantFolder = await tx.dossier.findFirst({
    where: {
      parentDossierId: partageFolder.id,
      status: { not: "CORBEILLE" },
      name: { contains: "entrant" },
    },
  });

  if (!entrantFolder) {
    const ref = await generateSubDossierRef(partageFolder.id, tx);
    entrantFolder = await tx.dossier.create({
      data: {
        reference: ref,
        name: `${ref}_entrant`,
        description: "Pièces et documents transmis par le client à MENUA",
        priority: "NORMAL",
        status: "NOUVEAU",
        origin: rootDossier.origin || "INTERNE",
        createdById: creatorId,
        clientId: clientId || null,
        parentDossierId: partageFolder.id,
      },
    });
  }

  // 5. Auto-relocalisation des fichiers mal positionnés (à la racine ou dans partage_documents)
  // vers leurs sous-dossiers dédiés (sortant ou entrant)
  try {
    const parentFolderIds = [rootDossier.id, partageFolder.id].filter(Boolean);

    if (sortantFolder?.id && parentFolderIds.length > 0) {
      await tx.document.updateMany({
        where: {
          dossierId: { in: parentFolderIds },
          isDeleted: false,
          category: { in: ["RESTITUTION", "LIVRABLE", "SORTANT"] },
        },
        data: {
          dossierId: sortantFolder.id,
        },
      });
    }

    if (entrantFolder?.id && parentFolderIds.length > 0) {
      await tx.document.updateMany({
        where: {
          dossierId: { in: parentFolderIds },
          isDeleted: false,
          category: { in: ["DEPOT_CLIENT", "ENTRANT", "DEMANDE"] },
        },
        data: {
          dossierId: entrantFolder.id,
        },
      });
    }
  } catch (healErr) {
    console.error("Erreur auto-relocalisation documents partage:", healErr);
  }

  return { rootDossier, partageFolder, sortantFolder, entrantFolder };
}

module.exports = {
  generateSubDossierRef,
  ensureClientSharingFolders,
};
