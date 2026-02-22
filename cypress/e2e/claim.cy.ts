describe('Claim', () => {
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

  it('TC_21. Navigate to Dashboard', () => {
    cy.visit('/web/index.php/dashboard/index');
    cy.wait(1000);
    cy.url().should('include', '/dashboard/');
  });

  it('TC_22. Verify Claim module accessible and list loads', () => {
    cy.visit('/web/index.php/claim/viewClaim');
    cy.wait(1000);
    cy.url().should('include', '/claim/');
    cy.get('.oxd-table-body').should('be.visible');
  });

  it('TC_23. Navigate to Submit Claim form', () => {
    cy.visit('/web/index.php/claim/viewClaim');
    cy.wait(1000);
    cy.get('button').filter(':contains("Submit")').click({ force: true });
    cy.wait(1500);
    cy.url().should('include', '/claim/');
  });

  it('TC_24. Verify claim form has required fields', () => {
    cy.visit('/web/index.php/claim/viewClaim');
    cy.wait(1000);
    cy.get('button').filter(':contains("Submit")').click({ force: true });
    cy.wait(1500);
    cy.get('.oxd-select-wrapper').should('have.length.greaterThan', 0);
  });

  it('TC_25. Verify claim form cancel button', () => {
    cy.visit('/web/index.php/claim/viewClaim');
    cy.wait(1000);
    cy.get('button').filter(':contains("Submit")').click({ force: true });
    cy.wait(1500);
    cy.get('button').filter(':contains("Cancel")').should('be.visible').and('be.enabled');
  });

  afterEach(() => {
    cy.get('.oxd-userdropdown-tab', { timeout: 10000 }).click({ force: true });
    cy.get('a[href="/web/index.php/auth/logout"]', { timeout: 10000 }).click({ force: true });
    cy.wait(1000);
  });
});
