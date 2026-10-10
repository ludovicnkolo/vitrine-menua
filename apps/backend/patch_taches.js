const fs = require('fs');
const path = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend/src/routes/crm/taches.js';
let content = fs.readFileSync(path, 'utf8');

// Function to emit entity updates
const emitFn = `
const emitEntityUpdate = (req, entityType, entityId, action, payload = {}) => {
  const io = req.app.get('io');
  if (io) {
    io.to(entityId).emit('entity_updated', { entityType, entityId, action, ...payload });
    io.emit('entity_updated_global', { entityType, entityId, action, ...payload });
    if (payload.missionId) io.to(payload.missionId).emit('entity_updated', { entityType: 'MISSION', entityId: payload.missionId, action: 'CHILD_UPDATED' });
    if (payload.dossierTacheId) io.to(payload.dossierTacheId).emit('entity_updated', { entityType: 'DOSSIER', entityId: payload.dossierTacheId, action: 'CHILD_UPDATED' });
  }
};
`;

if (!content.includes('emitEntityUpdate')) {
  content = content.replace('const { transporter } = require("../../utils/mailer");', 'const { transporter } = require("../../utils/mailer");' + emitFn);
}

// Replace POST /taches
content = content.replace(/res\.status\(201\)\.json\(tache\);/g, "emitEntityUpdate(req, 'TACHE', tache.id, 'CREATED', tache);\n    res.status(201).json(tache);");

// Replace PUT /taches/:id
content = content.replace(/res\.json\(tache\);/g, "emitEntityUpdate(req, 'TACHE', tache.id, 'UPDATED', tache);\n    res.json(tache);");

// Replace DELETE /taches/:id
content = content.replace(/res\.json\(\{ success: true, message: "Tâche supprimée" \}\);/g, "emitEntityUpdate(req, 'TACHE', req.params.id, 'DELETED');\n    res.json({ success: true, message: \"Tâche supprimée\" });");

fs.writeFileSync(path, content);
console.log("Patched taches.js");
