// Leave Management Module - Apply and cancel leave requests

import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import LeaveManagementPage from '../../pages/LeaveManagementPage';
import { readEmployeeTestData } from '../../support/cleanupHelper';
import { saveLeaveData } from '../../support/testDataHelper';

describe('Leave Management Module - Leave Application and Cancellation', () => {
  let leaveRequestInformation: any;

  beforeEach(() => {
    cy.fixture('credentials').as('credentials');
    cy.fixture('testdata').as('testdata');
  });

  // TC_008: Apply leave for created employee and verify submission
  it('TC_008: Apply leave for created employee and verify successful submission', function () {
    const adminCredentials = this.credentials.admin;
    const leaveTestData = this.testdata.leave;

    // Read employee data asynchronously
    readEmployeeTestData().then((employeeRecords) => {
      const targetEmployee = employeeRecords.length > 0 
        ? employeeRecords[employeeRecords.length - 1]
        : null;

      if (!targetEmployee) {
        cy.log('⚠ Warning: No employee data found. Create employee first in TC_006');
        this.skip();
        return;
      }

      // Calculate leave dates (start from tomorrow)
      const today = new Date();
      const fromDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const toDate = new Date(fromDate.getTime() + 4 * 24 * 60 * 60 * 1000);

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      leaveRequestInformation = {
        employeeName: `${targetEmployee.firstName} ${targetEmployee.lastName}`,
        employeeId: targetEmployee.employeeId,
        leaveType: leaveTestData.leaveType,
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
        reason: leaveTestData.reason,
        status: 'Pending Approval',
        createdAt: new Date().toISOString()
      };

      // ACT: Perform login with admin credentials
      LoginPage.login(adminCredentials.username, adminCredentials.password);
      cy.wait(3000);
      
      // Verify successful login
      cy.get('.oxd-topbar-header-breadcrumb h6', { timeout: 20000 }).should('be.visible');
      DashboardPage.verifyUserIsOnDashboard();
      //Testing commit chages
      // Navigate to Leave module
      cy.wait(2000);
      DashboardPage.navigateToLeave();
      cy.wait(3000);

      // ASSERT: Apply leave and verify submission
      LeaveManagementPage.applyLeave({
        employeeName: leaveRequestInformation.employeeName,
        leaveType: leaveRequestInformation.leaveType,
        fromDate: leaveRequestInformation.fromDate,
        toDate: leaveRequestInformation.toDate,
        reason: leaveRequestInformation.reason
      });

      // Persist leave data to JSON file for audit trail
      saveLeaveData(leaveRequestInformation);
      
      cy.log(`✓ Leave request successfully submitted for employee: ${leaveRequestInformation.employeeName}`);
      cy.log(`✓ Leave period: ${leaveRequestInformation.fromDate} to ${leaveRequestInformation.toDate}`);
      cy.log(`✓ Leave data persisted for audit trail and cleanup`);

      cy.log('✓ TC_008 PASSED - Leave application and submission verified');
    });
  });

  // TC_009: Cancel applied leave and verify removal
  it('TC_009: Cancel applied leave and verify successful removal', function () {
    const adminCredentials = this.credentials.admin;

    // Read employee data asynchronously
    readEmployeeTestData().then((employeeRecords) => {
      const targetEmployee = employeeRecords.length > 0 
        ? employeeRecords[employeeRecords.length - 1]
        : null;

      if (!targetEmployee) {
        cy.log('⚠ Warning: No employee data found. Create employee first in TC_006');
        this.skip();
        return;
      }

      const employeeFullName = `${targetEmployee.firstName} ${targetEmployee.lastName}`;

      // ACT: Perform login with admin credentials
      LoginPage.login(adminCredentials.username, adminCredentials.password);
      cy.wait(3000);
      
      // Verify successful login
      cy.get('.oxd-topbar-header-breadcrumb h6', { timeout: 20000 }).should('be.visible');
      DashboardPage.verifyUserIsOnDashboard();
      
      // Navigate to Leave module
      cy.wait(2000);
      DashboardPage.navigateToLeave();
      cy.wait(3000);

      // Search for the leave record to locate it
      LeaveManagementPage.searchLeaveRecord(employeeFullName);
      cy.wait(1000);

      // ASSERT: Cancel the leave request and verify cancellation
      LeaveManagementPage.cancelLeaveRequest();
      LeaveManagementPage.verifyLeaveRequestCanceled();
      
      cy.log(`✓ Leave request successfully canceled for employee: ${employeeFullName}`);
      cy.log(`✓ Leave record removed from active leaves in system`);

      cy.log('✓ TC_009 PASSED - Leave cancellation and removal verified');
    });
  });

  afterEach(() => {
    cy.wait(1000);
  });
});
