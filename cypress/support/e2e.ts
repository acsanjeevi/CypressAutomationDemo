/**
 * e2e.ts - Global test configuration and imports
 */

// Import commands
import './commands';

// Set global timeout
Cypress.config('defaultCommandTimeout', 10000);

// Disable uncaught exception handling if needed
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});

// Log test start and end
beforeEach(() => {
  cy.log('Starting test...');
});

afterEach(() => {
  cy.log('Test completed');
});
