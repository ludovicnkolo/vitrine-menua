// Pseudocode for cascading statuses
async function cascadeStatusUpdates(tacheId) {
  // Get tache and its mission
  const tache = await prisma.tache.findUnique({ where: { id: tacheId }, include: { mission: { include: { taches: true, dossier: { include: { missions: true } } } } } });
  if (!tache || !tache.mission) return;
  const mission = tache.mission;
  
  // Update Mission Status
  if (mission.status !== 'TERMINEE') {
    const allTachesTerminees = mission.taches.every(t => t.status === 'TERMINEE');
    if (allTachesTerminees && mission.taches.length > 0) {
       await prisma.mission.update({ where: { id: mission.id }, data: { status: 'TERMINEE' } });
       mission.status = 'TERMINEE';
    } else if (mission.status === 'NON_DEMARREE' && tache.status !== 'NOUVEAU') {
       // First task started
       await prisma.mission.update({ where: { id: mission.id }, data: { status: 'EN_COURS' } });
       mission.status = 'EN_COURS';
    }
  }

  // Update Dossier Status
  if (mission.dossier && mission.status === 'TERMINEE') {
     const dossier = mission.dossier;
     if (dossier.status !== 'CLOTURE' && dossier.status !== 'ARCHIVE' && dossier.status !== 'BLOQUE') {
        const allMissionsTerminees = dossier.missions.every(m => m.status === 'TERMINEE' || m.id === mission.id); // since mission is updated locally or db
        // actually just refetch dossier with missions
        const freshDossier = await prisma.dossier.findUnique({ where: { id: dossier.id }, include: { missions: true }});
        const allM = freshDossier.missions.every(m => m.status === 'TERMINEE');
        if (allM && freshDossier.missions.length > 0) {
           await prisma.dossier.update({ where: { id: dossier.id }, data: { status: 'CLOTURE' } });
        }
     }
  } else if (mission.dossier && mission.status === 'EN_COURS') {
     const dossier = mission.dossier;
     if (dossier.status === 'NOUVEAU') {
        await prisma.dossier.update({ where: { id: dossier.id }, data: { status: 'OUVERT' } });
     }
  }
}
