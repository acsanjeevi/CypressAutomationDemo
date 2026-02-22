/**
 * Common Commands - Shared utility methods used across all modules
 * Provides common operations like logout, navigation, validation, etc.
 */

export class CommonCommands {
  private userDropdownMenuButton = '.oxd-userdropdown-tab';
  private logoutOptionButton = 'a[href="/web/index.php/auth/logout"]';
  private dashboardPageHeading = '.oxd-topbar-header-breadcrumb h6';
  private navigationMenuBar = '.oxd-navbar';

  /**
   * Verify user is on dashboard
   */
  verifyDashboard(): void {
    cy.get(this.dashboardPageHeading, { timeout: 15000 }).should('be.visible');
  }

  /**
   * Navigate to PIM module
   */
  navigateToPim(): void {
    cy.contains('a', 'PIM', { timeout: 15000 }).click();
    cy.wait(2000);
  }

  /**
   * Navigate to Admin module
   */
  navigateToAdmin(): void {
    cy.contains('a', 'Admin', { timeout: 15000 }).click();
    cy.wait(2000);
  }

  /**
   * Navigate to Leave module
   */
  navigateToLeave(): void {
    cy.contains('a', 'Leave', { timeout: 15000 }).click();
    cy.wait(2000);
  }

  /**
   * Navigate to Recruitment module
   */
  navigateToRecruitment(): void {
    cy.contains('a', 'Recruitment', { timeout: 15000 }).click();
    cy.wait(2000);
  }

  /**
   * Open user dropdown menu
   */
  openUserMenu(): void {
    cy.get(this.userDropdownMenuButton).click();
    cy.wait(1000);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.openUserMenu();
    cy.get(this.logoutOptionButton).click();
    cy.wait(2000);
  }

  /**
   * Wait for page load
   */
  waitForPageLoad(timeout: number = 5000): void {
    cy.wait(timeout);
  }

  /**
   * Verify element visibility
   */
  verifyElementVisible(selector: string, timeout: number = 10000): void {
    cy.get(selector, { timeout }).should('be.visible');
  }

  /**
   * Click element with wait
   */
  clickElement(selector: string, wait: number = 500): void {
    cy.get(selector).click();
    cy.wait(wait);
  }

  /**
   * Type text with clear
   */
  typeText(selector: string, text: string, delay: number = 50): void {
    cy.get(selector).clear({ force: true }).type(text, { delay });
  }

  /**
   * Get text from element
   */
  getElementText(selector: string): Cypress.Chainable<string> {
    return cy.get(selector).invoke('text') as Cypress.Chainable<string>;
  }

  /**
   * Verify table row exists
   */
  verifyTableRowExists(tableSelector: string, rowData: string): void {
    cy.get(tableSelector, { timeout: 10000 }).should('contain', rowData);
  }

  /**
   * Delete record from table
   */
  deleteRecordFromTable(deleteButtonSelector: string = 'button[title="Delete"]'): void {
    cy.get(deleteButtonSelector).click();
    cy.wait(1000);
  }

  /**
   * Confirm delete operation
   */
  confirmDelete(confirmButtonSelector: string = 'button.oxd-button--danger'): void {
    cy.get(confirmButtonSelector).click();
    cy.log('✓ Delete confirmed');
    cy.wait(2000);
  }

  /**
   * Add button validation
   */
  validateAddButton(buttonSelector: string = 'button:contains("Add")'): void {
    cy.get(buttonSelector, { timeout: 15000 }).should('be.visible').should('not.be.disabled');
    cy.log('✓ Add button validated - Present and enabled');
  }

  /**
   * Validate form submission button
   */
  validateSubmitButton(buttonSelector: string = 'button[type="submit"]'): void {
    cy.get(buttonSelector, { timeout: 15000 }).should('be.visible');
    cy.log('✓ Submit button validated - Present and visible');
  }

  /**
   * Search records in table
   */
  searchInTable(searchSelector: string, searchTerm: string): void {
    cy.get(searchSelector).clear({ force: true }).type(searchTerm, { delay: 50 });
    cy.wait(1500);
    cy.log(`✓ Searched for: ${searchTerm}`);
  }
}

export default new CommonCommands();
