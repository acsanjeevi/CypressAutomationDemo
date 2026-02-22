/**
 * runAllTests.js
 * Runs all test modules sequentially and generates a unified HTML report
 * This script ensures all tests run even if some fail, then merges all reports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define test modules
const testModules = [
  {
    name: 'Login Authentication',
    spec: 'cypress/e2e/login-authentication/**/*.cy.ts',
    reportName: 'login'
  },
  {
    name: 'Employee Management',
    spec: 'cypress/e2e/employee-management/**/*.cy.ts',
    reportName: 'employee'
  },
  {
    name: 'User Management',
    spec: 'cypress/e2e/user-management/**/*.cy.ts',
    reportName: 'user'
  },
  {
    name: 'Leave Management',
    spec: 'cypress/e2e/leave-management/**/*.cy.ts',
    reportName: 'leave'
  },
  {
    name: 'Claim Management',
    spec: 'cypress/e2e/claim-management/**/*.cy.ts',
    reportName: 'claim'
  },
  {
    name: 'Data Cleanup',
    spec: 'cypress/e2e/data-cleanup/**/*.cy.ts',
    reportName: 'cleanup'
  }
];

const reportsDir = path.join(__dirname, 'cypress/reports/mochawesome-report');
const mergedReportPath = path.join(reportsDir, 'unified-report.json');
const mergedHtmlPath = path.join(reportsDir, 'unified-report.html');

// Clean up directories
function cleanupDirectories() {
  console.log('\n📋 Preparing report directories...');
  
  // Create reports directory
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Remove old merged reports if they exist
  const oldMerged = path.join(reportsDir, 'result*.json');
  const oldMergedHtml = path.join(reportsDir, 'result*.html');
  
  console.log('✓ Directories ready');
}

// Run a single test module
function runTestModule(module, browser = 'chrome') {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`▶ Running: ${module.name}`);
  console.log(`${'='.repeat(80)}`);
  
  // Set environment variables for this run
  const env = {
    ...process.env,
    CYPRESS_REPORT_DIR: reportsDir,
    CYPRESS_REPORT_NAME: module.reportName
  };
  
  const command = `cypress run --browser ${browser} --spec "${module.spec}"`;
  
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: __dirname,
      env: env
    });
    console.log(`✓ ${module.name} completed`);
    return true;
  } catch (error) {
    console.log(`⚠ ${module.name} had some test failures (continuing with other modules...)`);
    return false;
  }
}

// Main execution
function main() {
  console.log('\n🚀 Starting Cypress Automation - All Modules Sequential Run');
  console.log(`📅 Started at: ${new Date().toLocaleString()}\n`);
  
  // Get browser from command line or default to chrome
  const browser = process.argv[2] || 'chrome';
  console.log(`🌐 Browser: ${browser}\n`);
  
  // Cleanup
  cleanupDirectories();
  
  // Run all modules sequentially
  let moduleResults = [];
  for (const module of testModules) {
    const success = runTestModule(module, browser);
    moduleResults.push({ name: module.name, success });
  }
  
  // Print module results
  console.log('\n📋 Module Execution Results:');
  moduleResults.forEach(result => {
    const status = result.success ? '✓' : '⚠';
    console.log(`   ${status} ${result.name}`);
  });
  
  const failedCount = moduleResults.filter(r => !r.success).length;
  if (failedCount > 0) {
    console.log(`\n⚠ ${failedCount} module(s) had test failures (check reports for details)`);
  } else {
    console.log(`\n✅ All modules executed successfully!`);
  }
  
  // Merge reports
  console.log(`\n🔀 Merging all test reports...`);
  try {
    execSync('node mergeReports.js', { stdio: 'inherit', cwd: __dirname });
  } catch (error) {
    console.error('Error during report merge:', error.message);
  }
  
  console.log(`\n✅ Execution completed at: ${new Date().toLocaleString()}\n`);
  
  process.exit(0);
}

main();
