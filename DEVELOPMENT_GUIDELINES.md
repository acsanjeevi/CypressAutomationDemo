# Cypress Automation - Development Guidelines

## Core Principles

**NEVER:** Create unnecessary document files  
**NEVER:** Modify methods/functions unless required for bug fix or feature  
**ALWAYS:** Keep interfaces, classes, functions simple & user-friendly  
**ALWAYS:** Minimize comments - code should be self-explanatory  
**ALWAYS:** Follow Cypress best practices  

---

## 1. Code Changes Policy

### When to Make Changes
✅ Bug fixes - existing functionality broken  
✅ Feature implementation - new test case added  
✅ Type safety improvements - TypeScript errors  
✅ Performance optimization - proven bottleneck  

### When NOT to Make Changes
❌ Code refactoring without impact  
❌ Comment additions beyond necessity  
❌ Renaming for cosmetic reasons  
❌ Creating wrapper methods that don't add value  

---

## 2. File Management Policy

### Allowed File Types
✅ `.ts` - TypeScript source code  
✅ `.json` - Configuration files (cypress, fixtures, test data)  
✅ `.html` - Test reports (auto-generated)  
✅ `.js` - Build/automation scripts  

### Never Create
❌ `.md` files for documentation (except SETUP_FIXES.md, EXECUTION_FIXED.md - existing)  
❌ Multiple documentation files  
❌ Helper/utility files without direct test usage  
❌ Redundant configuration files  

### Document-Only Changes
- Edit existing: `DEVELOPMENT_GUIDELINES.md` (this file)
- Do NOT create: Additional guides or reference docs

---

## 3. Interface Guidelines

### Design Principle
Keep interfaces minimal & focused - only required properties

```typescript
// ✅ GOOD: Clear purpose, minimal properties
export interface Employee {
  firstName: string;
  lastName: string;
  middleName?: string;
}

// ❌ BAD: Too many properties or unnecessary fields
export interface EmployeeExtended {
  firstName: string;
  lastName: string;
  middleName?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  // ... many more fields
}
```

---

## 4. Class Guidelines

### Command Classes
**Purpose:** Reusable business logic for tests  
**Location:** `cypress/business-function/[module]/commands.ts`

```typescript
export class LoginCommands {
  private usernameField = 'input[name="username"]';
  private passwordField = 'input[name="password"]';
  private loginButton = 'button[type="submit"]';

  // Core methods only - no extras
  login(username: string, password: string): void {
    cy.get(this.usernameField).type(username);
    cy.get(this.passwordField).type(password);
    cy.get(this.loginButton).click();
  }

  verifyDashboardDisplayed(): void {
    cy.url().should('include', '/dashboard');
  }
}
```

### Page Object Classes
**Purpose:** UI element selectors & basic navigation  
**Location:** `cypress/pages/[PageName].ts`

```typescript
export class DashboardPage {
  static navigateToPim(): void {
    cy.contains('PIM').click();
  }

  static navigateToAdmin(): void {
    cy.contains('Admin').click();
  }
}
```

---

## 5. Function Guidelines

### Naming Convention
- `add[Entity]` - Create new  
- `delete[Entity]` - Remove  
- `search[Entity]` - Find  
- `verify[State]` - Assertion  

### Return Types
```typescript
// ✅ GOOD: Clear return type
applyLeave(leaveRequest: LeaveRequest): Cypress.Chainable<any>

// ✅ GOOD: No return for void operations
deleteEmployee(): void

// ❌ BAD: Unclear or missing types
applyLeave(leaveRequest: LeaveRequest): any
```

### Method Length
- **Ideal:** 5-15 lines  
- **Maximum:** 20 lines  
- If longer → Break into smaller methods

---

## 6. Comment Guidelines

### When to Comment
✅ Complex logic - `// Find employee by matching partial name`  
✅ Why, not what - `// Wait for API response before assertion`  
✅ Edge cases - `// Handles null/undefined employee data`  

### Never Comment
❌ Obvious code - `// Clear the input field` (code: `.clear()`)  
❌ Every line - Wastes space and time  
❌ Note: Single line method needs no comment  

---

## 7. Test File Guidelines

### Structure
```typescript
describe('Module Name', () => {
  before(() => { /* setup */ });
  
  it('TC_001: Description', () => {
    // Arrange - Setup data
    // Act - Perform action
    // Assert - Verify result
  });
});
```

### Test Naming
- Format: `TC_[NUMBER]: [Description]`
- Example: `TC_001: Validate user login with valid credentials`
- No duplication of describe + test title

### Assertion Best Practices
```typescript
// ✅ GOOD: Specific assertion
cy.get('.success-message').should('be.visible');

// ❌ BAD: Too vague
cy.get('body').should('exist');
```

---

## 8. Cypress Best Practices

### DO ✅
- Use page objects for selectors
- Use business function commands
- Chain Cypress commands
- Use explicit waits when needed
- Test user actions, not implementation

### DON'T ❌
- Hard-code selectors in tests
- Use `cy.wait(5000)` - use smart waits
- Skip tests - delete or fix them
- Test multiple scenarios in one test
- Rely on test order/sequence

### Selector Priority
1. Data attributes: `[data-testid="login"]`
2. Input placeholders: `input[placeholder="Username"]`
3. Button text: `button:contains("Login")`
4. ARIA labels: `[aria-label="Submit"]`
5. CSS classes/IDs: Last resort

---

## 9. TypeScript Guidelines

### Strict Types
```typescript
// ✅ GOOD: Explicit types
login(username: string, password: string): void

// ❌ BAD: Using any
login(username: any, password: any): void
```

### Optional Properties
```typescript
// ✅ Use optional marker
interface Employee {
  firstName: string;
  lastName: string;
  middleName?: string;
}

// ❌ Don't pass undefined
interface Employee {
  firstName: string;
  lastName: string;
  middleName: string | undefined;
}
```

---

## 10. Code Review Checklist

Before committing changes:

- [ ] No unnecessary files created
- [ ] Methods only modified if needed
- [ ] TypeScript errors resolved
- [ ] Comments minimal & meaningful
- [ ] Interfaces simple & focused
- [ ] Classes follow pattern (Command/Page)
- [ ] Functions have clear names
- [ ] No hard-coded selectors
- [ ] Tests follow structure
- [ ] Cypress best practices followed

---

## 11. Maintenance Guidelines

### Updating Selectors
When UI changes and selector breaks:
```typescript
// Before
private loginButton = 'button[type="submit"]';

// After (if needed)
private loginButton = 'button:contains("Sign In")';
```

### Adding New Test
1. Create in appropriate `e2e/[module]/` folder
2. Use existing command classes
3. Follow naming: `TC_[NUM]: Description`
4. No duplicate setup code

### Fixing Flaky Tests
1. Identify root cause (timing, selector, data)
2. Add smart wait if timing issue
3. Improve selector if not found message
4. Update test data if data dependent

---

## 12. Module Standards

### Each Module Must Have
✅ Test file in `cypress/e2e/[module]/`  
✅ Business commands in `cypress/business-function/[module]/`  
✅ Page object if needed  
✅ Test fixtures/data if needed  

### Module Structure
```
cypress/
├── e2e/[module-name]/
│   └── [module-name].cy.ts
├── business-function/[module-name]/
│   └── commands.ts
└── pages/
    └── [ModuleName]Page.ts (if needed)
```

---

## 13. Reporting Standards

### Report Requirements
✅ Single unified HTML report  
✅ All modules in one file  
✅ Pass/Fail statistics  
✅ Individual test details  
✅ Readable formatting  

### Never
❌ Multiple separate reports  
❌ Missing test information  
❌ Broken formatting  

---

## 14. Execution Standards

### Test Execution Order
1. Login Authentication
2. Employee Management
3. User Management
4. Leave Management
5. Claim Management
6. Data Cleanup

### Command
```bash
npm run test
```

### Report Location
```
cypress/reports/mochawesome-report/unified-report.html
```

---

## 15. Common Patterns

### Pattern: Adding New Test Case
```typescript
// 1. Create in e2e/[module]/[module].cy.ts
it('TC_XXX: Description', () => {
  const testData = {
    firstName: `Test_${Date.now()}`,
    lastName: 'User'
  };
  
  loginCommands.login(adminUsername, adminPassword);
  loginCommands.verifyDashboardDisplayed();
  
  employeeCommands.addEmployee(testData);
  employeeCommands.verifySuccessNotification();
});

// 2. Use business-function commands (don't add selectors in test)
// 3. Keep test focused on one scenario
// 4. Use valid test data
```

### Pattern: Adding New Command
```typescript
// 1. Add to cypress/business-function/[module]/commands.ts
export class EmployeeCommands {
  private addButton = 'button:contains("Add")';
  
  clickAddEmployee(): void {
    cy.get(this.addButton).click();
  }
}

// 2. Keep method focused
// 3. Use private selectors
// 4. Return Cypress.Chainable if chainable
// 5. Use meaningful names
```

---

## 16. Error Handling

### TypeScript Errors
- Use proper types (`string`, `boolean`, not `any`)
- Use optional with `?` for nullable values
- Use `Cypress.Chainable<T>` for chain-able methods

### Test Failures
- Don't skip tests
- Fix root cause
- Update selectors if UI changed
- Update data if data changed

### Report Issues
- Ensure mochawesome installed
- Check report directory permissions
- Verify all tests ran successfully

---

## 17. Performance Guidelines

### Avoid
❌ Unnecessary `cy.wait(fixed time)`  
❌ Multiple searches for same element  
❌ Repeated setup in each test  
❌ Large fixture files  

### Implement
✅ Smart waits: `.should('be.visible')`  
✅ Command reuse from business functions  
✅ Shared setup in `before()` if applicable  
✅ Lean test data  

---

## 18. Final Checklist

Before running tests:
```
Code Quality
[ ] No unused variables
[ ] No console logs left
[ ] Selectors are smart/reliable
[ ] Types are explicit
[ ] Comments are minimal
[ ] Methods are focused
[ ] Interfaces are simple

Tests
[ ] All test cases have TC_XXX format
[ ] Tests are independent
[ ] Setup/teardown correct
[ ] Data is unique (timestamps)
[ ] Assertions are specific

Execution
[ ] npm run test works
[ ] Unified report generates
[ ] All modules included
[ ] Report is readable
[ ] No TypeScript errors
```

---

## Rules Summary

| Rule | Impact |
|------|--------|
| No unnecessary docs | Keep codebase clean |
| No impact changes | Focus development effort |
| Simple interfaces | Easier to use & maintain |
| Minimal comments | Code speaks for itself |
| User-friendly code | Team productivity |
| Cypress best practices | Stable reliable tests |

---

**Remember:** *Every change must have purpose. Every line must have value.*

**Status:** Active - Reference this before any code change  
**Last Updated:** February 13, 2026
