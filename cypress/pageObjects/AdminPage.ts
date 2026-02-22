import selectors from '../fixtures/selectors.json';

interface UserDetails {
  role: string;
  employee: string;
  status: string;
  username: string;
  password: string;
}

class AdminPage {
  clickAddUser(): void {
    cy.contains('button', 'Add').first().click();
    cy.log('✓ Add User button clicked');
    cy.get(selectors.admin.usernameInput, { timeout: 20000 }).should('be.visible');
    cy.wait(1000);
  }

  selectRole(role: string): void {
    cy.get(selectors.admin.roleDropdown).first().click();
    cy.contains(role).click();
    cy.log(`✓ Role selected: ${role}`);
    cy.wait(500);
  }

  selectEmployee(employeeName: string): void {
    cy.get(selectors.admin.employeeSearchInput).clear().type(employeeName, { delay: 100 });
    cy.wait(500);
    cy.contains(employeeName).click();
    cy.log(`✓ Employee selected: ${employeeName}`);
    cy.wait(500);
  }

  selectStatus(status: string): void {
    cy.get(selectors.admin.statusDropdown).eq(1).click();
    cy.contains(status).click();
    cy.log(`✓ Status selected: ${status}`);
    cy.wait(500);
  }

  enterUsername(username: string): void {
    cy.get(selectors.admin.usernameInput).clear().type(username, { delay: 100 });
    cy.log(`✓ Username entered: ${username}`);
  }

  enterPassword(password: string): void {
    cy.get(selectors.admin.passwordInput).clear().type(password, { delay: 100 });
    cy.log('✓ Password entered');
  }

  enterConfirmPassword(password: string): void {
    cy.get(selectors.admin.confirmPasswordInput).clear().type(password, { delay: 100 });
    cy.log('✓ Confirm password entered');
  }

  saveUser(): void {
    cy.get(selectors.admin.saveButton).click();
    cy.log('✓ User save button clicked');
    cy.get(selectors.admin.successNotification, { timeout: 20000 }).should('be.visible');
    cy.log('✓ User created successfully');
    cy.wait(1000);
  }

  searchUser(username: string): void {
    cy.get(selectors.admin.usernameInput).clear().type(username);
    cy.log(`✓ User searched: ${username}`);
    cy.wait(1000);
  }

  deleteUser(): void {
    cy.get(selectors.admin.deleteUserButton).first().click();
    cy.get(selectors.admin.confirmDeleteButton).click();
    cy.log('✓ User deleted successfully');
    cy.wait(1000);
  }
}

export default new AdminPage();
