/**
 * types.d.ts - Custom type definitions
 */

declare namespace Cypress {
  interface Chainable {
    logToFile(data: any, filename: string): Chainable<void>;
    waitAndClick(selector: string, delay?: number): Chainable<void>;
    safeType(selector: string, text: string): Chainable<void>;
  }
}
