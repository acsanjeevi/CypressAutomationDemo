import selectors from '../fixtures/selectors.json';

interface Employee {
  firstName: string;
  lastName: string;
  middleName?: string;
}

class PimPage {
  clickAddEmployee(): void {
    cy.contains('button', 'Add').first().click();
    cy.log('✓ Add Employee button clicked');
    cy.get(selectors.pim.firstNameInput, { timeout: 20000 }).should('be.visible');
    cy.wait(1000);
  }

  fillEmployee(employee: Employee): void {
    cy.get(selectors.pim.firstNameInput).clear().type(employee.firstName, { delay: 100 });
    cy.log(`✓ First name entered: ${employee.firstName}`);

    if (employee.middleName) {
      cy.get(selectors.pim.middleNameInput).clear().type(employee.middleName, { delay: 100 });
      cy.log(`✓ Middle name entered: ${employee.middleName}`);
    }

    cy.get(selectors.pim.lastNameInput).clear().type(employee.lastName, { delay: 100 });
    cy.log(`✓ Last name entered: ${employee.lastName}`);
  }

  saveEmployee(): void {
    cy.get(selectors.pim.saveButton).click();
    cy.log('✓ Employee save button clicked');
    cy.get(selectors.pim.successNotification, { timeout: 20000 }).should('be.visible');
    cy.log('✓ Employee created successfully');
    cy.wait(1000);
  }

  getEmployeeId(): Cypress.Chainable<string> {
    return cy.get(selectors.pim.employeeIdField).invoke('val') as Cypress.Chainable<string>;
  }

  searchEmployee(employeeId: string): void {
    cy.get(selectors.pim.searchInput).clear().type(employeeId);
    cy.log(`✓ Employee searched: ${employeeId}`);
    cy.wait(1000);
  }

  deleteEmployee(): void {
    cy.get(selectors.pim.deleteButton).first().click();
    cy.get(selectors.pim.confirmDeleteButton).click();
    cy.log('✓ Employee deleted successfully');
    cy.wait(1000);
  }
}

export default new PimPage();
