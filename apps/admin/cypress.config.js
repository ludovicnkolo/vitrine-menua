// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Adjust if admin UI runs on different port
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
  },
  env: {
    // credentials for test users (seeded by seed_test_users.js)
    testPassword: '1234',
    superAdminEmail: process.env.MASTER_ADMIN_EMAIL || 'master@menua.local',
    managerEmail: 'responsable-operationnel-1@menua.local',
    reviewerEmail: 'relecteur-1@menua.local',
    collaboratorEmail: 'collaborateur-1@menua.local',
    techAdminEmail: 'administrateur-technique-1@menua.local',
  },
});
