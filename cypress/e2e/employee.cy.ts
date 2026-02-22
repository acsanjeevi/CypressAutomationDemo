describe('Employee', () => {
  let testdata: any;

  beforeEach(() => {
    cy.fixture('testdata').then((data) => {
      testdata = data;
    });
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type(Cypress.env('username'), { delay: 50 });
    cy.get('input[name="password"]').type(Cypress.env('password'), { delay: 50 });
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-topbar-header-breadcrumb h6', { timeout: 20000 }).should('be.visible');
  });

  it('TC_06. Create employee with valid data', () => {
    cy.visit('/web/index.php/pim/viewEmployeeList');
    cy.wait(1000);
    cy.get('button').filter(':contains("Add")').first().click({ force: true });
    cy.wait(1500);
    cy.get('input[placeholder="First Name"]').type('TestEmp1', { delay: 50 });
    cy.get('input[placeholder="Last Name"]').type('Employee', { delay: 50 });
    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-toast--success', { timeout: 20000 }).should('be.visible');
  });

  it('TC_07. Verify employee ID generated', () => {
    cy.visit('/web/index.php/pim/viewEmployeeList');
    cy.wait(1000);
    cy.get('button').filter(':contains("Add")').first().click({ force: true });
    cy.wait(1500);
    cy.get('input[placeholder="First Name"]').type('TestEmp2', { delay: 50 });
    cy.get('input[placeholder="Last Name"]').type('Employee', { delay: 50 });
    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-toast--success', { timeout: 20000 }).should('be.visible');
    cy.url().should('include', '/pim/');
  });

  it('TC_08. Navigate to employee list page', () => {
    cy.visit('/web/index.php/pim/viewEmployeeList');
    cy.url().should('include', '/pim/viewEmployeeList');
    cy.get('.oxd-table-body').should('be.visible');
  });

  it('TC_09. Create employee with empty first name - shows error', () => {
    cy.visit('/web/index.php/pim/viewEmployeeList');
    cy.wait(1000);
    cy.get('button').filter(':contains("Add")').first().click({ force: true });
    cy.wait(1500);
    cy.get('input[placeholder="Last Name"]').type('Employee', { delay: 50 });
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('be.visible');
  });

  it('TC_10. Create employee with empty last name - shows error', () => {
    cy.visit('/web/index.php/pim/viewEmployeeList');
    cy.wait(1000);
    cy.get('button').filter(':contains("Add")').first().click({ force: true });
    cy.wait(1500);
    cy.get('input[placeholder="First Name"]').type('TestEmp5', { delay: 50 });
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('be.visible');
  });

  afterEach(() => {
    cy.get('.oxd-userdropdown-tab', { timeout: 10000 }).click({ force: true });
    cy.get('a[href="/web/index.php/auth/logout"]', { timeout: 10000 }).click({ force: true });
    cy.wait(1000);
  });
});
