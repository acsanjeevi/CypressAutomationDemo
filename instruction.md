# CYPRESS AUTOMATION FRAMEWORK - STRICT REQUIREMENTS & GUIDELINES

**Last Updated:** February 16, 2026  
**Status:** ⚠️ PRODUCTION - ALL CHANGES MUST FOLLOW THESE RULES  
**Total Test Cases:** 30 (5 per module × 6 modules)

---

## 📊 TEST CASES SUMMARY

| Module | Tests | Purpose | Status |
|--------|-------|---------|--------|
| Login | 5 | Authentication & security | ✅ Active |
| Employee | 5 | Employee management | ✅ Active |
| User | 5 | User/Admin management | ✅ Active |
| Leave | 5 | Leave management | ✅ Active |
| Claim | 5 | Claim management | ✅ Active |
| Cleanup | 5 | Data cleanup & wipeout | ✅ Active |
| **TOTAL** | **30** | **Comprehensive suite** | ✅ Production |

---

## 📁 STRICT PROJECT STRUCTURE (DO NOT MODIFY)

```
cypress/
├── e2e/                          ⚠️ EXACTLY 6 FILES - NO MORE, NO LESS
│   ├── login.cy.ts              (5 tests: TC_01-TC_05)
│   ├── employee.cy.ts           (5 tests: TC_06-TC_10)
│   ├── user.cy.ts               (5 tests: TC_11-TC_15)
│   ├── leave.cy.ts              (5 tests: TC_16-TC_20)
│   ├── claim.cy.ts              (5 tests: TC_21-TC_25)
│   └── cleanup.cy.ts            (5 tests: TC_26-TC_30 - data wipeout - RUNS LAST)
│
├── fixtures/
│   ├── credentials.json         (Admin credentials)
│   ├── testdata.json            (Test data for all modules)
│   └── selectors.json           (DOM selectors - NO HARDCODING)
│
├── pageObjects/                  (Page Object Models)
├── businessFunction/             (Reusable commands)
└── support/                      (Helpers & setup)
```

---

## ✅ MANDATORY REQUIREMENTS

### 1. SPEC FILE NAMING (STRICT)

```
✅ CORRECT:
  - login.cy.ts
  - employee.cy.ts
  - user.cy.ts
  - leave.cy.ts
  - claim.cy.ts
  - cleanup.cy.ts (MUST RUN LAST)

❌ FORBIDDEN:
  - 1-login.cy.ts         (NO numeric prefixes)
  - login2.cy.ts          (NO duplicates)
  - login-auth.cy.ts      (NO alternate names)
  - login/ (folder)       (NO subdirectories)
  - complete-workflow.cy.ts (NO extra files besides 6)
```

### 2. TEST CASE NAMING (MANDATORY TC_## FORMAT)

**CRITICAL: All 30 tests across 6 modules MUST use TC_## prefix with SEQUENTIAL numbering (TC_01 through TC_30)**

Test case naming MUST follow this pattern ACROSS ALL MODULES in execution order:

- **Login module:** TC_01 through TC_05
- **Employee module:** TC_06 through TC_10
- **User module:** TC_11 through TC_15
- **Leave module:** TC_16 through TC_20
- **Claim module:** TC_21 through TC_25
- **Cleanup module:** TC_26 through TC_30

**Module Execution Order (Sequential):**
1. Login (TC_01 - TC_05) → Authentication tests
2. Employee (TC_06 - TC_10) → Employee management tests
3. User (TC_11 - TC_15) → User/Admin tests
4. Leave (TC_16 - TC_20) → Leave management tests
5. Claim (TC_21 - TC_25) → Claim management tests
6. Cleanup (TC_26 - TC_30) → Data cleanup/wipeout (MUST RUN LAST)

```typescript
// CORRECT FORMAT - All tests follow TC_XX pattern:
it('TC_01. Login with valid credentials', () => { ... });
it('TC_02. Login with invalid username', () => { ... });
it('TC_03. Login with empty password', () => { ... });
it('TC_04. Verify error messages are displayed', () => { ... });
it('TC_05. Verify dashboard loads after login', () => { ... });

// Next module continues the sequence:
it('TC_06. Create new employee', () => { ... });
it('TC_07. Verify employee ID auto-generated', () => { ... });
// ... and so on through TC_30
```

**IMPORTANT:**
- Each test has a unique TC_## number across ALL 30 tests (never repeat TC_01-TC_05 in another module)
- Numbers are SEQUENTIAL and never skip (TC_01, TC_02, TC_03, ... TC_29, TC_30)
- Each TC_## is tied to module execution order (Login first, Cleanup last)
- This naming convention MUST be maintained for all future test additions
- TC_## format enables clear test identification in reports and debugging

### 3. TEST STRUCTURE (ENFORCED - 5 TESTS PER MODULE)

```typescript
describe('ModuleName', () => {
  let testdata: any;

  // ALWAYS REQUIRED
  beforeEach(() => {
    cy.fixture('testdata').then((data) => { testdata = data; });
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type(Cypress.env('username'), { delay: 50 });
    cy.get('input[name="password"]').type(Cypress.env('password'), { delay: 50 });
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-topbar-header-breadcrumb h6', { timeout: 20000 }).should('be.visible');
  });

  // EXACTLY 5 test cases per module with TC_## naming
  // Login module example (TC_01-TC_05):
  it('TC_01. Test description', () => { /* test code */ });
  it('TC_02. Test description', () => { /* test code */ });
  it('TC_03. Test description', () => { /* test code */ });
  it('TC_04. Test description', () => { /* test code */ });
  it('TC_05. Test description', () => { /* test code */ });

  // ALWAYS REQUIRED - LOGOUT IS CRITICAL
  afterEach(() => {
    cy.get('.oxd-userdropdown-tab', { timeout: 10000 }).click();
    cy.get('a[href="/web/index.php/auth/logout"]', { timeout: 10000 }).click();
  });
});
```

---

## 🚀 DO's (STRICTLY FOLLOW)

- ✅ Keep EXACTLY 6 spec files (login, employee, user, leave, claim, cleanup)
- ✅ Each module has EXACTLY 5 tests (30 total tests, NOT 150)
- ✅ Use TC_## naming format (TC_01 through TC_30) with sequential numbering across all modules
- ✅ Test numbering follows module order: Login (TC_01-05), Employee (TC_06-10), User (TC_11-15), Leave (TC_16-20), Claim (TC_21-25), Cleanup (TC_26-30)
- ✅ Cleanup module MUST run LAST (after all functional tests)
- ✅ Add beforeEach/afterEach hooks to every spec
- ✅ Logout in afterEach (CRITICAL for cleanup)
- ✅ Use fixtures for selectors and test data
- ✅ Use delays: 50ms for typing, 1000ms for waits
- ✅ Use timeouts: 20000ms for page loads, 10000ms for forms
- ✅ Run tests with `npm run test:headed` (includes cleanup)
- ✅ Generate merged reports after execution
- ✅ Verify cleanup successfully deleted all test data
- ✅ Always review failed tests immediately

---

## ❌ DON'Ts (STRICTLY FORBIDDEN)

- ❌ Create numeric prefix files (1-login.cy.ts, 2-employee.cy.ts)
- ❌ Create subdirectories in e2e/ (login-auth/, claim-management/)
- ❌ Create extra test files beyond 6
- ❌ Add more than 5 tests per module (strictly 5 tests, NOT 25)
- ❌ Deviate from TC_## naming format or sequential numbering (TC_01-TC_30)
- ❌ Repeat TC numbers across modules (e.g., don't have TC_01-05 in multiple modules)
- ❌ Use numeric-only naming (e.g., "1. Test") - MUST use TC_## format
- ❌ Run tests without cleanup at the end
- ❌ Skip cleanup module during execution
- ❌ Use cy.log() in tests
- ❌ Hardcode selectors in test files
- ❌ Forget logout in afterEach
- ❌ Use short timeouts (< 10000ms) for critical elements
- ❌ Leave test data in the system (cleanup MUST succeed)
- ❌ Skip report generation
- ❌ Rename or delete the 6 main spec files

---

## 🎯 TEST EXECUTION COMMANDS

### Run All Tests in Headed Mode (Recommended)

```bash
npm run test:headed
```

**Output:**
```
✓ Executes all 30 tests (6 specs × 5 tests each)
✓ Visible browser with application execution
✓ Final module (cleanup) deletes all created records
✓ Generates individual JSON reports
✓ Merges all reports into unified JSON
✓ Generates single HTML report: execution-report.html
✓ Total time: ~8-12 minutes
```

### Run All Tests with Cleanup (Headless)

```bash
npm run test:all:cleanup
```

### Run Cleanup Only

```bash
npm run test:cleanup
```

### Run Specific Module

```bash
npm test -- --spec "cypress/e2e/login.cy.ts"
```

### Run All Except Cleanup (No Data Wipeout)

```bash
npm test
```

---

## 📊 EXPECTED TEST RESULTS

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LOGIN              5/5 passing   ✅ (TC_01-TC_05)
  EMPLOYEE           5/5 passing   ✅ (TC_06-TC_10)
  USER               5/5 passing   ✅ (TC_11-TC_15)
  LEAVE              5/5 passing   ✅ (TC_16-TC_20)
  CLAIM              5/5 passing   ✅ (TC_21-TC_25)
  CLEANUP            5/5 passing   ✅ (TC_26-TC_30 - Final wipeout)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOTAL              30/30 passing ✅
  PASS RATE          100%
  DURATION           ~8-12 min
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📄 REPORT LOCATION

After execution, open:

```
cypress/reports/mochawesome-report/execution-report.html
```

Shows:
- ✅ All 150 test results (6 modules × 25 tests each)
- ✅ Pass/fail breakdown by module
- ✅ Execution time per test
- ✅ Screenshots on failures
- ✅ Cleanup status (final wipeout confirmation)
- ✅ Data cleanup verification

---

## ⚠️ CRITICAL CHECKLIST (BEFORE ANY CHANGES)

- [ ] Exactly 6 spec files exist (login, employee, user, leave, claim, cleanup)
- [ ] Each file has exactly 5 tests (NOT 25 - total 30 tests)
- [ ] All tests use TC_## naming format (TC_01 through TC_30)
- [ ] TC numbers are sequential across all modules (no repeats, no skips)
- [ ] Test numbering follows module order: Login (TC_01-05), Employee (TC_06-10), User (TC_11-15), Leave (TC_16-20), Claim (TC_21-25), Cleanup (TC_26-30)
- [ ] cleanup.cy.ts runs LAST (after all other modules)
- [ ] Each spec has beforeEach hook
- [ ] Each spec has afterEach hook with logout
- [ ] Cleanup module deletes all created records
- [ ] No hardcoded selectors in test code
- [ ] No cy.log() statements
- [ ] All critical timeouts ≥ 20000ms
- [ ] fixtures/credentials.json exists
- [ ] fixtures/testdata.json exists
- [ ] fixtures/selectors.json exists
- [ ] No subdirectories in e2e/
- [ ] No numeric prefix files
- [ ] No extra files beyond 6 specs
- [ ] Tests run without errors
- [ ] Report merges successfully
- [ ] Cleanup verification passes

---

## 🔧 FIXTURE FILES (MUST EXIST AND BE VALID)

### cypress/fixtures/credentials.json
```json
{
  "admin": {
    "username": "Admin",
    "password": "admin123"
  }
}
```

### cypress/fixtures/testdata.json
```json
{
  "employee": {
    "firstName": "AutoTest",
    "middleName": "Cypress",
    "lastName": "Employee"
  },
  "user": {
    "Employee": "AutoTest Cypress Employee",
    "role": "Admin",
    "status": "Enabled",
    "username": "automationuser",
    "password": "UserPass@123"
  },
  "leave": {
    "leaveType": "Annual",
    "fromDate": "2026-03-15",
    "toDate": "2026-03-20",
    "reason": "Planned vacation leave"
  },
  "claim": {
    "eventType": "Business Training",
    "claimType": "Travel",
    "amount": 500,
    "remarks": "Test claim submission"
  }
}
```

---

## 📋 FRAMEWORK RULES

1. **One file, one module**
   - login.cy.ts → Login tests only
   - employee.cy.ts → Employee tests only

2. **No test interdependencies**
   - Each test must be independent
   - Tests can run in any order
   - Tests can be run individually

3. **Data cleanup is critical**
   - Logout in every afterEach
   - No test data left behind
   - Session always terminated

4. **Timeouts are essential**
   - Page loads: 20000ms
   - Form fields: 10000ms
   - Selects: 1500ms
   - Waits: 1000ms minimum

5. **Reports are mandatory**
   - Always generate merged reports
   - Always review results
   - Save reports for audit

---

## ✅ CURRENT STATUS

✅ All 6 modules have exactly 5 tests each  
✅ Total 30 test cases (functional tests + cleanup)  
✅ All tests follow TC_## naming format (TC_01 through TC_30)  
✅ Sequential numbering enforced across all modules (Login TC_01-05, Employee TC_06-10, User TC_11-15, Leave TC_16-20, Claim TC_21-25, Cleanup TC_26-30)  
✅ All tests have proper hooks  
✅ Cleanup module deletes all created records  
✅ No numeric prefix files  
✅ No subdirectories in e2e/  
✅ All fixtures exist and valid  
✅ Framework production-ready  
✅ Report generation automated  
✅ Data cleanup automated  
✅ Stability verified  

**Status:** PRODUCTION READY ✅

This document is the SINGLE SOURCE OF TRUTH.
All changes MUST follow these rules.
- Maximum 5 tests per module (30 total, NOT more)
- TC_## naming with sequential numbering (TC_01 to TC_30)
- Cleanup MUST execute at the end.
- Violations will break the framework.
