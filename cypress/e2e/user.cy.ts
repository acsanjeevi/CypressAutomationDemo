describe('User', () => {
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

  it('TC_11. Navigate to Admin module', () => {
    cy.visit('/web/index.php/admin/viewSystemUsers');
    cy.wait(1000);
    cy.url().should('include', '/admin/viewSystemUsers');
  });

  it('TC_12. Verify Admin page loads with users table', () => {
    cy.visit('/web/index.php/admin/viewSystemUsers');
    cy.wait(1000);
    cy.get('.oxd-table-body').should('be.visible');
  });

  it('TC_13. Navigate to user creation form', () => {
    cy.visit('/web/index.php/admin/viewSystemUsers');
    cy.wait(1000);
    cy.get('button').filter(':contains("Add")').click({ force: true });
    cy.wait(1500);
    cy.url().should('include', '/admin/saveSystemUser');
  });

  it('TC_14. Create user with empty username field - shows error', () => {
    cy.visit('/web/index.php/admin/viewSystemUsers');
    cy.wait(1000);
    cy.get('button').filter(':contains("Add")').click({ force: true });
    cy.wait(1500);
    cy.get('input[type="password"]').eq(0).type('TestPass@123', { delay: 50 });
    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('be.visible');
  });

  it('TC_15. Verify password field masks input', () => {
    cy.visit('/web/index.php/admin/viewSystemUsers');
    cy.wait(1000);
    cy.get('button').filter(':contains("Add")').click({ force: true });
    cy.wait(1500);
    cy.get('input[type="password"]', { timeout: 10000 }).should('have.attr', 'type', 'password');
  });

  afterEach(() => {
    cy.get('.oxd-userdropdown-tab', { timeout: 10000 }).click({ force: true });
    cy.get('a[href="/web/index.php/auth/logout"]', { timeout: 10000 }).click({ force: true });
    cy.wait(1000);
  });
});
