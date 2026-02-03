/**
 * cleanupHelper.ts - Cleanup Helper Utilities
 * 
 * This module provides helper functions specifically for the cleanup test suite.
 * It handles asynchronous retrieval of test data stored during previous test executions.
 */

/**
 * Read employee test data from persistent JSON file
 * Uses Cypress task to asynchronously read the file
 * 
 * @returns Cypress.Chainable<any> - Promise-like object containing employee array
 */
export const readEmployeeTestData = (): Cypress.Chainable<any> => {
  return (cy.task('readFile', 'employees.json').then((data: any) => {
    return Array.isArray(data) ? data : (data ? [data] : []);
  })) as Cypress.Chainable<any>;
};

/**
 * Read user test data from persistent JSON file
 * Uses Cypress task to asynchronously read the file
 * 
 * @returns Cypress.Chainable<any> - Promise-like object containing user array
 */
export const readUserTestData = (): Cypress.Chainable<any> => {
  return (cy.task('readFile', 'users.json').then((data: any) => {
    return Array.isArray(data) ? data : (data ? [data] : []);
  })) as Cypress.Chainable<any>;
};

/**
 * Read leave test data from persistent JSON file
 * Uses Cypress task to asynchronously read the file
 * 
 * @returns Cypress.Chainable<any> - Promise-like object containing leave array
 */
export const readLeaveTestData = (): Cypress.Chainable<any> => {
  return (cy.task('readFile', 'leaves.json').then((data: any) => {
    return Array.isArray(data) ? data : (data ? [data] : []);
  })) as Cypress.Chainable<any>;
};
