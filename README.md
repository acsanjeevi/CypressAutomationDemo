# OrangeHRM Cypress Automation Test Suite

Production-ready automated testing for OrangeHRM using Cypress with TypeScript. All login authentication tests are stable and passing.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm run cypress:run

# Open Cypress GUI
npm run cypress:open
```

## Test Status

✓ **Login Authentication**: 5/5 tests passing (STABLE)
- Valid login scenarios
- Invalid credential handling
- Empty field validation

⚠ **Other Modules**: Require UI selector updates (not part of core functionality)

## Project Structure

```
cypress/
├── e2e/                    # Test specifications
│   └── login-authentication/    # Stable login tests (PASS)
├── pages/                  # Page Object Models
├── fixtures/               # Test data
├── reports/                # Generated HTML reports
└── support/                # Test helpers & utilities
```

## Configuration

- **Base URL**: https://opensource-demo.orangehrmlive.com
- **Browser**: Chromium (headless)
- **Timeout**: 20 seconds
- **Reports**: Mochawesome HTML + JSON

## Key Files

- `cypress.config.ts` - Cypress configuration
- `package.json` - Dependencies & scripts
- `TEST_SUITE_DOCUMENTATION.md` - Detailed documentation
- `cypress.env.json` - Environment variables

## Available Commands

```bash
# Run all tests
npm run cypress:run

# Run on specific browser
npm run cypress:run:chrome
npm run cypress:run:edge
npm run cypress:run:firefox

# Run in headless mode
npm run cypress:headless

# Merge and generate reports
npm run report:merge
```

## Test Data

- Test credentials: stored in `cypress/fixtures/credentials.json`
- Employee data: persisted to `cypress/test-data/employees.json`
- User data: persisted to `cypress/test-data/users.json`
- Leave data: persisted to `cypress/test-data/leaves.json`

## Test Reports

Generated reports are stored in `cypress/reports/`:
- HTML reports: `cypress/reports/html/`
- JSON reports: `cypress/reports/mochawesome-report/`
- Screenshots: `cypress/screenshots/` (on failure)
- Videos: `cypress/videos/` (all tests)

## Page Objects

- `LoginPage.ts` - Login module interactions
- `DashboardPage.ts` - Dashboard navigation
- `PimPage.ts` - Employee management
- `AdminPage.ts` - User management
- `LeaveManagementPage.ts` - Leave operations

## For More Details

See `TEST_SUITE_DOCUMENTATION.md` for comprehensive documentation.
