import selectors from '../fixtures/selectors.json';

class LoginPage {
  navigate(): void {
    cy.visit('/web/index.php/auth/login');
    cy.log('✓ Navigated to login page');
  }

  enterUsername(username: string): void {
    cy.get(selectors.login.usernameInput).clear().type(username, { delay: 100 });
    cy.log(`✓ Username entered: ${username}`);
  }

  enterPassword(password: string): void {
    cy.get(selectors.login.passwordInput).clear().type(password, { delay: 100 });
    cy.log('✓ Password entered');
  }

  clickLogin(): void {
    cy.get(selectors.login.loginButton).click();
    cy.log('✓ Login button clicked');
  }

  verifyDashboard(): void {
    cy.get(selectors.dashboard.pageHeading, { timeout: 20000 }).should('be.visible');
    cy.log('✓ Dashboard verified');
  }

  verifyErrorMessage(): void {
    cy.get(selectors.login.errorMessage)
      .should('be.visible')
      .invoke('text')
      .should('include', 'Invalid credentials');
    cy.log('✓ Error message verified');
  }

  verifyRequiredFieldError(): void {
    cy.get(selectors.login.errorMessage)
      .should('be.visible')
      .invoke('text')
      .should('include', 'Required');
    cy.log('✓ Required field error verified');
  }
}

export default new LoginPage();
