const fs = require('fs');
const path = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend/src/routes/crm/dossiers.js';
let content = fs.readFileSync(path, 'utf8');

// Function to emit entity updates
const emitFn = `
const emitEntityUpdate = (req, entityType, entityId, action, payload = {}) => {
  const io = req.app.get('io');
  if (io) {
    io.to(entityId).emit('entity_updated', { entityType, entityId, action, ...payload });
    io.emit('entity_updated_global', { entityType, entityId, action, ...payload });
  }
};
`;

if (!content.includes('emitEntityUpdate')) {
  content = content.replace('const { transporter } = require("../../utils/mailer");', 'const { transporter } = require("../../utils/mailer");' + emitFn);
}

// Replace POST /dossiers
content = content.replace(/res\.status\(201\)\.json\(dossier\);/g, "emitEntityUpdate(req, 'DOSSIER', dossier.id, 'CREATED');\n    res.status(201).json(dossier);");

// Replace PUT /dossiers/:id
content = content.replace(/res\.json\(dossier\);/g, "emitEntityUpdate(req, 'DOSSIER', dossier.id, 'UPDATED', dossier);\n    res.json(dossier);");

// Replace DELETE /dossiers/:id
content = content.replace(/res\.json\(\{\s*success:\s*true,\s*message:\s*"Dossier mis en corbeille \(soft-delete\)\. Restaurable depuis la corbeille\."\s*\}\);/g, "emitEntityUpdate(req, 'DOSSIER', req.params.id, 'DELETED');\n    res.json({ success: true, message: \"Dossier mis en corbeille (soft-delete). Restaurable depuis la corbeille.\" });");

fs.writeFileSync(path, content);
console.log("Patched dossiers.js");
