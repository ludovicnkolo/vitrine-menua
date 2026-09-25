/**
 * Utilitaire centralisé de création de notifications en base de données.
 * Chaque utilisateur ne voit que ses propres notifications (filtrage par userId).
 */
const prisma = require("../prisma");

/**
 * Crée une notification pour un ou plusieurs utilisateurs.
 * @param {string|string[]} userIds - ID(s) du ou des destinataires
 * @param {object} payload - { type, title, message, targetId, targetType }
 */
async function notify(
  userIds,
  { type, title, message, targetId = null, targetType = null },
) {
  const ids = Array.isArray(userIds) ? userIds : [userIds];
  const validIds = ids.filter((id) => id && id !== "MASTER-ADMIN");
  if (validIds.length === 0) return;
  try {
    await prisma.notification.createMany({
      data: validIds.map((userId) => ({
        userId,
        type,
        title,
        message,
        targetId,
        targetType,
      })),
    });
  } catch (err) {
    console.error("[NOTIFY ERROR]", err?.message || err);
  }
}

module.exports = { notify };
