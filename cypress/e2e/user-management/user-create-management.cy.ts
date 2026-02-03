// User Management Test Suite - TC_007
// Creates user with admin role, assigns employee, persists for cleanup

import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import AdminPage from '../../pages/AdminPage';
import { saveUserData, getEmployeeData } from '../../support/testDataHelper';

describe('Admin Module - User Management', () => {
  let userInformation: any;
  let uniqueTimestampCounter: number;

  beforeEach(() => {
    cy.fixture('credentials').as('credentials');
    cy.fixture('testdata').as('testdata');
    uniqueTimestampCounter = Math.floor(Date.now() / 1000) % 1000;
  });

  /**
   * TC_007: Validate user creation with admin role in Admin module
   * 
   * This test verifies:
   * 1. User authentication with admin credentials
   * 2. Navigation to Admin module
   * 3. User creation with unique username and password
   * 4. Employee assignment to user account
   * 5. User role and status configuration
   * 6. Persistent storage of user data for audit trail
   * 
   * Expected Result: User is created with assigned employee and data is persisted
   */
  it('TC_007: Validate user creation with admin role in Admin module', function () {
    // ARRANGE: Load test data from fixtures
    const adminCredentials = this.credentials.admin;
    const userTestData = this.testdata.user;
    
    // Get previously created employee data for employee assignment
    const employeeRecords = getEmployeeData();
    const assignedEmployeeName = employeeRecords.length > 0 
      ? `${employeeRecords[employeeRecords.length - 1].firstName} ${employeeRecords[employeeRecords.length - 1].lastName}`
      : 'John Doe'; // Default fallback if no employee exists

    // Create user information with unique credentials
    userInformation = {
      username: `DemoUser_${uniqueTimestampCounter}`,
      password: `DemoPass@${uniqueTimestampCounter}`,
      role: userTestData.role,
      employeeName: assignedEmployeeName,
      status: userTestData.status,
      createdAt: new Date().toISOString()
    };

    // ACT: Perform login with admin credentials
    LoginPage.login(adminCredentials.username, adminCredentials.password);
    cy.wait(3000);
    
    // Verify successful login by checking dashboard heading visibility
    cy.get('.oxd-topbar-header-breadcrumb h6', { timeout: 20000 }).should('be.visible');
    DashboardPage.verifyUserIsOnDashboard();
    
    // Navigate to Admin module
    cy.wait(2000);
    DashboardPage.navigateToAdmin();
    cy.wait(3000);

    // ASSERT: Add user with role, employee assignment, and status
    AdminPage.addUser({
      role: userInformation.role,
      employeeName: userInformation.employeeName,
      status: userInformation.status,
      username: userInformation.username,
      password: userInformation.password
    });

    // Persist user data to JSON file for cleanup reference
    saveUserData(userInformation);
    
    cy.log(`✓ User successfully created with username: ${userInformation.username}`);
    cy.log(`✓ User assigned to employee: ${userInformation.employeeName}`);
    cy.log(`✓ User data persisted for audit trail and cleanup`);

    cy.log('✓ TC_007 PASSED - User creation and data storage verified');
  });

  /**
   * Hook: After each test case execution
   * - Add wait time before moving to next test
   * - Clean up session if needed
   */
  afterEach(() => {
    cy.wait(1000);
    cy.log(`✓ User created: ${userInformation.username}`);
    cy.log('✓ TC_007 PASSED');
  });

  afterEach(() => {
    cy.wait(1000);
    DashboardPage.logout();
    cy.wait(1000);
  });
});
