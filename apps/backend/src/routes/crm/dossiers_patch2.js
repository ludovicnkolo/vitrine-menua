const fs = require('fs');
const path = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend/src/routes/crm/dossiers.js';
let code = fs.readFileSync(path, 'utf8');

const oldCode = `    let total = await prisma.dossier.count({ where });
    let dossiers = await prisma.dossier.findMany({
      where,
      skip: inMemoryFilter ? undefined : skip,
      take: inMemoryFilter ? undefined : limit,
      orderBy: { createdAt: "desc" },

    let missionsWhere = undefined;
    let tachesWhere = undefined;

    if (!isSuperAdmin(userRole)) {
      if (userRole === "Responsable opérationnel" || userRole === "Collaborateur") {
        missionsWhere = {
          OR: [
            { assignedToId: userId },
            { createdById: userId },
            { dossier: { traitantId: userId } },
            { taches: { some: { assignedToId: userId } } }
          ]
        };
        tachesWhere = {
          OR: [
            { assignedToId: userId },
            { createdById: userId },
            { mission: { assignedToId: userId } },
            { mission: { dossier: { traitantId: userId } } },
            { dossierTache: { traitantId: userId } }
          ]
        };
      } else if (userRole === "Relecteur") {
        missionsWhere = {
          OR: [
            { relecteurId: userId },
            { taches: { some: { relecteurId: userId } } }
          ]
        };
        tachesWhere = { relecteurId: userId };
      }
    }`;

const newCode = `    let missionsWhere = undefined;
    let tachesWhere = undefined;

    if (!isSuperAdmin(userRole)) {
      if (userRole === "Responsable opérationnel" || userRole === "Collaborateur") {
        missionsWhere = {
          OR: [
            { assignedToId: userId },
            { createdById: userId },
            { dossier: { traitantId: userId } },
            { taches: { some: { assignedToId: userId } } }
          ]
        };
        tachesWhere = {
          OR: [
            { assignedToId: userId },
            { createdById: userId },
            { mission: { assignedToId: userId } },
            { mission: { dossier: { traitantId: userId } } },
            { dossierTache: { traitantId: userId } }
          ]
        };
      } else if (userRole === "Relecteur") {
        missionsWhere = {
          OR: [
            { relecteurId: userId },
            { taches: { some: { relecteurId: userId } } }
          ]
        };
        tachesWhere = { relecteurId: userId };
      }
    }

    let total = await prisma.dossier.count({ where });
    let dossiers = await prisma.dossier.findMany({
      where,
      skip: inMemoryFilter ? undefined : skip,
      take: inMemoryFilter ? undefined : limit,
      orderBy: { createdAt: "desc" },`;

code = code.replace(oldCode, newCode);
fs.writeFileSync(path, code);
console.log("Fixed!");
