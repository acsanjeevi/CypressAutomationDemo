/**
 * PimPage.ts - Page Object Model for OrangeHRM PIM (Personnel Information Management) Module
 * 
 * This page object encapsulates all interactions with the OrangeHRM PIM module.
 * It provides methods for:
 * - Adding new employees to the system
 * - Filling employee personal information (first name, middle name, last name)
 * - Retrieving automatically generated employee IDs
 * - Searching for employees by ID
 * - Deleting employees from the system
 * - Verifying successful employee operations
 */

/**
 * Interface defining the structure of employee data
 * 
 * @interface Employee
 * @property {string} firstName - Employee's first name (required)
 * @property {string} lastName - Employee's last name (required)
 * @property {string} [middleName] - Employee's middle name (optional)
 * @property {string} [employeeId] - System-generated employee ID (optional)
 */
interface Employee {
  firstName: string;
  lastName: string;
  middleName?: string;
  employeeId?: string;
}

class PimPage {
  /**
   * CSS selector for the Add Employee button in PIM module
   * @private
   */
  private addEmployeeButton = 'button:contains("Add")';

  /**
   * CSS selector for the First Name input field
   * @private
   */
  private firstNameInputField = 'input[placeholder="First Name"]';

  /**
   * CSS selector for the Middle Name input field
   * @private
   */
  private middleNameInputField = 'input[placeholder="Middle Name"]';

  /**
   * CSS selector for the Last Name input field
   * @private
   */
  private lastNameInputField = 'input[placeholder="Last Name"]';

  /**
   * CSS selector for the Save button to submit form
   * @private
   */
  private formSaveButton = 'button[type="submit"]';

  /**
   * CSS selector for the success notification toast message
   * @private
   */
  private successNotificationMessage = '.oxd-toast--success';

  /**
   * CSS selector for the read-only Employee ID field
   * More specific selector that targets the employee ID input specifically
   * @private
   */
  private readOnlyEmployeeIdField = 'input[readonly][type="text"][placeholder="Employee Id"]';

  /**
   * CSS selector for the employee list table
   * @private
   */
  private employeeListTable = '.oxd-table-body';

  /**
   * CSS selector for the Delete button for employee records
   * @private
   */
  private deleteEmployeeButton = 'button[title="Delete"]';

  /**
   * CSS selector for the danger/delete confirmation button
   * @private
   */
  private confirmDeleteOperationButton = 'button.oxd-button--danger';

  /**
   * Click the Add Employee button to initiate employee creation
   * 
   * @description Opens the employee creation form by clicking the Add button
   *              in the PIM module interface, with proper wait for form to load
   */
  clickAddEmployee(): void {
    cy.contains('button', 'Add', { timeout: 20000 }).first().click();
    cy.log('✓ Add Employee button clicked - Employee creation form opened');
    // Wait for the first name field to be visible to confirm form loaded
    cy.get(this.firstNameInputField, { timeout: 20000 }).should('be.visible');
    cy.wait(2000);
  }

  /**
   * Enter the employee's first name in the form
   * 
   * @param firstName - The first name of the employee to be added
   * @description Clears any existing value and enters the provided first name
   *              with 100ms delay for realistic user interaction
   */
  fillFirstName(firstName: string): void {
    cy.get(this.firstNameInputField, { timeout: 20000 }).should('be.visible').clear().type(firstName, { delay: 100 });
    cy.wait(500);
    cy.log(`✓ Employee first name entered: ${firstName}`);
  }

  /**
   * Enter the employee's middle name in the form
   * 
   * @param middleName - The middle name of the employee to be added
   * @description Clears any existing value and enters the provided middle name
   *              with 100ms delay for realistic user interaction
   */
  fillMiddleName(middleName: string): void {
    cy.get(this.middleNameInputField, { timeout: 20000 }).clear().type(middleName, { delay: 100 });
    cy.wait(500);
    cy.log(`✓ Employee middle name entered: ${middleName}`);
  }

  /**
   * Enter the employee's last name in the form
   * 
   * @param lastName - The last name of the employee to be added
   * @description Clears any existing value and enters the provided last name
   *              with 100ms delay for realistic user interaction
   */
  fillLastName(lastName: string): void {
    cy.get(this.lastNameInputField, { timeout: 20000 }).clear().type(lastName, { delay: 100 });
    cy.wait(500);
    cy.log(`✓ Employee last name entered: ${lastName}`);
  }

  /**
   * Submit the employee form to save new employee
   * 
   * @description Clicks the Save button to submit the employee creation form
   *              and persist employee data to the system
   */
  saveEmployee(): void {
    cy.get(this.formSaveButton, { timeout: 20000 }).click();
    cy.wait(2000);
    cy.log('✓ Save button clicked - Employee form submitted');
  }

  /**
   * Verify that the employee was successfully saved
   * 
   * @description Checks for the visibility of success notification message
   *              confirming that employee creation was successful
   */
  verifyEmployeeSaved(): void {
    cy.get(this.successNotificationMessage, { timeout: 20000 }).should('be.visible');
    cy.wait(2000);
    cy.log('✓ Success notification verified - Employee saved successfully to system');
  }

  /**
   * Retrieve the system-generated Employee ID from the read-only field
   * 
   * @returns Cypress chainable object containing the employee ID string
   * @description Extracts the Employee ID from the read-only field after
   *              successful employee creation, with fallback selectors
   */
  getEmployeeId(): Cypress.Chainable<string> {
    return cy
      .get('input[readonly]', { timeout: 20000 })
      .should('be.visible')
      .then(($elements) => {
        // Find the input that contains employee ID (not empty)
        let employeeIdValue = '';
        $elements.each((index, el) => {
          const value = el.getAttribute('value');
          if (value && value.trim() !== '') {
            employeeIdValue = value;
          }
        });
        
        if (!employeeIdValue) {
          throw new Error('Employee ID not found in readonly fields');
        }
        
        cy.log(`✓ System-generated Employee ID retrieved: ${employeeIdValue}`);
        return employeeIdValue;
      });
  }

  /**
   * Complete workflow to add new employee with all details
   * 
   * @param employee - Object containing employee details (firstName, lastName, middleName)
   * @returns Cypress chainable containing the generated employee ID
   * @description This is a composite method that performs the complete employee creation workflow:
   *              1. Clicks Add Employee button
   *              2. Fills in first name
   *              3. Fills in middle name
   *              4. Fills in last name
   *              5. Saves the form
   *              6. Verifies successful save
   *              7. Retrieves and returns the generated employee ID
   */
  addEmployee(employee: Employee): Cypress.Chainable<string> {
    this.clickAddEmployee();
    this.fillFirstName(employee.firstName);
    this.fillMiddleName(employee.middleName || '');
    this.fillLastName(employee.lastName);
    this.saveEmployee();
    this.verifyEmployeeSaved();
    return this.getEmployeeId();
  }

  /**
   * Search for an employee by their Employee ID
   * 
   * @param employeeId - The Employee ID to search for
   * @description Enters the employee ID in the search field to find the specific employee
   *              in the employee list
   */
  searchEmployeeById(employeeId: string): void {
    const employeeSearchInput = 'input[placeholder="Type for hints..."]';
    cy.get(employeeSearchInput).clear().type(employeeId, { delay: 100 });
    cy.log(`✓ Employee search initiated with ID: ${employeeId}`);
    cy.wait(500);
  }

  /**
   * Delete an employee record from the system
   * 
   * @description Performs the delete operation by:
   *              1. Clicking the Delete button
   *              2. Confirming the delete operation
   *              3. Waiting for the operation to complete
   */
  deleteEmployee(): void {
    cy.get(this.deleteEmployeeButton).click();
    cy.log('✓ Delete button clicked - Delete confirmation dialog opened');
    cy.get(this.confirmDeleteOperationButton).click();
    cy.log('✓ Delete operation confirmed - Employee record removal initiated');
    cy.wait(1000);
  }

  /**
   * Verify that an employee was successfully deleted from the system
   * 
   * @description Checks for the visibility of success notification message
   *              confirming that employee deletion was successful
   */
  verifyEmployeeDeleted(): void {
    cy.get(this.successNotificationMessage).should('be.visible');
    cy.log('✓ Success notification verified - Employee deleted successfully from system');
  }
}

export default new PimPage();
export type { Employee };
