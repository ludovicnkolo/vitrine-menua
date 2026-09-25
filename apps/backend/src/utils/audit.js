const prisma = require("../prisma");

/**
 * Log an audit entry into the AuditLog table.
 *
 * @param {string|null} userId - The user triggering the action
 * @param {string} action - Action name (e.g., CREATION_DOSSIER, MODIFICATION_TACHE)
 * @param {string|number|null} targetId - Identifier of affected record
 * @param {string|null} targetType - Type of record (e.g. DOSSIER, MISSION, TACHE, DOCUMENT, MAGIC_LINK)
 * @param {string|null} details - Descriptive text or JSON summary
 * @param {string|null} dossierId - Optional linked dossier ID
 * @param {string|null} formulaireId - Optional linked formulaire ID
 */
const logAudit = async (
  userId,
  action,
  targetId,
  targetType,
  details,
  dossierId = null,
  formulaireId = null,
) => {
  try {
    const validUserId = userId && userId !== "MASTER-ADMIN" ? userId : null;
    await prisma.auditLog.create({
      data: {
        userId: validUserId,
        action,
        targetId: targetId ? String(targetId) : null,
        targetType: targetType || null,
        details: details || "",
        dossierId: dossierId || null,
        formulaireId: formulaireId || null,
      },
    });
  } catch (err) {
    console.error("[AUDIT ERROR]", err.message);
  }
};

module.exports = { logAudit };
