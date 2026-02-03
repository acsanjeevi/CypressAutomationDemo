/**
 * DashboardPage.ts - Page Object Model for OrangeHRM Dashboard Module
 * 
 * This page object encapsulates all interactions with the OrangeHRM dashboard.
 * It provides methods for:
 * - Verifying dashboard access after authentication
 * - Navigating to different modules (PIM, Admin, Recruitment)
 * - User session management (logout)
 */

class DashboardPage {
  /**
   * CSS selector for the user dropdown menu button
   * Used to access user menu options
   * @private
   */
  private userDropdownMenuButton = '.oxd-userdropdown-tab';

  /**
   * CSS selector for the logout button in user menu
   * @private
   */
  private logoutOptionButton = 'a[href="/web/index.php/auth/logout"]';

  /**
   * CSS selector for the dashboard page heading
   * Used to verify presence on dashboard
   * @private
   */
  private dashboardPageHeading = '.oxd-topbar-header-breadcrumb h6';

  /**
   * CSS selector for the navigation menu bar
   * @private
   */
  private navigationMenuBar = '.oxd-navbar';

  /**
   * Verify that user is currently on the dashboard page
   * 
   * @description Checks for visibility of dashboard heading element
   *              which confirms successful authentication and dashboard access
   */
  verifyUserIsOnDashboard(): void {
    cy.get(this.dashboardPageHeading).should('be.visible');
    cy.log('✓ Dashboard page verified - User successfully authenticated');
  }

  /**
   * Click on the user dropdown menu to access user options
   * 
   * @description Clicks the user menu button located in the top right corner
   *              to expand dropdown options (profile, logout, etc.)
   */
  clickUserMenu(): void {
    cy.get(this.userDropdownMenuButton).click();
    cy.log('✓ User dropdown menu opened');
  }

  /**
   * Logout the current user from the application
   * 
   * @description Performs logout operation by:
   *              1. Opening user dropdown menu
   *              2. Clicking logout button
   *              3. Terminating user session
   */
  logout(): void {
    this.clickUserMenu();
    cy.get(this.logoutOptionButton).click();
    cy.log('✓ User logged out successfully - Session terminated');
  }

  /**
   * Navigate to Personnel Information Management (PIM) module
   * 
   * @description Clicks the PIM menu link in the navigation bar
   *              to navigate to employee management module
   */
  navigateToPim(): void {
    cy.contains('a', 'PIM').click();
    cy.log('✓ Navigated to PIM (Personnel Information Management) module');
    cy.wait(1000);
  }

  /**
   * Navigate to Admin module for system administration tasks
   * 
   * @description Clicks the Admin menu link in the navigation bar
   *              to navigate to admin management module for user management
   */
  navigateToAdmin(): void {
    cy.contains('a', 'Admin').click();
    cy.log('✓ Navigated to Admin module for system administration');
    cy.wait(1000);
  }

  /**
   * Navigate to Recruitment module for recruitment management
   * 
   * @description Clicks the Recruitment menu link in the navigation bar
   *              to navigate to recruitment module for managing job applications
   */
  navigateToRecruitment(): void {
    cy.contains('a', 'Recruitment').click();
    cy.log('✓ Navigated to Recruitment module for recruitment management');
    cy.wait(1000);
  }

  /**
   * Navigate to Leave module for leave management
   * 
   * @description Clicks the Leave menu link in the navigation bar
   *              to navigate to leave management module for applying and tracking leaves
   */
  navigateToLeave(): void {
    cy.contains('a', 'Leave').click();
    cy.log('✓ Navigated to Leave module for leave management');
    cy.wait(1000);
  }
}

export default new DashboardPage();

