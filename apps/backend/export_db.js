const { exportDatabase } = require('./src/services/backupService');

module.exports = exportDatabase;

if (require.main === module) {
  exportDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
