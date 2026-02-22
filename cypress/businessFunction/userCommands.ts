import DashboardPage from '../pageObjects/DashboardPage';
import AdminPage from '../pageObjects/AdminPage';

interface UserDetails {
  role: string;
  employee: string;
  status: string;
  username: string;
  password: string;
}

class UserCommands {
  createUser(user: UserDetails): void {
    DashboardPage.navigateTo('Admin');
    AdminPage.clickAddUser();
    AdminPage.selectRole(user.role);
    AdminPage.selectEmployee(user.employee);
    AdminPage.selectStatus(user.status);
    AdminPage.enterUsername(user.username);
    AdminPage.enterPassword(user.password);
    AdminPage.enterConfirmPassword(user.password);
    AdminPage.saveUser();
    cy.log('✓ User creation workflow completed');
  }

  searchAndDeleteUser(username: string): void {
    DashboardPage.navigateTo('Admin');
    AdminPage.searchUser(username);
    cy.wait(1000);
    AdminPage.deleteUser();
    cy.log('✓ User deletion workflow completed');
  }
}

export default new UserCommands();
