const fs = require('fs');
const file = 'apps/backend/src/routes/crm.js';
let content = fs.readFileSync(file, 'utf8');

const deleteRoute = `
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      await prisma.formulaire.delete({ where: { id } });
      return res.json({ success: true, message: 'Message supprimé' });
    }
    const msg = await prisma.messagePersonnel.findUnique({ where: { id } });
    if (msg) {
      await prisma.messagePersonnel.delete({ where: { id } });
      return res.json({ success: true, message: 'Message supprimé' });
    }
    res.status(404).json({ error: 'Message non trouvé' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
`;

if (!content.includes('/messages/:id')) {
  // insert before module.exports = router;
  content = content.replace(/module\.exports = router;/, deleteRoute + '\nmodule.exports = router;');
  fs.writeFileSync(file, content);
  console.log('Added DELETE route to crm.js');
} else {
  console.log('Route already exists');
}
