// Login Authentication Test Suite - TC_001-TC_005
// Tests: Valid/invalid credentials, empty fields, session management

import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';

describe('Login Module - Positive Authentication Scenarios', () => {
  beforeEach(() => {
    cy.fixture('credentials').as('credentials');
    cy.visit('/web/index.php/auth/login');
    cy.wait(2000);
  });

  it('TC_001: Validate successful login with valid admin credentials', function () {
    const adminUsername = this.credentials.admin.username;
    const adminPassword = this.credentials.admin.password;
    LoginPage.login(adminUsername, adminPassword);
    cy.wait(3000);
    DashboardPage.verifyUserIsOnDashboard();
    cy.log('✓ TC_001 PASSED');
  });

  afterEach(() => {
    cy.wait(1000);
    DashboardPage.logout();
    cy.wait(1000);
  });
});

describe('Login Module - Negative Authentication Scenarios', () => {
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login');
    cy.wait(2000);
    cy.get('input[name="username"]').should('be.visible');
  });

  it('TC_002: Validate error message for invalid username', () => {
    LoginPage.enterUsername('InvalidUser@123');
    cy.wait(500);
    LoginPage.enterPassword('admin123');
    cy.wait(500);
    LoginPage.clickLoginButton();
    cy.wait(2000);
    cy.get('.oxd-alert-content--error', { timeout: 15000 })
      .should('be.visible')
      .should('contain', 'Invalid credentials');
    cy.log('✓ TC_002 PASSED');
  });

  it('TC_003: Validate error message for invalid password', () => {
    LoginPage.enterUsername('Admin');
    cy.wait(500);
    LoginPage.enterPassword('wrongpassword@123');
    cy.wait(500);
    LoginPage.clickLoginButton();
    cy.wait(2000);
    cy.get('.oxd-alert-content--error', { timeout: 15000 })
      .should('be.visible')
      .should('contain', 'Invalid credentials');
    cy.log('✓ TC_003 PASSED');
  });

  it('TC_004: Validate error message when username field is empty', () => {
    // Leave username empty and just enter password
    cy.get('input[name="username"]').should('exist').should('have.value', '');
    LoginPage.enterPassword('admin123');
    cy.wait(500);
    LoginPage.clickLoginButton();
    cy.wait(2000);
    // Check for any validation error message  
    cy.get('span', { timeout: 15000 })
      .contains(/required|Required/)
      .should('be.visible');
    cy.log('✓ TC_004 PASSED');
  });

  it('TC_005: Validate error message when password field is empty', () => {
    LoginPage.enterUsername('Admin');
    cy.wait(500);
    cy.get('input[name="password"]').should('exist').should('have.value', '');
    LoginPage.clickLoginButton();
    cy.wait(2000);
    // Check for any validation error message
    cy.get('span', { timeout: 15000 })
      .contains(/required|Required/)
      .should('be.visible');
    cy.log('✓ TC_005 PASSED');
  });

  afterEach(() => {
    cy.wait(500);
  });
});
