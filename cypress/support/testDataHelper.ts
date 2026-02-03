/**
 * testDataHelper.ts - Utility Module for Test Data Management
 * 
 * This module provides helper functions for managing test data persistence
 * and retrieval during test execution. It uses Cypress task functionality
 * to interact with the file system and store test data in JSON format for
 * audit trails and cleanup operations.
 * 
 * Functions:
 * - saveEmployeeData: Persist employee data created during tests
 * - saveUserData: Persist user account data created during tests
 * - saveLeaveData: Persist leave request data created during tests
 * - getEmployeeData: Retrieve stored employee data
 * - getUserData: Retrieve stored user data
 * - getLeaveData: Retrieve stored leave data
 * - clearEmployeeData: Clear stored employee data
 * - clearUserData: Clear stored user data
 * - clearLeaveData: Clear stored leave data
 * - clearAllTestData: Clear all test data files
 */

/**
 * Save employee data to persistent JSON file using Cypress task
 * 
 * @param employeeData - The employee data object to persist
 * @description Stores employee information (ID, name, creation timestamp) to
 *              cypress/test-data/employees.json file for audit trail and
 *              cleanup reference. Each test execution appends new employee
 *              records to maintain complete test data history.
 * 
 * Example data structure:
 * {
 *   firstName: "TestEmployee_12345",
 *   middleName: "Test",
 *   lastName: "Demo_12345",
 *   employeeId: "0001",
 *   createdAt: "2026-01-31T15:00:00.000Z"
 * }
 */
export const saveEmployeeData = (employeeData: any): void => {
  cy.task('writeFile', { 
    filename: 'employees.json', 
    data: employeeData 
  });
  cy.log(`✓ Employee data persisted: ${employeeData.firstName} ${employeeData.lastName}`);
};

/**
 * Save user account data to persistent JSON file using Cypress task
 * 
 * @param userData - The user account data object to persist
 * @description Stores user account information (username, role, status, creation timestamp) to
 *              cypress/test-data/users.json file for audit trail and cleanup reference.
 *              Each test execution appends new user records to maintain complete test data history.
 * 
 * Example data structure:
 * {
 *   username: "DemoUser_12345",
 *   password: "DemoPass@12345",
 *   role: "Admin",
 *   employeeName: "TestEmployee_12345 Demo_12345",
 *   status: "Enabled",
 *   createdAt: "2026-01-31T15:00:00.000Z"
 * }
 */
export const saveUserData = (userData: any): void => {
  cy.task('writeFile', { 
    filename: 'users.json', 
    data: userData 
  });
  cy.log(`✓ User data persisted: ${userData.username}`);
};

/**
 * Save leave request data to persistent JSON file using Cypress task
 * 
 * @param leaveData - The leave request data object to persist
 * @description Stores leave request information (employee, dates, type, status, creation timestamp) to
 *              cypress/test-data/leaves.json file for audit trail and cleanup reference.
 *              Each test execution appends new leave records to maintain complete test data history.
 * 
 * Example data structure:
 * {
 *   employeeName: "TestEmployee_12345 Demo_12345",
 *   employeeId: "0001",
 *   leaveType: "Annual",
 *   fromDate: "2026-02-05",
 *   toDate: "2026-02-09",
 *   reason: "Personal leave",
 *   status: "Pending Approval",
 *   createdAt: "2026-01-31T15:00:00.000Z"
 * }
 */
export const saveLeaveData = (leaveData: any): void => {
  cy.task('writeFile', { 
    filename: 'leaves.json', 
    data: leaveData 
  });
  cy.log(`✓ Leave data persisted: ${leaveData.employeeName} (${leaveData.fromDate} to ${leaveData.toDate})`);
};

/**
 * Retrieve stored employee data from persistent storage
 * 
 * @returns Array of employee records stored from previous test executions
 * @description Retrieves employee data that was previously saved by test cases.
 *              This data is used to reference created employees for relationships
 *              (e.g., assigning employees to user accounts, applying leaves).
 */
export const getEmployeeData = (): any[] => {
  let employeeData: any[] = [];
  cy.task('readFile', 'employees.json').then((data: any) => {
    employeeData = Array.isArray(data) ? data : (data ? [data] : []);
  });
  return employeeData;
};

/**
 * Retrieve stored user account data from persistent storage
 * 
 * @returns Array of user account records stored from previous test executions
 * @description Retrieves user account data that was previously saved by test cases.
 *              This data is used for test cleanup and audit purposes.
 */
export const getUserData = (): any[] => {
  let userData: any[] = [];
  cy.task('readFile', 'users.json').then((data: any) => {
    userData = Array.isArray(data) ? data : (data ? [data] : []);
  });
  return userData;
};

/**
 * Retrieve stored leave request data from persistent storage
 * 
 * @returns Array of leave request records stored from previous test executions
 * @description Retrieves leave request data that was previously saved by test cases.
 *              This data is used for leave cleanup and audit purposes.
 */
export const getLeaveData = (): any[] => {
  let leaveData: any[] = [];
  cy.task('readFile', 'leaves.json').then((data: any) => {
    leaveData = Array.isArray(data) ? data : (data ? [data] : []);
  });
  return leaveData;
};

/**
 * Clear stored employee data from persistent storage
 * 
 * @description Removes the employees.json file to clear previously
 *              stored employee test data. Useful for cleanup between test suites.
 */
export const clearEmployeeData = (): void => {
  cy.task('deleteFile', 'employees.json');
  cy.log('✓ Employee data cleared from persistent storage');
};

/**
 * Clear stored user account data from persistent storage
 * 
 * @description Removes the users.json file to clear previously
 *              stored user account test data. Useful for cleanup between test suites.
 */
export const clearUserData = (): void => {
  cy.task('deleteFile', 'users.json');
  cy.log('✓ User data cleared from persistent storage');
};

/**
 * Clear stored leave request data from persistent storage
 * 
 * @description Removes the leaves.json file to clear previously
 *              stored leave request test data. Useful for cleanup between test suites.
 */
export const clearLeaveData = (): void => {
  cy.task('deleteFile', 'leaves.json');
  cy.log('✓ Leave data cleared from persistent storage');
};

/**
 * Clear all test data files from persistent storage
 * 
 * @description Removes all test data files (employees, users, leaves) to completely
 *              reset the test data repository. Useful for complete cleanup.
 */
export const clearAllTestData = (): void => {
  cy.task('clearDirectory');
  cy.log('✓ All test data cleared from persistent storage');
};

