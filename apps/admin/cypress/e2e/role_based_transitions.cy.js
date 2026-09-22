// cypress/e2e/role_based_transitions.cy.js
/// <reference types="cypress" />

/**
 * End‑to‑end test suite for role‑based status transition matrices.
 * Covers Inbox messages, Tasks (Tâches) and Dossiers pages.
 */

const users = [
  { role: 'SuperAdmin', email: Cypress.env('superAdminEmail'), password: Cypress.env('testPassword') },
  { role: 'Manager', email: Cypress.env('managerEmail'), password: Cypress.env('testPassword') },
  { role: 'Reviewer', email: Cypress.env('reviewerEmail'), password: Cypress.env('testPassword') },
  { role: 'Collaborator', email: Cypress.env('collaboratorEmail'), password: Cypress.env('testPassword') },
  { role: 'TechAdmin', email: Cypress.env('techAdminEmail'), password: Cypress.env('testPassword') },
];

function login(user) {
  cy.visit('/login');
  cy.get('input[name="email"]').type(user.email);
  cy.get('input[name="password"]').type(user.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
}

function changeStatus(selectTestId, newStatus) {
  cy.get(`select[data-testid="${selectTestId}"]`).select(newStatus);
  cy.get('button[data-testid="save-button"]').click();
  cy.get('[role="dialog"]').should('be.visible').contains('Confirmer').click();
  cy.intercept('PATCH', '/api/crm/**/status').as('patchStatus');
  cy.wait('@patchStatus').its('response.statusCode').should('eq', 200);
  cy.get(`select[data-testid="${selectTestId}"]`).should('have.value', newStatus);
}

describe('Role‑Based Status Transitions', () => {
  users.forEach((user) => {
    it(`allows ${user.role} to transition statuses in Inbox`, () => {
      login(user);
      cy.get('nav').contains('Inbox').click();
      cy.url().should('include', '/inbox');
      cy.get('[data-testid="message-row"]').first().as('msg');
      cy.get('@msg').click();
      cy.get('select[data-testid="status-select"]').as('statusSelect');
      cy.get('@statusSelect').invoke('val').then((current) => {
        cy.get('@statusSelect').find('option').then(($opts) => {
          const options = Array.from($opts).map((o) => o.value).filter((v) => v !== current);
          expect(options.length).to.be.greaterThan(0);
          const newStatus = options[0];
          changeStatus('status-select', newStatus);
        });
      });
    });
  });

  it('blocks illegal transition for Collaborator on APPROUVEE (Inbox)', () => {
    const collab = users.find((u) => u.role === 'Collaborator');
    login(collab);
    // Directly navigate to a message already APPROUVEE – assuming fixture exists
    cy.visit('/inbox?status=APPROUVEE');
    cy.get('[data-testid="message-row"]').first().click();
    cy.get('select[data-testid="status-select"]').should('be.disabled');
  });

  it('validates Tasks page transitions for each role', () => {
    users.forEach((user) => {
      login(user);
      cy.get('nav').contains('Tâches').click();
      cy.url().should('include', '/tasks');
      cy.get('[data-testid="task-row"]').first().as('task');
      cy.get('@task').click();
      cy.get('select[data-testid="task-status-select"]').as('taskStatus');
      cy.get('@taskStatus').invoke('val').then((current) => {
        cy.get('@taskStatus').find('option').then(($opts) => {
          const opts = Array.from($opts).map((o) => o.value).filter((v) => v !== current);
          if (opts.length) {
            const newStatus = opts[0];
            changeStatus('task-status-select', newStatus);
          } else {
            cy.get('@taskStatus').should('be.disabled');
          }
        });
      });
    });
  });

  it('validates Dossiers page transitions for each role', () => {
    users.forEach((user) => {
      login(user);
      cy.get('nav').contains('Dossiers').click();
      cy.url().should('include', '/dossiers');
      cy.get('[data-testid="dossier-row"]').first().as('dossier');
      cy.get('@dossier').click();
      cy.get('select[data-testid="dossier-status-select"]').as('dossierStatus');
      cy.get('@dossierStatus').invoke('val').then((current) => {
        cy.get('@dossierStatus').find('option').then(($opts) => {
          const opts = Array.from($opts).map((o) => o.value).filter((v) => v !== current);
          if (opts.length) {
            const newStatus = opts[0];
            changeStatus('dossier-status-select', newStatus);
          } else {
            cy.get('@dossierStatus').should('be.disabled');
          }
        });
      });
    });
  });
});
