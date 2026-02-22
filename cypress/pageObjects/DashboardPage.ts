import selectors from '../fixtures/selectors.json';

class DashboardPage {
  verifyPageLoaded(): void {
    cy.get(selectors.dashboard.pageHeading, { timeout: 20000 }).should('be.visible');
    cy.log('✓ Dashboard page loaded');
  }

  navigateTo(module: string): void {
    cy.contains('a', module, { timeout: 10000 }).click();
    cy.log(`✓ Navigated to ${module} module`);
    cy.wait(1000);
  }

  logout(): void {
    cy.get(selectors.dashboard.userDropdown).click();
    cy.get(selectors.dashboard.logoutButton).click();
    cy.log('✓ Logged out successfully');
  }
}

export default new DashboardPage();
