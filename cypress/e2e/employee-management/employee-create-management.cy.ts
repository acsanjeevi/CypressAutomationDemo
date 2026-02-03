// Employee Management Test Suite - TC_006
// Creates employee with unique data, persists for cleanup

import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import PimPage from '../../pages/PimPage';
import { saveEmployeeData } from '../../support/testDataHelper';

describe('PIM Module - Employee Management', () => {
  let employeeInformation: any;
  let uniqueTimestampCounter: number;

  beforeEach(() => {
    cy.fixture('credentials').as('credentials');
    cy.fixture('testdata').as('testdata');
    uniqueTimestampCounter = Math.floor(Date.now() / 1000) % 1000;
  });

  // TC_006: Create employee and verify data persisted
  it('TC_006: Validate employee creation and data storage in PIM module', function () {
    const adminCredentials = this.credentials.admin;
    const employeeTestData = this.testdata.employee;
    
    employeeInformation = {
      firstName: employeeTestData.firstName + '_' + uniqueTimestampCounter,
      middleName: employeeTestData.middleName,
      lastName: employeeTestData.lastName + '_' + uniqueTimestampCounter,
      createdAt: new Date().toISOString()
    };

    LoginPage.login(adminCredentials.username, adminCredentials.password);
    cy.wait(3000);
    cy.get('.oxd-topbar-header-breadcrumb h6', { timeout: 20000 }).should('be.visible');
    DashboardPage.verifyUserIsOnDashboard();
    cy.wait(2000);
    DashboardPage.navigateToPim();
    cy.wait(3000);

    PimPage.addEmployee({
      firstName: employeeInformation.firstName,
      middleName: employeeInformation.middleName,
      lastName: employeeInformation.lastName
    }).then((generatedEmployeeId) => {
      employeeInformation.employeeId = generatedEmployeeId;
      saveEmployeeData(employeeInformation);
      cy.log(`✓ Employee created: ${generatedEmployeeId}`);
      cy.log('✓ TC_006 PASSED');
    });
  });

  afterEach(() => {
    cy.wait(1000);
    DashboardPage.logout();
    cy.wait(1000);
  });
});
