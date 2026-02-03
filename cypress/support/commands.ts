/**
 * commands.ts - Custom Cypress Commands
 * Reusable commands for common operations
 */

/**
 * Custom command to log data to file
 */
Cypress.Commands.add('logToFile', (data: any, filename: string) => {
  cy.task('writeFile', { filename, data });
});

/**
 * Custom command for wait and element interaction
 */
Cypress.Commands.add('waitAndClick', (selector: string, delay = 500) => {
  cy.wait(delay);
  cy.get(selector).click();
});

/**
 * Custom command for safe type with clear
 */
Cypress.Commands.add('safeType', (selector: string, text: string) => {
  cy.get(selector).clear({ force: true }).type(text, { delay: 50 });
});

// Declare custom commands in TypeScript
declare namespace Cypress {
  interface Chainable {
    logToFile(data: any, filename: string): Chainable<void>;
    waitAndClick(selector: string, delay?: number): Chainable<void>;
    safeType(selector: string, text: string): Chainable<void>;
  }
}
