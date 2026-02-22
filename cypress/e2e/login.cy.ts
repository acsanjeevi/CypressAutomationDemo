describe('Login', () => {
  beforeEach(() => {
    cy.fixture('credentials').then((creds) => {
      cy.wrap(creds).as('credentials');
    });
  });

  it('TC_01. Login with valid admin credentials', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin', { delay: 50 });
    cy.get('input[name="password"]').type('admin123', { delay: 50 });
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-topbar-header-breadcrumb h6', { timeout: 20000 }).should('be.visible');
    cy.get('.oxd-userdropdown-tab').click();
    cy.get('a[href="/web/index.php/auth/logout"]').click();
  });

  it('TC_02. Verify login page loaded with all fields', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('TC_03. Login with empty username - shows error', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="password"]').type('admin123', { delay: 50 });
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('be.visible');
  });

  it('TC_04. Login with invalid password - shows error', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin', { delay: 50 });
    cy.get('input[name="password"]').type('wrongpassword', { delay: 50 });
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-field--error input, .oxd-alert, .oxd-input-error', { timeout: 10000 }).should('exist');
  });

  it('TC_05. Login redirects to dashboard', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin', { delay: 50 });
    cy.get('input[name="password"]').type('admin123', { delay: 50 });
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-userdropdown-tab').click();
    cy.get('a[href="/web/index.php/auth/logout"]').click();
  });
});
