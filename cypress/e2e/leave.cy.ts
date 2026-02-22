describe('Leave', () => {
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

  it('TC_16. Navigate to Leave module', () => {
    cy.visit('/web/index.php/leave/viewLeaveList');
    cy.wait(1000);
    cy.url().should('include', '/leave/viewLeaveList');
  });

  it('TC_17. Verify Leave page loads with table', () => {
    cy.visit('/web/index.php/leave/viewLeaveList');
    cy.wait(1000);
    cy.get('button, table, [role="grid"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('TC_18. Navigate to Apply Leave form', () => {
    cy.visit('/web/index.php/leave/applyLeave');
    cy.wait(1000);
    cy.url().should('include', '/leave/applyLeave');
  });

  it('TC_19. Verify leave form has required fields', () => {
    cy.visit('/web/index.php/leave/applyLeave');
    cy.wait(1000);
    cy.get('input, select, textarea', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('TC_20. Navigate back from leave application', () => {
    cy.visit('/web/index.php/leave/viewLeaveList');
    cy.wait(1000);
    cy.url().should('include', '/leave');
  });

  afterEach(() => {
    cy.get('.oxd-userdropdown-tab', { timeout: 10000 }).click({ force: true });
    cy.get('a[href="/web/index.php/auth/logout"]', { timeout: 10000 }).click({ force: true });
    cy.wait(1000);
  });
});
