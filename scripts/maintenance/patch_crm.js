const fs = require('fs');

let content = fs.readFileSync('apps/backend/src/routes/crm.js', 'utf8');

const helperFunctions = `
async function checkAndUpdateMissionStatus(missionId, prisma) {
  const mission = await prisma.mission.findUnique({ where: { id: missionId }, include: { taches: true, dossier: { include: { missions: true } } } });
  if (!mission) return;

  const allTaches = mission.taches;
  let newStatus = mission.status;

  if (allTaches.length > 0 && allTaches.every(t => t.status === 'TERMINEE')) {
    newStatus = 'TERMINEE';
  } else if (mission.status === 'NON_DEMARREE' && allTaches.some(t => t.status !== 'NOUVEAU')) {
    newStatus = 'EN_COURS';
  } else if (mission.status === 'TERMINEE' && allTaches.some(t => t.status !== 'TERMINEE')) {
    newStatus = 'EN_COURS';
  }

  if (newStatus !== mission.status) {
    await prisma.mission.update({ where: { id: mission.id }, data: { status: newStatus, previousStatus: mission.status } });
    if (newStatus === 'TERMINEE' && mission.dossier) {
       checkAndUpdateDossierStatus(mission.dossier, prisma);
    } else if (newStatus === 'EN_COURS' && mission.dossier && mission.dossier.status === 'NOUVEAU') {
       await prisma.dossier.update({ where: { id: mission.dossier.id }, data: { status: 'OUVERT' } });
    }
  }
}

async function checkAndUpdateDossierStatus(dossier, prisma) {
  const freshDossier = await prisma.dossier.findUnique({ where: { id: dossier.id }, include: { missions: true } });
  if (!freshDossier) return;
  const allMissions = freshDossier.missions;
  if (allMissions.length > 0 && allMissions.every(m => m.status === 'TERMINEE')) {
    if (freshDossier.status !== 'CLOTURE' && freshDossier.status !== 'ARCHIVE' && freshDossier.status !== 'BLOQUE') {
       await prisma.dossier.update({ where: { id: freshDossier.id }, data: { status: 'CLOTURE', previousStatus: freshDossier.status } });
    }
  } else if (freshDossier.status === 'CLOTURE' && allMissions.some(m => m.status !== 'TERMINEE')) {
       await prisma.dossier.update({ where: { id: freshDossier.id }, data: { status: 'OUVERT', previousStatus: freshDossier.status } });
  }
}
`;

// Insert helpers before router.patch('/taches/:id')
const patchIndex = content.indexOf("router.patch('/taches/:id'");
content = content.slice(0, patchIndex) + helperFunctions + "\n" + content.slice(patchIndex);

// Replace the old taches patch logic
const regexTachePatch = /router\.patch\('\/taches\/:id'[\s\S]*?(?=\nrouter\.delete\('\/taches\/:id')/;
const newTachePatch = `router.patch('/taches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminFeedback, managerFeedback, ...rest } = req.body;

    const currentTache = await prisma.tache.findUnique({ where: { id } });
    if (!currentTache) return res.status(404).json({ error: 'Tâche introuvable.' });

    const userRole = req.user?.role || '';
    const isSuperAdmin = userRole === 'Super-administrateur' || req.user?.id === 'MASTER-ADMIN';
    const isController = userRole === 'Relecteur' || userRole === 'Responsable opérationnel' || isSuperAdmin;

    // Build the data payload
    const dataToUpdate = { ...rest };

    if (status !== undefined && status !== currentTache.status) {
      if (status === 'A_CORRIGER' || status === 'REATTRIBUEE') {
         if (managerFeedback) dataToUpdate.managerFeedback = managerFeedback.trim();
      }
      if (status === 'EN_VALIDATION_FINALE' || status === 'A_CORRIGER') {
         if (adminFeedback) dataToUpdate.adminFeedback = adminFeedback.trim();
      }

      dataToUpdate.previousStatus = currentTache.status;
      dataToUpdate.status = status;
    } else if (status !== undefined) {
      if (adminFeedback !== undefined) dataToUpdate.adminFeedback = adminFeedback;
      if (managerFeedback !== undefined) dataToUpdate.managerFeedback = managerFeedback;
    }

    const tache = await prisma.tache.update({
      where: { id },
      data: dataToUpdate
    });
    
    if (status !== undefined && status !== currentTache.status && tache.missionId) {
       await checkAndUpdateMissionStatus(tache.missionId, prisma);
    }

    res.json(tache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur de mise à jour.' });
  }
});
`;
content = content.replace(regexTachePatch, newTachePatch);

fs.writeFileSync('apps/backend/src/routes/crm.js', content);
