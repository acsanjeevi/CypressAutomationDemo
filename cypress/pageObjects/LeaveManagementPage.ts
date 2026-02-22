import selectors from '../fixtures/selectors.json';

interface LeaveRequest {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
}

class LeaveManagementPage {
  clickApplyLeave(): void {
    cy.contains('button', 'Apply').click();
    cy.log('✓ Apply Leave button clicked');
    cy.wait(1000);
  }

  selectLeaveType(leaveType: string): void {
    cy.get(selectors.leave.leaveTypeDropdown).first().click();
    cy.contains(leaveType).click();
    cy.log(`✓ Leave type selected: ${leaveType}`);
    cy.wait(500);
  }

  fillLeaveRequest(leave: LeaveRequest): void {
    this.selectLeaveType(leave.leaveType);

    cy.get(selectors.leave.fromDateInput).clear().type(leave.fromDate, { delay: 100 });
    cy.log(`✓ From date entered: ${leave.fromDate}`);

    cy.get(selectors.leave.toDateInput).clear().type(leave.toDate, { delay: 100 });
    cy.log(`✓ To date entered: ${leave.toDate}`);

    if (leave.reason) {
      cy.get(selectors.leave.reasonTextarea).clear().type(leave.reason, { delay: 100 });
      cy.log(`✓ Reason entered: ${leave.reason}`);
    }

    cy.wait(500);
  }

  submitLeaveRequest(): void {
    cy.get(selectors.leave.submitButton).click();
    cy.log('✓ Leave request submitted');
    cy.get(selectors.leave.successNotification, { timeout: 20000 }).should('be.visible');
    cy.log('✓ Leave request created successfully');
    cy.wait(1000);
  }

  cancelLeaveRequest(): void {
    cy.get(selectors.leave.cancelLeaveButton).first().click();
    cy.get(selectors.leave.confirmCancelButton).click();
    cy.log('✓ Leave request cancelled successfully');
    cy.wait(1000);
  }
}

export default new LeaveManagementPage();
