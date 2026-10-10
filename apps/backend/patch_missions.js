const fs = require('fs');
const path = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend/src/routes/crm/missions.js';
let content = fs.readFileSync(path, 'utf8');

// Function to emit entity updates
const emitFn = `
const emitEntityUpdate = (req, entityType, entityId, action, payload = {}) => {
  const io = req.app.get('io');
  if (io) {
    io.to(entityId).emit('entity_updated', { entityType, entityId, action, ...payload });
    io.emit('entity_updated_global', { entityType, entityId, action, ...payload });
    if (payload.dossierId) io.to(payload.dossierId).emit('entity_updated', { entityType: 'DOSSIER', entityId: payload.dossierId, action: 'CHILD_UPDATED' });
  }
};
`;

if (!content.includes('emitEntityUpdate')) {
  content = content.replace('const { transporter } = require("../../utils/mailer");', 'const { transporter } = require("../../utils/mailer");' + emitFn);
}

// Replace POST /tasks
content = content.replace(/res\.status\(201\)\.json\(task\);/g, "emitEntityUpdate(req, 'MISSION', task.id, 'CREATED', task);\n    res.status(201).json(task);");

// Replace PUT /tasks/:id
content = content.replace(/res\.json\(task\);/g, "emitEntityUpdate(req, 'MISSION', task.id, 'UPDATED', task);\n    res.json(task);");

// Replace DELETE /tasks/:id
content = content.replace(/res\.json\(\{ success: true, message: "Mission supprimée" \}\);/g, "emitEntityUpdate(req, 'MISSION', req.params.id, 'DELETED');\n    res.json({ success: true, message: \"Mission supprimée\" });");

fs.writeFileSync(path, content);
console.log("Patched missions.js");
