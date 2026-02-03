/**
 * LoginPage.ts - Page Object Model for OrangeHRM Authentication Module
 * 
 * This page object encapsulates all interactions with the OrangeHRM login page.
 * It provides methods for:
 * - Entering username credentials
 * - Entering password credentials
 * - Submitting login form
 * - Verifying dashboard access after successful authentication
 * - Validating error messages for authentication failures
 */

class LoginPage {
  /**
   * CSS selector for the username input field
   * @private
   */
  private usernameInputField = 'input[name="username"]';

  /**
   * CSS selector for the password input field
   * @private
   */
  private passwordInputField = 'input[name="password"]';

  /**
   * CSS selector for the login submit button
   * @private
   */
  private loginSubmitButton = 'button[type="submit"]';

  /**
   * CSS selector for error message container
   * @private
   */
  private errorMessageContainer = '.oxd-alert-content--error';

  /**
   * CSS selector for dashboard heading after successful login
   * @private
   */
  private dashboardPageHeading = '.oxd-topbar-header-breadcrumb h6';

  /**
   * Enter username in the username input field
   * 
   * @param username - The username to enter for authentication
   * @description Clears any existing text and enters the provided username
   *              with a 100ms delay for realistic user behavior
   */
  enterUsername(username: string): void {
    cy.get(this.usernameInputField).clear().type(username, { delay: 100 });
    cy.log(`✓ Username entered: ${username}`);
  }

  /**
   * Enter password in the password input field
   * 
   * @param password - The password to enter for authentication
   * @description Clears any existing text and enters the provided password
   *              with a 100ms delay. Password value is not logged for security.
   */
  enterPassword(password: string): void {
    cy.get(this.passwordInputField).clear().type(password, { delay: 100 });
    cy.log(`✓ Password entered: *** (masked for security)`);
  }

  /**
   * Click the login submit button to submit the login form
   * 
   * @description Clicks the login button to initiate authentication process
   */
  clickLoginButton(): void {
    cy.get(this.loginSubmitButton).click();
    cy.log('✓ Login button clicked - Authentication initiated');
  }

  /**
   * Perform complete login workflow with provided credentials
   * 
   * @param username - The username for authentication
   * @param password - The password for authentication
   * @description This is a composite method that performs the complete login flow:
   *              1. Navigates to login page
   *              2. Enters username
   *              3. Enters password
   *              4. Clicks login button
   */
  login(username: string, password: string): void {
    cy.visit('/web/index.php/auth/login');
    cy.log('✓ Navigated to login page');
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
  }

  /**
   * Verify that the user is logged in by checking dashboard visibility
   * 
   * @description Confirms that the dashboard heading is visible,
   *              indicating successful authentication and page navigation
   */
  verifyDashboardDisplayed(): void {
    cy.get(this.dashboardPageHeading).should('be.visible');
    cy.log('✓ Dashboard page verified - User successfully authenticated');
  }

  /**
   * Verify that an error message is displayed on the login page
   * 
   * @description Checks for visibility of error message and logs the error text
   *              Useful for validating error scenarios
   */
  verifyErrorMessageDisplayed(): void {
    cy.get(this.errorMessageContainer)
      .should('be.visible')
      .then(($errorElement) => {
        const errorMessageText = $errorElement.text();
        cy.log(`✓ Error message displayed: ${errorMessageText}`);
      });
  }

  /**
   * Verify that invalid credentials error message is displayed
   * 
   * @description Validates that the specific "Invalid credentials" error message
   *              is shown when incorrect username/password combination is provided
   */
  verifyInvalidCredentialsError(): void {
    cy.get(this.errorMessageContainer)
      .should('be.visible')
      .invoke('text')
      .should('include', 'Invalid credentials');
    cy.log('✓ Invalid credentials error verified - Authentication failed as expected');
  }
}

export default new LoginPage();

