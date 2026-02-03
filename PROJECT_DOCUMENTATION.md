# Cypress OrangeHRM Automation - Consolidated Test Suite

## Project Overview

This is a comprehensive Cypress automation framework for testing OrangeHRM application. The project has been reorganized and enhanced with improved structure, leave management workflows, and unified reporting.

## ✨ Recent Improvements

### 1. **Duplicate Test Removal**
- Removed duplicate test folders: `02-pim/` and `03-admin/`
- Consolidated all tests into main folders: `pim/`, `admin/`, `login/`, `cleanup/`, `leave/`
- Cleaner, more maintainable folder structure

### 2. **Leave Management Workflow**
New leave management tests have been added that fully integrate with the employee/user creation workflow:

- **TC_008**: Apply leave for created employee
  - Automatically uses previously created employee data
  - Calculates appropriate leave dates (5 business days from now)
  - Stores leave data for cleanup tracking

- **TC_009**: Cancel applied leave
  - Searches for previously applied leaves
  - Cancels leave requests for cleanup
  - Verifies successful cancellation

### 3. **Enhanced Cleanup Module**
The cleanup module now performs comprehensive cleanup in reverse order:

- **TC_010**: Verify all test data
  - Documents all created records (employees, users, leaves)
  - Provides detailed cleanup summary

- **TC_011**: Cancel all leave requests
  - Asynchronously reads and cancels applied leaves
  - Handles errors gracefully

- **TC_012**: Delete all user accounts
  - Removes created test users
  - Maintains data integrity

- **TC_013**: Delete all employee records
  - Removes created test employees
  - Final cleanup step

### 4. **Unified HTML Report Template**
New `generateUnifiedReport.js` creates a professional consolidated report:

- **Single HTML page** with all test results
- **Visual statistics cards** showing pass/fail rates
- **Chart.js visualizations** for test metrics
- **Grouped test results** by suite name
- **Professional styling** matching individual test reports
- **Command**: `npm run report:unified`

### 5. **Code Refactoring for Readability**
All test files have been refactored with:

- **Comprehensive JSDoc comments** explaining each step
- **Clear variable names** (e.g., `employeeInformation`, `leaveRequestInformation`)
- **ARRANGE-ACT-ASSERT pattern** for test structure
- **Detailed logging** at each step
- **Type safety** with interfaces (Employee, UserDetails, LeaveRequest)

## 📁 Project Structure

```
cypress-automation-demo/
├── cypress/
│   ├── e2e/
│   │   ├── login/                 # Login authentication tests
│   │   │   └── login.cy.ts
│   │   ├── pim/                   # Employee management tests
│   │   │   └── employee.cy.ts
│   │   ├── admin/                 # User management tests
│   │   │   └── user.cy.ts
│   │   ├── leave/                 # Leave management tests (NEW)
│   │   │   └── leave-management.cy.ts
│   │   └── cleanup/               # Data cleanup tests
│   │       └── cleanup.cy.ts
│   ├── pages/
│   │   ├── LoginPage.ts           # Login module POM
│   │   ├── DashboardPage.ts       # Dashboard module POM
│   │   ├── PimPage.ts             # PIM module POM
│   │   ├── AdminPage.ts           # Admin module POM
│   │   └── LeaveManagementPage.ts # Leave module POM (NEW)
│   ├── support/
│   │   ├── testDataHelper.ts      # Test data persistence utilities
│   │   ├── cleanupHelper.ts       # Cleanup helper utilities (NEW)
│   │   ├── commands.ts            # Custom Cypress commands
│   │   └── e2e.ts                 # Test setup
│   ├── fixtures/
│   │   ├── credentials.json       # Test credentials
│   │   └── testdata.json          # Test data (includes leave data now)
│   ├── test-data/                 # Runtime test data storage
│   │   ├── employees.json
│   │   ├── users.json
│   │   └── leaves.json            # NEW
│   └── reports/
│       ├── html/
│       │   ├── test-report.html
│       │   └── unified-test-report.html (NEW)
│       └── mochawesome-report/
├── generateReport.js              # Individual report generator
├── generateUnifiedReport.js       # Unified report generator (NEW)
├── cypress.config.ts              # Enhanced config with new tasks
├── package.json                   # Updated with new commands
└── README.md                       # This file
```

## 🚀 Test Execution Workflow

### Test Execution Order (CRITICAL)

Tests must be run in this specific order for proper data flow:

1. **TC_001-TC_005**: Login module tests (authentication validation)
2. **TC_006**: Employee creation (creates data for TC_007, TC_008)
3. **TC_007**: User creation (creates users for leave application)
4. **TC_008**: Apply leave (creates leave data for cleanup)
5. **TC_009**: Cancel leave (removes leave data)
6. **TC_010-TC_013**: Cleanup module (removes all test data)

### Quick Start Commands

```bash
# Run all tests in Chrome browser (recommended)
npm run cypress:run:chrome

# Run all tests in headless mode
npm run test

# Generate unified report after tests
npm run report:unified

# Complete execution with reporting
npm run cypress:full

# Run specific test file
cypress run --spec "cypress/e2e/login/login.cy.ts" --browser chrome

# Open interactive test runner
npm run cypress:open
```

## 📊 Data Flow & Persistence

### Test Data Storage

Test data is persisted to JSON files in `cypress/test-data/` directory:

```javascript
// Employee Data (cypress/test-data/employees.json)
{
  "firstName": "DemoEmployee_12345",
  "middleName": "Test",
  "lastName": "Demo_12345",
  "employeeId": "0001",
  "createdAt": "2026-02-02T10:30:00.000Z"
}

// User Data (cypress/test-data/users.json)
{
  "username": "DemoUser_12345",
  "password": "DemoPass@12345",
  "role": "Admin",
  "employeeName": "DemoEmployee_12345 Demo_12345",
  "status": "Enabled",
  "createdAt": "2026-02-02T10:35:00.000Z"
}

// Leave Data (cypress/test-data/leaves.json)
{
  "employeeName": "DemoEmployee_12345 Demo_12345",
  "employeeId": "0001",
  "leaveType": "Annual",
  "fromDate": "2026-02-05",
  "toDate": "2026-02-09",
  "reason": "Planned vacation leave",
  "status": "Pending Approval",
  "createdAt": "2026-02-02T10:40:00.000Z"
}
```

### Data Dependencies

- **TC_006** (Employee) creates data used by:
  - TC_007 (User needs employee for assignment)
  - TC_008 (Leave needs employee for application)
  - TC_013 (Cleanup deletes the employee)

- **TC_007** (User) creates data used by:
  - TC_012 (Cleanup deletes the user)

- **TC_008** (Leave) creates data used by:
  - TC_009 (Cancel uses leave data)
  - TC_011 (Cleanup cancels the leave)

## 🔧 Page Object Models (POM)

All page interactions are encapsulated in Page Object Models for maintainability:

### LoginPage.ts
```typescript
- enterUsername(username: string)
- enterPassword(password: string)
- clickLoginButton()
- login(username: string, password: string)  // Composite method
```

### DashboardPage.ts
```typescript
- verifyUserIsOnDashboard()
- clickUserMenu()
- logout()
- navigateToPim()
- navigateToAdmin()
- navigateToLeave()  // NEW
- navigateToRecruitment()
```

### PimPage.ts
```typescript
- clickAddEmployee()
- fillFirstName(firstName: string)
- fillMiddleName(middleName: string)
- fillLastName(lastName: string)
- saveEmployee()
- verifyEmployeeSaved()
- getEmployeeId(): Cypress.Chainable<string>
- addEmployee(employee: Employee): Cypress.Chainable<string>  // Composite
- searchEmployeeById(employeeId: string)
- deleteEmployee()
- verifyEmployeeDeleted()
```

### AdminPage.ts
```typescript
- clickAddUser()
- selectRole(role: string)
- enterEmployeeName(employeeName: string)
- selectEmployeeFromDropdown(employeeName: string)
- selectStatus(status: string)
- enterUsername(username: string)
- enterPassword(password: string)
- enterConfirmPassword(password: string)
- saveUser()
- verifyUserSaved()
- addUser(userDetails: UserDetails)  // Composite
- searchUserByUsername(username: string)
- deleteUser()
- verifyUserDeleted()
```

### LeaveManagementPage.ts (NEW)
```typescript
- clickApplyLeave()
- selectLeaveType(leaveType: string)
- fillFromDate(fromDate: string)
- fillToDate(toDate: string)
- fillReason(reason: string)
- saveLeaveRequest()
- verifyLeaveRequestSubmitted()
- applyLeave(leaveRequest: LeaveRequest)  // Composite
- searchLeaveRecord(employeeName: string)
- cancelLeaveRequest()
- verifyLeaveRequestCanceled()
```

## 📝 Test Data Helpers

### testDataHelper.ts Functions

```typescript
// Save operations (persist data)
- saveEmployeeData(employeeData: any)
- saveUserData(userData: any)
- saveLeaveData(leaveData: any)

// Get operations (retrieve data asynchronously)
- getEmployeeData(): any[]
- getUserData(): any[]
- getLeaveData(): any[]

// Clear operations (cleanup)
- clearEmployeeData()
- clearUserData()
- clearLeaveData()
- clearAllTestData()
```

### cleanupHelper.ts Functions (NEW)

For asynchronous data reading in cleanup tests:

```typescript
- readEmployeeTestData(): Cypress.Chainable<any[]>
- readUserTestData(): Cypress.Chainable<any[]>
- readLeaveTestData(): Cypress.Chainable<any[]>
```

## 🎯 Key Features

### Comprehensive Logging
Every test action is logged with clear status indicators:
```
✓ Employee data persisted: DemoEmployee_12345 Demo_12345
✓ User successfully created with username: DemoUser_12345
✓ Leave request successfully submitted for employee: DemoEmployee_12345 Demo_12345
```

### Error Handling
Tests include graceful error handling:
- Skip tests if prerequisite data is missing
- Continue cleanup even if individual deletions fail
- Log warnings for records that may have been already deleted

### Test Isolation
- Each test uses unique identifiers (timestamp-based counters)
- No cross-test contamination
- Tests can be run independently (though recommended order ensures data dependency)

### Detailed Reporting
- Individual test case reports with screenshots on failure
- Unified HTML report consolidating all results
- Chart.js visualizations for metrics
- Suite-based grouping of test results

## 📊 Report Generation

### Individual Reports
Generated automatically by Mochawesome during test execution:
```
cypress/reports/mochawesome-report/
├── mochawesome-pass_[timestamp].html
├── mochawesome-pass_[timestamp].json
├── mochawesome-fail_[timestamp].html
└── mochawesome-fail_[timestamp].json
```

### Unified Report
Generate after tests with:
```bash
npm run report:unified
```

Creates: `cypress/reports/html/unified-test-report.html`

Features:
- Total test count and pass rate
- Statistics cards with metrics
- Doughnut chart: Passed vs Failed vs Pending
- Bar chart: Pass rate percentage
- Detailed test results grouped by suite
- Professional styling with gradients and animations

## 🛠️ Configuration

### cypress.config.ts

Enhanced with additional Cypress tasks:

```typescript
// Task: writeFile
// Persists test data to JSON files asynchronously

// Task: readFile
// Reads test data from JSON files asynchronously

// Task: deleteFile
// Removes individual test data files

// Task: clearDirectory
// Clears entire test-data directory
```

## 📋 Test Case Summary

| Test ID | Module | Description | Status | Data Output |
|---------|--------|-------------|--------|------------|
| TC_001 | Login | Valid admin login | ✓ Core | N/A |
| TC_002 | Login | Invalid username | ✓ Core | N/A |
| TC_003 | Login | Invalid password | ✓ Core | N/A |
| TC_004 | Login | Additional validation | ✓ Core | N/A |
| TC_005 | Login | Additional validation | ✓ Core | N/A |
| TC_006 | PIM | Create employee | ✓ Primary | Employee (ID, name) |
| TC_007 | Admin | Create user | ✓ Primary | User (username, role) |
| TC_008 | Leave | Apply leave | ✓ New | Leave (dates, type) |
| TC_009 | Leave | Cancel leave | ✓ New | (Removed leave) |
| TC_010 | Cleanup | Verify data | ✓ Cleanup | Summary |
| TC_011 | Cleanup | Cancel leaves | ✓ Cleanup | (Removed leaves) |
| TC_012 | Cleanup | Delete users | ✓ Cleanup | (Removed users) |
| TC_013 | Cleanup | Delete employees | ✓ Cleanup | (Removed employees) |

## 🎓 Code Quality Improvements

### Clear Variable Naming
```typescript
// Before
const data = { name: 'Employee', id: '001' };

// After
const employeeInformation = {
  firstName: 'DemoEmployee',
  lastName: 'Demo',
  employeeId: '0001',
  createdAt: new Date().toISOString()
};
```

### Test Structure (ARRANGE-ACT-ASSERT)
```typescript
// ARRANGE: Prepare test data and fixtures
const adminCredentials = this.credentials.admin;
const employeeTestData = this.testdata.employee;

// ACT: Perform the action being tested
LoginPage.login(adminCredentials.username, adminCredentials.password);
DashboardPage.navigateToPim();

// ASSERT: Verify the results
PimPage.addEmployee({...}).then((generatedEmployeeId) => {
  saveEmployeeData(employeeInformation);
});
```

### Comprehensive Comments
Every test includes:
- Purpose and scope
- What's being verified
- Expected results
- Step-by-step comments

## 🚨 Common Issues & Solutions

### Issue: Tests Skip with "No employee data found"
**Solution**: Run tests in correct order. TC_006 must complete before TC_008.

### Issue: Cleanup can't find records
**Solution**: Normal if records don't exist. Cleanup handles this gracefully.

### Issue: Report not generated
**Solution**: Ensure tests completed successfully first: `npm run cypress:run:chrome`

## 📝 Additional Notes

- **Browser Support**: Chrome, Firefox, Edge
- **Base URL**: https://opensource-demo.orangehrmlive.com
- **Timeout**: 20 seconds (configurable)
- **Retry**: Tests support Cypress retry mechanism
- **Screenshots**: Captured on failure automatically
- **Videos**: Recorded for all test runs

## 👤 Author & Maintenance

This automation framework is designed for:
- Easy understanding and maintenance
- Clear code organization
- Comprehensive documentation
- Professional reporting
- Reliable test execution

For questions or improvements, refer to individual test files and Page Object Models.

---

**Last Updated**: February 2, 2026
**Version**: 2.0 (Consolidated with Leave Management & Unified Reports)
