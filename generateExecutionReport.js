/**
 * generateExecutionReport.js
 * Generates a clean, single-page unified HTML execution report
 * from Cypress test results
 */

const fs = require('fs');
const path = require('path');

function generateExecutionReport() {
  const reportsDir = path.join(__dirname, 'cypress/reports/mochawesome-report');
  const outputPath = path.join(__dirname, 'cypress/reports/EXECUTION_REPORT.html');

  // Find the unified-report.json file
  let reportData = null;
  const files = fs.readdirSync(reportsDir);
  const jsonFile = files.find(f => f.startsWith('unified-report') && f.endsWith('.json'));

  if (!jsonFile) {
    console.log('⚠ No report data found. Generating empty report...');
    reportData = { stats: { tests: 0, passes: 0, failures: 0, skipped: 0, duration: 0 }, tests: [] };
  } else {
    try {
      const jsonPath = path.join(reportsDir, jsonFile);
      reportData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {
      console.error('Error reading report:', e);
      reportData = { stats: { tests: 0, passes: 0, failures: 0, skipped: 0, duration: 0 }, tests: [] };
    }
  }

  const stats = reportData.stats || { tests: 0, passes: 0, failures: 0, skipped: 0, duration: 0 };
  const tests = reportData.tests || [];
  const passPercentage = stats.tests > 0 ? ((stats.passes / stats.tests) * 100).toFixed(2) : 0;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cypress Execution Report</title>
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
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 300;
      letter-spacing: 2px;
    }
    
    .header p {
      font-size: 0.95em;
      opacity: 0.9;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 30px;
      background: #f8f9fa;
    }
    
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      text-align: center;
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
      font-size: 2.5em;
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
      font-size: 0.9em;
      color: #666;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 15px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      width: ${passPercentage}%;
      transition: width 0.3s ease;
    }
    
    .progress-text {
      font-size: 0.85em;
      color: #666;
      margin-top: 5px;
      text-align: center;
    }
    
    .tests-section {
      padding: 30px;
    }
    
    .tests-section h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
      color: #333;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    
    .test-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
      gap: 15px;
    }
    
    .test-status {
      font-size: 1.5em;
      flex-shrink: 0;
    }
    
    .test-status.pass {
      color: #10b981;
    }
    
    .test-status.fail {
      color: #ef4444;
    }
    
    .test-status.pending {
      color: #f59e0b;
    }
    
    .test-details {
      flex: 1;
    }
    
    .test-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
      word-break: break-word;
    }
    
    .test-suite {
      font-size: 0.85em;
      color: #666;
      background: #f3f4f6;
      padding: 3px 8px;
      border-radius: 3px;
      display: inline-block;
      margin-bottom: 8px;
    }
    
    .test-duration {
      font-size: 0.85em;
      color: #999;
    }
    
    .test-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
      font-size: 0.85em;
      color: #b91c1c;
      font-family: 'Courier New', monospace;
      max-height: 150px;
      overflow-y: auto;
    }
    
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
      border-top: 1px solid #e5e7eb;
    }
    
    .timestamp {
      color: #999;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    
    .empty-state p {
      font-size: 1.1em;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 Cypress Execution Report</h1>
      <p>Automated Test Execution Summary</p>
    </div>
    
    <div class="summary">
      <div class="stat-card">
        <div class="stat-value">${stats.tests || 0}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      
      <div class="stat-card passed">
        <div class="stat-value">${stats.passes || 0}</div>
        <div class="stat-label">Passed</div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-text">${passPercentage}% Success Rate</div>
      </div>
      
      <div class="stat-card failed">
        <div class="stat-value">${stats.failures || 0}</div>
        <div class="stat-label">Failed</div>
      </div>
      
      <div class="stat-card skipped">
        <div class="stat-value">${stats.skipped || 0}</div>
        <div class="stat-label">Skipped</div>
      </div>
      
      <div class="stat-card duration">
        <div class="stat-value">${(stats.duration / 1000).toFixed(1)}s</div>
        <div class="stat-label">Duration</div>
      </div>
    </div>
    
    <div class="tests-section">
      <h2>Test Results</h2>
      ${tests.length > 0 ? tests.map(test => `
        <div class="test-item">
          <div class="test-status ${test.state}">
            ${test.state === 'passed' ? '✓' : test.state === 'failed' ? '✗' : '○'}
          </div>
          <div class="test-details">
            <div class="test-suite">${test.fullTitle.split(' ').slice(0, -1).join(' ')}</div>
            <div class="test-title">${test.title}</div>
            <div class="test-duration">${(test.duration || 0)}ms</div>
            ${test.err && test.err.message ? `<div class="test-error">${test.err.message.substring(0, 200)}</div>` : ''}
          </div>
        </div>
      `).join('') : `
        <div class="empty-state">
          <p>No test results available</p>
        </div>
      `}
    </div>
    
    <div class="footer">
      <p>Generated on <span class="timestamp">${new Date().toLocaleString()}</span></p>
      <p>Cypress Automation Framework v1.0</p>
    </div>
  </div>
</body>
</html>
  `;

  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✓ Execution report generated: ${outputPath}`);
}

generateExecutionReport();
