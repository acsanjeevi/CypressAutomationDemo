/**
 * LeaveManagementPage.ts - Page Object Model for OrangeHRM Leave Management Module
 * 
 * This page object encapsulates all interactions with the OrangeHRM Leave Management module.
 * It provides methods for:
 * - Applying leave for employees
 * - Approving leave requests
 * - Canceling/Rejecting leave requests
 * - Verifying leave status (Pending, Approved, Rejected)
 * - Searching for leave records
 * - Managing leave balance information
 */

/**
 * Interface defining the structure of leave request data
 * 
 * @interface LeaveRequest
 * @property {string} employeeName - Name of the employee requesting leave
 * @property {string} leaveType - Type of leave (Annual, Sick, Casual, etc.)
 * @property {string} fromDate - Start date of the leave (format: YYYY-MM-DD)
 * @property {string} toDate - End date of the leave (format: YYYY-MM-DD)
 * @property {string} reason - Optional reason for taking leave
 */
interface LeaveRequest {
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
}

class LeaveManagementPage {
  /**
   * CSS selector for the Apply Leave button in Leave module
   * @private
   */
  private applyLeaveButton = 'button:contains("Apply")';

  /**
   * CSS selector for the Leave Type dropdown selector
   * @private
   */
  private leaveTypeDropdownSelector = '.oxd-select-wrapper';

  /**
   * CSS selector for the From Date input field
   * @private
   */
  private fromDateInputField = 'input[placeholder="yyyy-mm-dd"]';

  /**
   * CSS selector for the To Date input field
   * @private
   */
  private toDateInputField = 'input[placeholder="yyyy-mm-dd"]';

  /**
   * CSS selector for the Reason/Comments input field
   * @private
   */
  private reasonInputField = 'textarea[placeholder="Type your comments"]';

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
   * CSS selector for the error notification toast message
   * @private
   */
  private errorNotificationMessage = '.oxd-toast--error';

  /**
   * CSS selector for the leave list table
   * @private
   */
  private leaveListTable = '.oxd-table-body';

  /**
   * CSS selector for the Cancel/Delete button for leave records
   * @private
   */
  private cancelLeaveButton = 'button[title="Cancel"]';

  /**
   * CSS selector for the danger/confirm cancellation button
   * @private
   */
  private confirmCancelButton = 'button.oxd-button--danger';

  /**
   * Click the Apply Leave button to initiate leave request creation
   * 
   * @description Opens the leave request creation form by clicking the Apply button
   *              in the Leave Management module interface
   */
  clickApplyLeave(): void {
    cy.contains('button', 'Apply', { timeout: 20000 }).first().click();
    cy.log('✓ Apply Leave button clicked - Leave request form opened');
    cy.wait(2000);
  }

  /**
   * Select leave type from the dropdown
   * 
   * @param leaveType - The type of leave to select (e.g., "Annual", "Sick", "Casual")
   * @description Clicks the Leave Type dropdown and selects the specified leave type
   *              with realistic user interaction delays
   */
  selectLeaveType(leaveType: string): void {
    cy.get(this.leaveTypeDropdownSelector).first().click();
    cy.wait(500);
    cy.contains('.oxd-select-option', leaveType, { timeout: 15000 }).click();
    cy.log(`✓ Leave type selected: ${leaveType}`);
    cy.wait(500);
  }

  /**
   * Enter the From Date for the leave request
   * 
   * @param fromDate - The start date in YYYY-MM-DD format
   * @description Enters the from date for leave request with realistic input delays
   */
  fillFromDate(fromDate: string): void {
    // First date input field is typically the From Date
    cy.get('input[placeholder="yyyy-mm-dd"]').first().clear().type(fromDate, { delay: 100 });
    cy.log(`✓ Leave from date entered: ${fromDate}`);
    cy.wait(500);
  }

  /**
   * Enter the To Date for the leave request
   * 
   * @param toDate - The end date in YYYY-MM-DD format
   * @description Enters the to date for leave request with realistic input delays
   */
  fillToDate(toDate: string): void {
    // Second date input field is typically the To Date
    cy.get('input[placeholder="yyyy-mm-dd"]').last().clear().type(toDate, { delay: 100 });
    cy.log(`✓ Leave to date entered: ${toDate}`);
    cy.wait(500);
  }

  /**
   * Enter optional reason/comments for the leave request
   * 
   * @param reason - The reason for taking leave
   * @description Enters the optional reason/comments in the text area
   */
  fillReason(reason: string): void {
    cy.get(this.reasonInputField).clear().type(reason, { delay: 100 });
    cy.log(`✓ Leave reason entered: ${reason}`);
    cy.wait(500);
  }

  /**
   * Submit the leave request form to save the request
   * 
   * @description Clicks the Save button to submit the leave request form
   *              and persist leave data to the system
   */
  saveLeaveRequest(): void {
    cy.get(this.formSaveButton, { timeout: 20000 }).click();
    cy.wait(2000);
    cy.log('✓ Save button clicked - Leave request form submitted');
  }

  /**
   * Verify that the leave request was successfully submitted
   * 
   * @description Checks for the visibility of success notification message
   *              confirming that leave request was successfully created
   */
  verifyLeaveRequestSubmitted(): void {
    cy.get(this.successNotificationMessage, { timeout: 20000 }).should('be.visible');
    cy.wait(1000);
    cy.log('✓ Success notification verified - Leave request submitted successfully to system');
  }

  /**
   * Complete workflow to apply leave
   * 
   * @param leaveRequest - Object containing leave details
   * @description This is a composite method that performs the complete leave application workflow:
   *              1. Clicks Apply Leave button
   *              2. Selects leave type
   *              3. Fills from date
   *              4. Fills to date
   *              5. Fills reason if provided
   *              6. Saves the form
   *              7. Verifies successful submission
   */
  applyLeave(leaveRequest: LeaveRequest): void {
    this.clickApplyLeave();
    this.selectLeaveType(leaveRequest.leaveType);
    this.fillFromDate(leaveRequest.fromDate);
    this.fillToDate(leaveRequest.toDate);
    
    if (leaveRequest.reason) {
      this.fillReason(leaveRequest.reason);
    }
    
    this.saveLeaveRequest();
    this.verifyLeaveRequestSubmitted();
    cy.log(`✓ Leave request applied for period: ${leaveRequest.fromDate} to ${leaveRequest.toDate}`);
  }

  /**
   * Search for a leave request in the leave list
   * 
   * @param employeeName - The name of the employee to search for
   * @description Enters the employee name in the search field to find specific leave records
   */
  searchLeaveRecord(employeeName: string): void {
    const leaveSearchInput = 'input[placeholder="Search"]';
    cy.get(leaveSearchInput).clear().type(employeeName, { delay: 100 });
    cy.log(`✓ Leave record search initiated for employee: ${employeeName}`);
    cy.wait(1000);
  }

  /**
   * Cancel a submitted leave request
   * 
   * @description Performs the cancel/rejection operation by:
   *              1. Clicking the Cancel button
   *              2. Confirming the cancellation
   *              3. Waiting for the operation to complete
   */
  cancelLeaveRequest(): void {
    cy.get(this.cancelLeaveButton, { timeout: 20000 }).click();
    cy.log('✓ Cancel button clicked - Cancellation confirmation dialog opened');
    cy.wait(1000);
    cy.get(this.confirmCancelButton, { timeout: 15000 }).click();
    cy.log('✓ Cancellation operation confirmed - Leave record cancellation initiated');
    cy.wait(1000);
  }

  /**
   * Verify that a leave request was successfully canceled
   * 
   * @description Checks for the visibility of success notification message
   *              confirming that leave request cancellation was successful
   */
  verifyLeaveRequestCanceled(): void {
    cy.get(this.successNotificationMessage, { timeout: 20000 }).should('be.visible');
    cy.log('✓ Success notification verified - Leave request canceled successfully from system');
  }
}

export default new LeaveManagementPage();
export type { LeaveRequest };
