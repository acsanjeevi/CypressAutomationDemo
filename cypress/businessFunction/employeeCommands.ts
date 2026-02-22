import DashboardPage from '../pageObjects/DashboardPage';
import PimPage from '../pageObjects/PimPage';

interface Employee {
  firstName: string;
  lastName: string;
  middleName?: string;
}

class EmployeeCommands {
  createEmployee(employee: Employee): Cypress.Chainable<string> {
    DashboardPage.navigateTo('PIM');
    PimPage.clickAddEmployee();
    PimPage.fillEmployee(employee);
    PimPage.saveEmployee();
    
    return PimPage.getEmployeeId().then((id) => {
      cy.log(`✓ Employee created with ID: ${id}`);
      return id;
    });
  }

  searchAndDeleteEmployee(employeeId: string): void {
    DashboardPage.navigateTo('PIM');
    PimPage.searchEmployee(employeeId);
    cy.wait(1000);
    PimPage.deleteEmployee();
    cy.log('✓ Employee deleted successfully');
  }
}

export default new EmployeeCommands();
