/**
 * mergeReports.js
 * Merges all individual module reports into ONE comprehensive unified report file
 * Combines JSON reports and generates a detailed unified HTML report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper function to escape HTML entities
const escapeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Helper function to format duration as Minutes and Seconds
const formatDuration = (durationMs) => {
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} Minute${minutes !== 1 ? 's' : ''} ${seconds} Second${seconds !== 1 ? 's' : ''}`;
};

const reportsDir = path.join(__dirname, 'cypress/reports/mochawesome-report');
const mergedReportPath = path.join(reportsDir, 'OrangeHRM_CypressAutomationDemo.json');
const mergedHtmlPath = path.join(reportsDir, 'OrangeHRM_CypressAutomationDemo.html');

console.log('\n📋 Starting comprehensive report merge process...\n');

// Find all individual report files (exclude unified reports)
const files = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('.json') && !f.includes('unified') && !f.includes('result'))
  .sort();

console.log(`Found ${files.length} report file(s) to merge:`, files);

if (files.length === 0) {
  console.log('⚠ No report files found!');
  process.exit(1);
}

let allStats = {
  tests: 0,
  passes: 0,
  failures: 0,
  pending: 0,
  skipped: 0,
  duration: 0
};
let allTests = [];
let suites = [];
let firstStart = null;
let lastEnd = null;

// Process each report file
files.forEach((file, idx) => {
  const filePath = path.join(reportsDir, file);
  const moduleName = file.replace('.json', '');
  
  try {
    const reportContent = fs.readFileSync(filePath, 'utf8');
    const report = JSON.parse(reportContent);
    
    // Aggregate statistics
    if (report.stats) {
      allStats.tests += report.stats.tests || 0;
      allStats.passes += report.stats.passes || 0;
      allStats.failures += report.stats.failures || 0;
      allStats.pending += report.stats.pending || 0;
      allStats.skipped += report.stats.skipped || 0;
      allStats.duration += report.stats.duration || 0;
      
      if (report.stats.start && (!firstStart || report.stats.start < firstStart)) {
        firstStart = report.stats.start;
      }
      if (report.stats.end && (!lastEnd || report.stats.end > lastEnd)) {
        lastEnd = report.stats.end;
      }
    }
    
    // Extract and organize tests
    if (report.tests && Array.isArray(report.tests)) {
      // Mochawesome simple test array format
      report.tests.forEach((test, testIdx) => {
        const enhancedTest = {
          ...test,
          _moduleIndex: idx,
          _moduleName: moduleName,
          _testIndex: testIdx
        };
        allTests.push(enhancedTest);
      });
      
      // Create suite entry
      const suiteStats = {
        title: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
        moduleName: moduleName,
        tests: report.tests.length,
        passes: (report.stats && report.stats.passes) || 0,
        failures: (report.stats && report.stats.failures) || 0,
        pending: (report.stats && report.stats.pending) || 0,
        skipped: (report.stats && report.stats.skipped) || 0,
        duration: (report.stats && report.stats.duration) || 0
      };
      suites.push(suiteStats);
    } else if (report.results && Array.isArray(report.results)) {
      // Mochawesome results format with suites
      report.results.forEach((result) => {
        if (result.suites && Array.isArray(result.suites)) {
          result.suites.forEach((suite) => {
            if (suite.tests && Array.isArray(suite.tests)) {
              suite.tests.forEach((test, testIdx) => {
                const enhancedTest = {
                  ...test,
                  _moduleIndex: idx,
                  _moduleName: moduleName,
                  _suiteName: suite.title,
                  _testIndex: testIdx
                };
                allTests.push(enhancedTest);
              });
            }
          });
        }
      });
    }
    
    const passRate = report.stats && report.stats.tests > 0 
      ? ((report.stats.passes / report.stats.tests) * 100).toFixed(1) 
      : 0;
    
    console.log(`  ✓ ${moduleName.padEnd(20)} - ${report.stats?.tests || 0} tests (${passRate}% pass)`);
  } catch (error) {
    console.error(`  ✗ Error reading ${file}:`, error.message);
  }
});

allStats.start = firstStart || new Date().toISOString();
allStats.end = lastEnd || new Date().toISOString();
allStats.pending = allStats.pending || 0;

// Create unified JSON report with tests sorted by TC number (TC_01 onwards)
// Function to extract TC number from test title
const extractTCNumber = (title) => {
  const match = title.match(/TC_(\d+)/);
  return match ? parseInt(match[1], 10) : Infinity;
};

// Sort tests by TC number
const sortedTests = allTests.slice().sort((a, b) => {
  return extractTCNumber(a.title) - extractTCNumber(b.title);
});

const unified = {
  stats: allStats,
  suites: suites,
  tests: sortedTests,
  '@timestamp': new Date().toISOString(),
  '@generatedBy': 'Cypress Automation Framework - Report Merger'
};

fs.writeFileSync(mergedReportPath, JSON.stringify(unified, null, 2));
console.log(`\n✓ Unified JSON report created: ${path.basename(mergedReportPath)} (${sortedTests.length} tests sorted by TC number)`);

// Generate comprehensive unified HTML report
const passPercentage = allStats.tests > 0 ? ((allStats.passes / allStats.tests) * 100).toFixed(2) : 0;
const failurePercentage = allStats.tests > 0 ? ((allStats.failures / allStats.tests) * 100).toFixed(2) : 0;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OrangeHRM Cypress Automation Execution Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
      color: #333;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.8em;
      margin-bottom: 10px;
      font-weight: 300;
      letter-spacing: 2px;
    }
    
    .header p {
      font-size: 1em;
      opacity: 0.95;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      padding: 35px 30px;
      background: #f8f9fa;
    }
    
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 8px;
      border-left: 5px solid #667eea;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
      text-align: center;
      transition: transform 0.2s;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-card.passed {
      border-left-color: #10b981;
    }
    
    .stat-card.failed {
      border-left-color: #ef4444;
    }
    
    .stat-card.skipped {
      border-left-color: #f59e0b;
    }
    
    .stat-card.duration {
      border-left-color: #3b82f6;
    }
    
    .stat-value {
      font-size: 3em;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }
    
    .stat-card.passed .stat-value {
      color: #10b981;
    }
    
    .stat-card.failed .stat-value {
      color: #ef4444;
    }
    
    .stat-card.skipped .stat-value {
      color: #f59e0b;
    }
    
    .stat-card.duration .stat-value {
      color: #3b82f6;
    }
    
    .stat-label {
      font-size: 0.95em;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .progress-section {
      margin-top: 20px;
    }
    
    .progress-bar {
      width: 100%;
      height: 10px;
      background: #e5e7eb;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      width: ${passPercentage}%;
      transition: width 0.3s ease;
    }
    
    .progress-text {
      font-size: 0.9em;
      color: #666;
      text-align: center;
    }
    
    .tests-section {
      padding: 35px 30px;
    }
    
    .tests-section h2 {
      font-size: 1.8em;
      margin-bottom: 25px;
      color: #333;
      border-bottom: 3px solid #667eea;
      padding-bottom: 15px;
    }
    
    .test-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-left: 5px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
      gap: 15px;
      transition: border-color 0.2s;
    }
    
    .test-item:hover {
      border-left-color: #667eea;
    }
    
    .test-item.passed {
      border-left-color: #10b981;
      background: #f0fdf4;
    }
    
    .test-item.failed {
      border-left-color: #ef4444;
      background: #fef2f2;
    }
    
    .test-status {
      font-size: 2em;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .test-status.passed {
      color: #10b981;
      background: #dcfce7;
    }
    
    .test-status.failed {
      color: #ef4444;
      background: #fee2e2;
    }
    
    .test-status.pending {
      color: #f59e0b;
      background: #fef3c7;
    }
    
    .test-details {
      flex: 1;
    }
    
    .test-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      word-break: break-word;
      font-size: 1.05em;
    }
    
    .test-suite {
      font-size: 0.9em;
      color: #666;
      background: #f3f4f6;
      padding: 4px 10px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 8px;
    }
    
    .test-meta {
      font-size: 0.9em;
      color: #999;
    }
    
    .test-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-left: 4px solid #ef4444;
      padding: 12px;
      border-radius: 4px;
      margin-top: 10px;
      font-size: 0.9em;
      color: #b91c1c;
      font-family: 'Courier New', monospace;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
    
    .footer {
      background: #f8f9fa;
      padding: 25px 30px;
      text-align: center;
      color: #666;
      font-size: 0.95em;
      border-top: 1px solid #e5e7eb;
    }
    
    .timestamp {
      color: #999;
      font-size: 0.9em;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 30px;
      color: #999;
    }
    
    .filter-controls {
      margin-bottom: 25px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .filter-btn {
      padding: 8px 15px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
      transition: all 0.2s;
    }
    
    .filter-btn:hover {
      background: #f3f4f6;
    }
    
    .filter-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 OrangeHRM Cypress Automation Execution Report</h1>
      <p>Complete Test Suite Execution - All Modules Combined</p>
    </div>
    
    <div class="summary">
      <div class="stat-card">
        <div class="stat-value">${allStats.tests}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      
      <div class="stat-card passed">
        <div class="stat-value">${allStats.passes}</div>
        <div class="stat-label">Passed</div>
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-text"><strong>${passPercentage}%</strong> Success</div>
        </div>
      </div>
      
      <div class="stat-card failed">
        <div class="stat-value">${allStats.failures}</div>
        <div class="stat-label">Failed</div>
      </div>
      
      <div class="stat-card skipped">
        <div class="stat-value">${allStats.skipped}</div>
        <div class="stat-label">Skipped</div>
      </div>
      
      <div class="stat-card duration">
        <div class="stat-value">${formatDuration(allStats.duration)}</div>
        <div class="stat-label">Total Duration</div>
      </div>
    </div>
    
    <div class="tests-section">
      <h2>📊 Test Results - ${allTests.length} Total Tests</h2>
      ${allTests.length > 0 ? `
        <div class="filter-controls">
          <button class="filter-btn active" onclick="filterTests('all')">All Tests (${allStats.tests})</button>
          <button class="filter-btn" onclick="filterTests('passed')">✓ Passed (${allStats.passes})</button>
          <button class="filter-btn" onclick="filterTests('failed')">✗ Failed (${allStats.failures})</button>
          ${allStats.pending > 0 ? `<button class="filter-btn" onclick="filterTests('pending')">⊗ Pending (${allStats.pending})</button>` : ''}
          ${allStats.skipped > 0 ? `<button class="filter-btn" onclick="filterTests('skipped')">⊗ Skipped (${allStats.skipped})</button>` : ''}
        </div>
      ` : ''}
      
      ${suites.length > 0 ? `
        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="margin-bottom: 15px; color: #333;">📋 Module Summary</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            ${suites.map(suite => `
              <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid ${suite.failures > 0 ? '#ef4444' : '#10b981'};">
                <div style="font-weight: 600; color: #333; margin-bottom: 8px;">
                  ${suite.failures > 0 ? '✗' : '✓'} ${suite.title}
                </div>
                <div style="font-size: 0.9em; color: #666;">
                  <div>Tests: <strong>${suite.tests}</strong></div>
                  <div>Passed: <strong style="color: #10b981;">${suite.passes}</strong></div>
                  <div>Failed: <strong style="color: #ef4444;">${suite.failures}</strong></div>
                  <div>Duration: <strong>${(suite.duration / 1000).toFixed(2)}s</strong></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div id="tests-container">
        ${sortedTests.length > 0 ? sortedTests.map((test) => `
          <div class="test-item ${test.state}" data-state="${test.state}">
            <div class="test-status ${test.state}">
              ${test.state === 'passed' ? '✓' : test.state === 'failed' ? '✗' : test.state === 'pending' ? '◆' : '○'}
            </div>
            <div class="test-details">
              <div class="test-suite">${test._moduleName ? test._moduleName.toUpperCase() : 'Test Suite'} ${test._suiteName ? '/ ' + test._suiteName : ''}</div>
              <div class="test-title">${escapeHtml(test.title)}</div>
              <div class="test-meta">⏱ Duration: ${(test.duration || 0)}ms | State: ${test.state}</div>
              ${test.err && test.err.message ? `<div class="test-error"><strong>Error:</strong> ${escapeHtml(test.err.message.substring(0, 500))}</div>` : ''}
              ${test.state === 'failed' && test.screenshot ? `<div class="test-screenshot"><img src="${test.screenshot}" alt="Failed Test Screenshot" style="max-width: 100%; height: auto; border: 1px solid #ddd; margin-top: 10px;" /></div>` : ''}
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <p>No test results available</p>
          </div>
        `}
      </div>
    </div>
    
    <div class="footer">
      <div>
        <strong>🧪 Cypress Automation Framework v1.0 - Complete Execution Report</strong>
      </div>
      <p>All ${allStats.tests} tests from ${files.length} module(s) executed and merged</p>
      <p>Generated on <span class="timestamp">${new Date().toLocaleString()}</span></p>
      <p style="font-size: 0.85em; margin-top: 10px; color: #999;">Report File: execution-report.html & execution-report.json</p>
    </div>
  </div>
  
  <script>
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    function filterTests(state) {
      const container = document.getElementById('tests-container');
      const items = container.querySelectorAll('.test-item');
      let visibleCount = 0;
      
      items.forEach(item => {
        if (state === 'all' || item.dataset.state === state) {
          item.style.display = 'flex';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      // Update container title
      const title = document.querySelector('.tests-section h2');
      if (title) {
        const stateLabel = state === 'all' ? 'Total' : state.charAt(0).toUpperCase() + state.slice(1);
        title.textContent = \`📊 Test Results - \${visibleCount} \${stateLabel} Tests\`;
      }
    }
    
    // Initialize state
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Report loaded with ${allStats.tests} total tests');
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(mergedHtmlPath, htmlContent);
console.log(`✓ Unified HTML report created: ${path.basename(mergedHtmlPath)}`);

// Optional: Clean up individual module reports to keep only the unified report
// Uncomment the lines below if you want to remove individual reports
console.log('\n🧹 Cleaning up individual module reports...');
files.forEach(file => {
  const jsonPath = path.join(reportsDir, file);
  const htmlPath = path.join(reportsDir, file.replace('.json', '.html'));
  try {
    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
      console.log(`  ✓ Removed: ${file}`);
    }
    if (fs.existsSync(htmlPath)) {
      fs.unlinkSync(htmlPath);
      console.log(`  ✓ Removed: ${file.replace('.json', '.html')}`);
    }
  } catch (e) {
    // Silently skip if file cannot be removed
  }
});

console.log('\n' + '='.repeat(70));
console.log('✅ UNIFIED REPORT MERGE COMPLETE!');
console.log('='.repeat(70));

console.log(`\n📊 Test Summary:`);
console.log(`   ├─ Total Tests:     ${allStats.tests}`);
console.log(`   ├─ Passed:          ${allStats.passes} ✓`);
console.log(`   ├─ Failed:          ${allStats.failures} ✗`);
console.log(`   ├─ Pending:         ${allStats.pending} ◆`);
console.log(`   ├─ Skipped:         ${allStats.skipped} ⊗`);
console.log(`   ├─ Pass Rate:       ${passPercentage}%`);
console.log(`   └─ Total Duration:  ${formatDuration(allStats.duration)}`);

console.log(`\n📁 Module Statistics:`);
suites.forEach(suite => {
  const passRate = suite.tests > 0 ? ((suite.passes / suite.tests) * 100).toFixed(0) : 0;
  const status = suite.failures === 0 ? '✓' : '✗';
  console.log(`   ${status} ${suite.title.padEnd(20)} - ${suite.tests} tests (${passRate}% pass)`);
});

console.log(`\n📄 Generated Reports:`);
console.log(`   ✓ Execution JSON: ${mergedReportPath}`);
console.log(`   ✓ Execution HTML: ${mergedHtmlPath}`);

console.log(`\n💡 Tip: Open the execution HTML report in your browser to view results`);
console.log('='.repeat(70) + '\n');
