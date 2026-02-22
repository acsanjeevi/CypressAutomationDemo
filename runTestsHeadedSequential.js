/**
 * runTestsHeadedSequential.js
 * Runs all test files one by one in headed mode and generates a unified report
 * Each test runs sequentially to allow visual inspection of application execution
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define test files to run
const testFiles = [
  'cypress/e2e/login.cy.ts',
  'cypress/e2e/employee.cy.ts',
  'cypress/e2e/user.cy.ts',
  'cypress/e2e/leave.cy.ts',
  'cypress/e2e/claim.cy.ts',
  'cypress/e2e/cleanup.cy.ts'  // Cleanup must run last
];

const reportsDir = path.join(__dirname, 'cypress/reports/mochawesome-report');
const scriptsDir = path.join(__dirname, 'scripts');

// Clean up reports directory
function cleanupReports() {
  console.log('\n📋 Cleaning up old reports...');
  
  if (fs.existsSync(reportsDir)) {
    try {
      fs.rmSync(reportsDir, { recursive: true, force: true });
      console.log('✓ Old reports cleaned');
    } catch (e) {
      console.error('Error cleaning reports:', e.message);
    }
  }
  
  // Create fresh reports directory
  fs.mkdirSync(reportsDir, { recursive: true });
  console.log('✓ Ready for new reports');
}

// Run a single test file in headed mode
function runTestFile(testFile, index, total) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`▶ [${index}/${total}] Running: ${testFile}`);
  console.log(`${'='.repeat(80)}\n`);
  
  // Extract module name from test file
  const moduleName = testFile.split('/').pop().replace('.cy.ts', '');
  
  // Set report directory to use unique filename for each test
  const env = {
    ...process.env,
    CYPRESS_REPORT_DIR: reportsDir,
    CYPRESS_REPORT_NAME: moduleName
  };
  
  const command = `cypress run --spec "${testFile}" --browser chrome --headed`;
  
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: __dirname,
      env: env
    });
    console.log(`\n✓ ${testFile} completed successfully`);
    
    // Rename the report file to include module name
    const reportFile = path.join(reportsDir, 'unified-report.json');
    const renamedFile = path.join(reportsDir, `${moduleName}-report.json`);
    const reportHtml = path.join(reportsDir, 'unified-report.html');
    const renamedHtml = path.join(reportsDir, `${moduleName}-report.html`);
    
    if (fs.existsSync(reportFile)) {
      fs.renameSync(reportFile, renamedFile);
    }
    if (fs.existsSync(reportHtml)) {
      fs.renameSync(reportHtml, renamedHtml);
    }
    
    return true;
  } catch (error) {
    console.log(`\n⚠ ${testFile} had some test failures (continuing with next test...)`);
    
    // Still rename the report files if tests failed
    const reportFile = path.join(reportsDir, 'unified-report.json');
    const renamedFile = path.join(reportsDir, `${moduleName}-report.json`);
    const reportHtml = path.join(reportsDir, 'unified-report.html');
    const renamedHtml = path.join(reportsDir, `${moduleName}-report.html`);
    
    if (fs.existsSync(reportFile)) {
      fs.renameSync(reportFile, renamedFile);
    }
    if (fs.existsSync(reportHtml)) {
      fs.renameSync(reportHtml, renamedHtml);
    }
    
    return false;
  }
}

// Copy merge-reports script if it doesn't exist
function ensureMergeScript() {
  const sourceScript = path.join(__dirname, 'mergeReports.js');
  const targetScript = path.join(scriptsDir, 'merge-reports.js');
  
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
  
  // If merge-reports.js doesn't exist in scripts, create a symlink or copy
  if (!fs.existsSync(targetScript) && fs.existsSync(sourceScript)) {
    fs.copyFileSync(sourceScript, targetScript);
    console.log('✓ Merge script prepared');
  }
}

// Generate merged report
function generateMergedReport() {
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 Generating Merged Report');
  console.log(`${'='.repeat(80)}\n`);
  
  try {
    // Find all individual report JSON files  
    const reportFiles = fs.readdirSync(reportsDir)
      .filter(f => f.endsWith('-report.json') && f !== 'unified-report.json');
    
    if (reportFiles.length === 0) {
      console.log('⚠ No individual reports found to merge');
      return false;
    }
    
    console.log(`Found ${reportFiles.length} individual report(s) to merge`);
    
    // Run merge reports
    console.log('\nMerging individual test reports...');
    execSync('node scripts/merge-reports.js --check-reports', {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('\n✓ Merged report generated successfully');
    
    // Print report location - the merge script already created the HTML
    const reportPath = path.join(reportsDir, 'execution-report.html');
    if (fs.existsSync(reportPath)) {
      console.log(`\n📄 Unified Report available at: ${reportPath}`);
    }
    
    return true;
  } catch (error) {
    console.error('\n❌ Error generating merged report:', error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('\n🚀 Starting Cypress Tests in Headed Mode - Sequential Execution');
  console.log(`📅 Started at: ${new Date().toLocaleString()}\n`);
  
  // Cleanup old reports
  cleanupReports();
  
  // Ensure merge script exists
  ensureMergeScript();
  
  // Run each test file sequentially
  let passedTests = 0;
  let failedTests = 0;
  const results = [];
  
  console.log(`\n📝 Queue: ${testFiles.length} test files to execute\n`);
  
  testFiles.forEach((testFile, index) => {
    const success = runTestFile(testFile, index + 1, testFiles.length);
    results.push({ file: testFile, success });
    
    if (success) {
      passedTests++;
    } else {
      failedTests++;
    }
    
    // Small pause between tests
    if (index < testFiles.length - 1) {
      console.log('\n⏳ Preparing next test...\n');
    }
  });
  
  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 Test Execution Summary');
  console.log(`${'='.repeat(80)}`);
  results.forEach(result => {
    const status = result.success ? '✓' : '⚠';
    console.log(`${status} ${result.file}`);
  });
  console.log(`\nTotal: ${testFiles.length} | Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log(`${'='.repeat(80)}\n`);
  
  // Generate merged report
  const reportSuccess = generateMergedReport();
  
  // Final summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('🎯 Test Run Complete');
  console.log(`📅 Ended at: ${new Date().toLocaleString()}`);
  console.log(`${'='.repeat(80)}\n`);
  
  if (reportSuccess) {
    console.log('✅ All tests executed and report generated successfully!');
    console.log(`\n📄 Open the unified report: cypress/reports/mochawesome-report/unified-report.html\n`);
  }
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run main function
main();
