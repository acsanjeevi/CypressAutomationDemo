import LoginPage from '../pageObjects/LoginPage';
import DashboardPage from '../pageObjects/DashboardPage';

class LoginCommands {
  login(username: string, password: string): void {
    LoginPage.navigate();
    LoginPage.enterUsername(username);
    LoginPage.enterPassword(password);
    LoginPage.clickLogin();
    LoginPage.verifyDashboard();
    cy.log('✓ Login workflow completed');
  }

  verifyInvalidCredentials(): void {
    LoginPage.verifyErrorMessage();
  }

  verifyRequiredField(): void {
    LoginPage.verifyRequiredFieldError();
  }

  logout(): void {
    DashboardPage.logout();
    cy.log('✓ Logout workflow completed');
  }
}

export default new LoginCommands();
