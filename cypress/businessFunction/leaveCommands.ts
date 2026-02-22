import DashboardPage from '../pageObjects/DashboardPage';
import LeaveManagementPage from '../pageObjects/LeaveManagementPage';

interface LeaveRequest {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
}

class LeaveCommands {
  applyLeave(leave: LeaveRequest): void {
    DashboardPage.navigateTo('Leave');
    LeaveManagementPage.clickApplyLeave();
    LeaveManagementPage.fillLeaveRequest(leave);
    LeaveManagementPage.submitLeaveRequest();
    cy.log('✓ Leave application workflow completed');
  }

  cancelLeave(): void {
    DashboardPage.navigateTo('Leave');
    cy.wait(1000);
    LeaveManagementPage.cancelLeaveRequest();
    cy.log('✓ Leave cancellation workflow completed');
  }
}

export default new LeaveCommands();
