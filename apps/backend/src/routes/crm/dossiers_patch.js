const fs = require('fs');
const path = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend/src/routes/crm/dossiers.js';
let code = fs.readFileSync(path, 'utf8');

const includeStr = `      include: {
        traitant: { include: { role: true } },
        missions: {
          include: { assignedTo: { include: { role: true } }, taches: true },
        },
        authorizedForMissions: {
          include: { assignedTo: true, taches: true },
        },
        missionsLinked: {
          include: { assignedTo: true, taches: true },
        },
        tachesLinked: {
          include: { assignedTo: true },
        },
        authorizedForTaches: {
          include: { assignedTo: true },
        },`;

const replacement = `
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
    }

      include: {
        traitant: { include: { role: true } },
        missions: {
          where: missionsWhere,
          include: { assignedTo: { include: { role: true } }, taches: { where: tachesWhere } },
        },
        authorizedForMissions: {
          where: missionsWhere,
          include: { assignedTo: true, taches: { where: tachesWhere } },
        },
        missionsLinked: {
          where: missionsWhere,
          include: { assignedTo: true, taches: { where: tachesWhere } },
        },
        tachesLinked: {
          where: tachesWhere,
          include: { assignedTo: true },
        },
        authorizedForTaches: {
          where: tachesWhere,
          include: { assignedTo: true },
        },`;

code = code.replace(includeStr, replacement);
fs.writeFileSync(path, code);
console.log("Done");
