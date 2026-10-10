const fs = require('fs');
const path = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend/src/routes/crm/messages.js';
let content = fs.readFileSync(path, 'utf8');

// Function to emit entity updates
const emitFn = `
const emitEntityUpdate = (req, entityType, entityId, action, payload = {}) => {
  const io = req.app.get('io');
  if (io) {
    if (entityId) io.to(entityId).emit('entity_updated', { entityType, entityId, action, ...payload });
    io.emit('entity_updated_global', { entityType, entityId, action, ...payload });
  }
};
`;

if (!content.includes('emitEntityUpdate')) {
  // Try to find a good injection point (e.g., after the require statements)
  content = content.replace('const { transporter } = require("../../utils/mailer");', 'const { transporter } = require("../../utils/mailer");' + emitFn);
}

// Replace POST /messages
content = content.replace(/res\.status\(201\)\.json\(message\);/g, "emitEntityUpdate(req, 'MESSAGE', message.dossierId || message.missionId || message.tacheId, 'CREATED', message);\n    res.status(201).json(message);");

fs.writeFileSync(path, content);
console.log("Patched messages.js");
