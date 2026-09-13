const express = require('express');
const prisma = require('../../prisma');
const router = express.Router();
const { authenticateJWT } = require('../../middlewares/auth');

router.use(authenticateJWT);

// GET /api/crm/notifications — liste des notifications de l'utilisateur connecté
router.get('/notifications', async (req, res) => {
  try {
    const userId = req.user.id;
    const onlyUnread = req.query.unread === 'true';

    const where = { userId };
    if (onlyUnread) where.isRead = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/crm/notifications/:id/read — marquer une notification comme lue
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const userId = req.user.id;
    const notif = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notif || notif.userId !== userId) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }
    await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/crm/notifications/read-all — marquer toutes comme lues
router.patch('/notifications/read-all', async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
