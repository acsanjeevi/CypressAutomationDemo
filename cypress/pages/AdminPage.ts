/**
 * AdminPage.ts - Page Object Model for OrangeHRM Admin Module
 * 
 * This page object encapsulates all interactions with the OrangeHRM Admin module.
 * It provides methods for:
 * - Creating new system users with specific roles
 * - Assigning employees to user accounts
 * - Setting user account status (Enabled/Disabled)
 * - Managing user credentials (username and password)
 * - Searching and deleting user accounts
 * - Verifying successful user management operations
 */

/**
 * Interface defining the structure of user account details
 * 
 * @interface UserDetails
 * @property {string} role - User role in the system (e.g., "Admin", "ESS")
 * @property {string} employeeName - Name of the employee to assign to the user account
 * @property {string} status - Account status ("Enabled" or "Disabled")
 * @property {string} username - Login username for the user account
 * @property {string} password - Login password for the user account
 */
interface UserDetails {
  role: string;
  employeeName: string;
  status: string;
  username: string;
  password: string;
}

class AdminPage {
  /**
   * CSS selector for the Add User button in Admin module
   * @private
   */
  private addUserButton = 'button:contains("Add")';

  /**
   * CSS selector for the Role dropdown selector
   * @private
   */
  private roleDropdownSelector = '.oxd-select-wrapper';

  /**
   * CSS selector for the Employee Name search input field
   * @private
   */
  private employeeNameSearchField = 'input[placeholder="Type for hints..."]';

  /**
   * CSS selector for the Status dropdown selector
   * @private
   */
  private statusDropdownSelector = '.oxd-select-wrapper';

  /**
   * CSS selector for the Username input field
   * @private
   */
  private usernameInputField = 'input[placeholder="Username"]';

  /**
   * CSS selector for the Password input field
   * @private
   */
  private passwordInputField = 'input[placeholder="Password"]';

  /**
   * CSS selector for the Confirm Password input field
   * @private
   */
  private confirmPasswordInputField = 'input[placeholder="Confirm Password"]';

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
   * CSS selector for the Username search input field
   * @private
   */
  private usernameSearchField = 'input[placeholder="Search"]';

  /**
   * CSS selector for the Delete button for user records
   * @private
   */
  private deleteUserButton = 'button[title="Delete"]';

  /**
   * CSS selector for the danger/delete confirmation button
   * @private
   */
  private confirmDeleteOperationButton = 'button.oxd-button--danger';

  /**
   * Click the Add User button to initiate user creation
   * 
   * @description Opens the user creation form by clicking the Add button
   *              in the Admin module interface, with proper wait for form to load
   */
  clickAddUser(): void {
    cy.contains('button', 'Add').first().click();
    cy.log('✓ Add User button clicked - User creation form opened');
    // Wait for the form to fully load with username field visible
    cy.get(this.usernameInputField, { timeout: 20000 }).should('be.visible');
    cy.wait(1000);
  }

  /**
   * Select a user role from the role dropdown
   * 
   * @param role - The role to assign to the user (e.g., "Admin", "ESS")
   * @description Opens the role dropdown and selects the specified role
   *              for the new user account
   */
  selectRole(role: string): void {
    cy.get(this.roleDropdownSelector).first().click();
    cy.log(`✓ Role dropdown opened - Ready to select role`);
    cy.contains(role).click();
    cy.log(`✓ User role selected: ${role}`);
  }

  /**
   * Enter employee name to search for employee assignment
   * 
   * @param employeeName - The name of the employee to search for
   * @description Enters the employee name in the search field to find
   *              available employees for user assignment
   */
  enterEmployeeName(employeeName: string): void {
    cy.get(this.employeeNameSearchField).clear().type(employeeName, { delay: 100 });
    cy.log(`✓ Employee name entered for search: ${employeeName}`);
    cy.wait(500);
  }

  /**
   * Select an employee from the dropdown search results
   * 
   * @param employeeName - The employee name to select from dropdown
   * @description Clicks on the employee name in the dropdown to assign
   *              the employee to the new user account
   */
  selectEmployeeFromDropdown(employeeName: string): void {
    cy.contains(employeeName).click();
    cy.log(`✓ Employee selected and assigned: ${employeeName}`);
  }

  /**
   * Select the user account status
   * 
   * @param status - The status for the user account ("Enabled" or "Disabled")
   * @description Opens the status dropdown and selects the specified status
   *              for the user account (Enabled for active users, Disabled for inactive)
   */
  selectStatus(status: string): void {
    cy.get(this.statusDropdownSelector).eq(1).click();
    cy.log(`✓ Status dropdown opened - Ready to select status`);
    cy.contains(status).click();
    cy.log(`✓ User account status selected: ${status}`);
  }

  /**
   * Enter the username for the new user account
   * 
   * @param username - The login username to set for the user account
   * @description Enters the username that will be used for user authentication
   */
  enterUsername(username: string): void {
    cy.get(this.usernameInputField, { timeout: 20000 }).should('be.visible').clear().type(username, { delay: 100 });
    cy.log(`✓ Username entered: ${username}`);
  }

  /**
   * Enter the password for the new user account
   * 
   * @param password - The password to set for the user account
   * @description Enters the password for user authentication (not logged for security)
   */
  enterPassword(password: string): void {
    cy.get(this.passwordInputField).clear().type(password, { delay: 100 });
    cy.log(`✓ Password entered: *** (masked for security)`);
  }

  /**
   * Enter the password confirmation for the new user account
   * 
   * @param password - The password to confirm (must match initial password)
   * @description Enters the password confirmation to verify the user entered
   *              the correct password without typos
   */
  enterConfirmPassword(password: string): void {
    cy.get(this.confirmPasswordInputField).clear().type(password, { delay: 100 });
    cy.log(`✓ Password confirmation entered: *** (masked for security)`);
  }

  /**
   * Submit the user form to save new user account
   * 
   * @description Clicks the Save button to submit the user creation form
   *              and persist the new user account to the system
   */
  saveUser(): void {
    cy.get(this.formSaveButton).click();
    cy.log('✓ Save button clicked - User form submitted');
  }

  /**
   * Verify that the user was successfully created and saved
   * 
   * @description Checks for the visibility of success notification message
   *              confirming that user account creation was successful
   */
  verifyUserSaved(): void {
    cy.get(this.successNotificationMessage).should('be.visible');
    cy.log('✓ Success notification verified - User account saved successfully to system');
  }

  /**
   * Complete workflow to add new user with all details
   * 
   * @param userDetails - Object containing user account information (role, employeeName, status, username, password)
   * @description This is a composite method that performs the complete user creation workflow:
   *              1. Clicks Add User button
   *              2. Selects user role
   *              3. Searches and selects employee
   *              4. Selects account status
   *              5. Enters username
   *              6. Enters password
   *              7. Confirms password
   *              8. Saves the user account
   *              9. Verifies successful save
   */
  addUser(userDetails: UserDetails): void {
    this.clickAddUser();
    this.selectRole(userDetails.role);
    this.enterEmployeeName(userDetails.employeeName);
    cy.wait(500);
    this.selectEmployeeFromDropdown(userDetails.employeeName);
    this.selectStatus(userDetails.status);
    this.enterUsername(userDetails.username);
    this.enterPassword(userDetails.password);
    this.enterConfirmPassword(userDetails.password);
    this.saveUser();
    this.verifyUserSaved();
  }

  /**
   * Search for a user account by username
   * 
   * @param username - The username to search for in the user list
   * @description Enters the username in the search field to locate the specific user
   *              account in the user management list
   */
  searchUserByUsername(username: string): void {
    cy.get(this.usernameSearchField).clear().type(username, { delay: 100 });
    cy.log(`✓ User search initiated with username: ${username}`);
    cy.wait(500);
  }

  /**
   * Delete a user account from the system
   * 
   * @description Performs the delete operation by:
   *              1. Clicking the Delete button
   *              2. Confirming the delete operation
   *              3. Waiting for the operation to complete
   */
  deleteUser(): void {
    cy.get(this.deleteUserButton).click();
    cy.log('✓ Delete button clicked - Delete confirmation dialog opened');
    cy.get(this.confirmDeleteOperationButton).click();
    cy.log('✓ Delete operation confirmed - User account removal initiated');
    cy.wait(1000);
  }

  /**
   * Verify that a user account was successfully deleted from the system
   * 
   * @description Checks for the visibility of success notification message
   *              confirming that user account deletion was successful
   */
  verifyUserDeleted(): void {
    cy.get(this.successNotificationMessage).should('be.visible');
    cy.log('✓ Success notification verified - User account deleted successfully from system');
  }
}

export default new AdminPage();
export type { UserDetails };
