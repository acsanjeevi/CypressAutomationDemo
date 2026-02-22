/**
 * merge-reports.js (Wrapper)
 * Delegates to the main mergeReports.js for comprehensive report merging
 * This ensures consistency across all report generation
 */

const { execSync } = require('child_process');
const path = require('path');

try {
  const mergeReportsPath = path.join(__dirname, '../mergeReports.js');
  execSync(`node "${mergeReportsPath}"`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  process.exit(0);
} catch (error) {
  console.error('❌ Report merge failed:', error.message);
  process.exit(1);
}
