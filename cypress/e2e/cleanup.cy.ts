describe('Cleanup', () => {
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

  it('TC_26. Navigate to Employee List for cleanup', () => {
    cy.visit('/web/index.php/pim/viewEmployeeList');
    cy.wait(1000);
    cy.url().should('include', '/pim/viewEmployeeList');
  });

  it('TC_27. Navigate to User List for cleanup', () => {
    cy.visit('/web/index.php/admin/viewSystemUsers');
    cy.wait(1000);
    cy.url().should('include', '/admin/viewSystemUsers');
  });

  it('TC_28. Navigate to Leave List for cleanup', () => {
    cy.visit('/web/index.php/leave/viewLeaveList');
    cy.wait(1000);
    cy.url().should('include', '/leave/viewLeaveList');
  });

  it('TC_29. Navigate to Claim List for cleanup', () => {
    cy.visit('/web/index.php/claim/viewClaim');
    cy.wait(1000);
    cy.url().should('include', '/claim/viewClaim');
  });

  it('TC_30. Verify Dashboard loaded after cleanup navigation', () => {
    cy.visit('/web/index.php/dashboard/index');
    cy.wait(1000);
    cy.get('.oxd-topbar-header-breadcrumb h6').should('be.visible');
  });

  afterEach(() => {
    cy.get('.oxd-userdropdown-tab', { timeout: 10000 }).click({ force: true });
    cy.get('a[href="/web/index.php/auth/logout"]', { timeout: 10000 }).click({ force: true });
    cy.wait(1000);
  });
});
