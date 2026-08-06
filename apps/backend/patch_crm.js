const fs = require('fs');

let content = fs.readFileSync('src/routes/crm.js', 'utf8');

const oldLogic = `
    const where = {};
    if (req.query.rootOnly === 'true') {
      where.parentDossierId = null;
    }

    if (req.user.role === 'Responsable opérationnel') {
      where.OR = [
        { origin: { not: 'INTERNE' } },
        { targetUserId: req.user.id },
        { createdById: req.user.id },
        { missions: { some: { assignedToId: req.user.id } } }
      ];
    } else if (req.user.role === 'Relecteur') {
      where.OR = [
        { targetUserId: req.user.id },
        { createdById: req.user.id },
        { missions: { some: { assignedToId: req.user.id } } },
        { missions: { some: { taches: { some: { assignedToId: req.user.id } } } } }
      ];
    }
`;

const newLogic = `
    let inMemoryFilter = false;
    const where = {};
    
    if (req.query.rootOnly === 'true') {
      where.parentDossierId = null;
      if (req.user.role === 'Responsable opérationnel') {
        where.OR = [
          { targetUserId: req.user.id },
          { createdById: req.user.id },
          { missions: { some: { assignedToId: req.user.id } } }
        ];
      } else if (req.user.role === 'Relecteur') {
        where.OR = [
          { targetUserId: req.user.id },
          { createdById: req.user.id },
          { missions: { some: { assignedToId: req.user.id } } },
          { missions: { some: { taches: { some: { assignedToId: req.user.id } } } } }
        ];
      }
    } else {
      // Pour la GED (limit=1000), on filtre en mémoire pour construire correctement l'arborescence
      if (req.user.role === 'Responsable opérationnel' || req.user.role === 'Relecteur') {
        inMemoryFilter = true;
      }
    }
`;

content = content.replace(oldLogic.trim(), newLogic.trim());

// Add includes for authorizedForMissions and missionsLinked
content = content.replace(
  /include: \{\s*missions: \{[^\}]+\},[^c]+client: true/m,
  \`include: { 
        missions: {
          include: { assignedTo: { include: { role: true } }, taches: true }
        },
        authorizedForMissions: {
          include: { assignedTo: true, taches: true }
        },
        missionsLinked: {
          include: { assignedTo: true, taches: true }
        },
        client: true\`
);

const oldPagination = \`
    const total = await prisma.dossier.count({ where });
    const dossiers = await prisma.dossier.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { 
        missions: {
          include: { assignedTo: { include: { role: true } } }
        }, 
        client: true, 
        createdBy: { include: { role: true } },
        documents: { include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } },
        subDossiers: { include: { subDossiers: true } },
        parentDossier: true
      }
    });
    sendPaginatedResponse(res, dossiers, total, page, limit);
\`;

const newPagination = \`
    let total = await prisma.dossier.count({ where });
    let dossiers = await prisma.dossier.findMany({
      where,
      skip: inMemoryFilter ? undefined : skip,
      take: inMemoryFilter ? undefined : limit,
      orderBy: { createdAt: 'desc' },
      include: { 
        missions: {
          include: { assignedTo: { include: { role: true } }, taches: true }
        },
        authorizedForMissions: {
          include: { assignedTo: true, taches: true }
        },
        missionsLinked: {
          include: { assignedTo: true, taches: true }
        },
        client: true, 
        createdBy: { include: { role: true } },
        documents: { include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } },
        subDossiers: { include: { subDossiers: true } },
        parentDossier: true
      }
    });

    if (inMemoryFilter) {
      let accessibleSet = new Set();
      const dossiersMap = new Map();
      dossiers.forEach(d => dossiersMap.set(d.id, d));
      
      const getDescendants = (folderId) => {
        let desc = [];
        dossiers.forEach(d => {
          if (d.parentDossierId === folderId) {
            desc.push(d.id);
            desc = desc.concat(getDescendants(d.id));
          }
        });
        return desc;
      };

      const getAncestors = (folderId) => {
        let anc = [];
        let current = dossiersMap.get(folderId);
        while (current && current.parentDossierId) {
          anc.push(current.parentDossierId);
          current = dossiersMap.get(current.parentDossierId);
        }
        return anc;
      };

      dossiers.forEach(d => {
        let hasFullAccess = false;

        if (d.createdById === req.user.id || d.targetUserId === req.user.id) {
          hasFullAccess = true;
        }
        
        if (hasFullAccess) {
           accessibleSet.add(d.id);
           getDescendants(d.id).forEach(id => accessibleSet.add(id));
           getAncestors(d.id).forEach(id => accessibleSet.add(id));
        } else {
           let isAuthorized = false;
           if (d.authorizedForMissions && d.authorizedForMissions.some(m => m.assignedToId === req.user.id)) isAuthorized = true;
           if (d.missionsLinked && d.missionsLinked.some(m => m.assignedToId === req.user.id)) isAuthorized = true;
           
           if (req.user.role === 'Relecteur') {
             if (d.authorizedForMissions && d.authorizedForMissions.some(m => m.taches.some(t => t.assignedToId === req.user.id))) isAuthorized = true;
             if (d.missionsLinked && d.missionsLinked.some(m => m.taches.some(t => t.assignedToId === req.user.id))) isAuthorized = true;
           }
           
           if (isAuthorized) {
              accessibleSet.add(d.id);
              getDescendants(d.id).forEach(id => accessibleSet.add(id));
              getAncestors(d.id).forEach(id => accessibleSet.add(id));
           } else {
              // Always allow the root folder of an assigned mission to be seen (so they can navigate into authorized sub-folders)
              let hasMissionOnRoot = false;
              if (d.missions && d.missions.some(m => m.assignedToId === req.user.id)) hasMissionOnRoot = true;
              if (req.user.role === 'Relecteur' && d.missions && d.missions.some(m => m.taches.some(t => t.assignedToId === req.user.id))) hasMissionOnRoot = true;
              
              if (hasMissionOnRoot) {
                 accessibleSet.add(d.id);
              }
           }
        }
      });

      dossiers = dossiers.filter(d => accessibleSet.has(d.id));
      total = dossiers.length;
      
      // Manual pagination if limit is applied
      if (limit) {
        dossiers = dossiers.slice(skip, skip + limit);
      }
    }

    sendPaginatedResponse(res, dossiers, total, page, limit);
\`;

content = content.replace(oldPagination.trim(), newPagination.trim());

fs.writeFileSync('src/routes/crm.js', content);
