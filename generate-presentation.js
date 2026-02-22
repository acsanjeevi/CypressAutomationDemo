#!/usr/bin/env node
/**
 * Generate Concise 10-Slide PowerPoint Presentation
 * Essential content only - no excessive details
 */

const PptxGenJS = require("pptxgenjs");
const prs = new PptxGenJS();

const colors = {
  primary: "667EEA",
  secondary: "764BA2",
  accent: "F093FB",
  dark: "1A202C",
  success: "48BB78",
  text: "2D3748",
  textLight: "718096"
};

function addTitleSlide(prs, title, subtitle, date) {
  const slide = prs.addSlide();
  slide.background = { color: colors.primary };
  
  slide.addShape({
    type: "rect",
    x: 0, y: 0, w: "100%", h: 1.5,
    fill: { color: colors.secondary },
    line: { type: "none" }
  });
  
  slide.addShape({
    type: "rect",
    x: 0, y: 6, w: "100%", h: 1.5,
    fill: { color: colors.accent },
    line: { type: "none" }
  });
  
  slide.addText(title, {
    x: 0.5, y: 2, w: 9, h: 1.5,
    fontSize: 54, bold: true, color: "FFFFFF",
    align: "center", fontFace: "Segoe UI"
  });
  
  slide.addText(subtitle, {
    x: 0.5, y: 3.8, w: 9, h: 1,
    fontSize: 32, color: "FFFFFF",
    align: "center", fontFace: "Segoe UI"
  });
  
  slide.addText(date, {
    x: 0.5, y: 6.3, w: 9, h: 0.5,
    fontSize: 18, color: colors.dark,
    align: "center", fontFace: "Segoe UI"
  });
}

function addSlide(prs, title, content) {
  const slide = prs.addSlide();
  
  slide.addShape({
    type: "rect",
    x: 0, y: 0, w: "100%", h: 1,
    fill: { color: colors.primary },
    line: { type: "none" }
  });
  
  slide.addText(title, {
    x: 0.5, y: 0.15, w: 9, h: 0.7,
    fontSize: 40, bold: true, color: "FFFFFF",
    fontFace: "Segoe UI"
  });
  
  let yPos = 1.3;
  content.forEach((item) => {
    slide.addText("• " + item, {
      x: 0.8, y: yPos, w: 8.9,
      fontSize: 18, color: colors.text,
      fontFace: "Segoe UI"
    });
    yPos += 0.6;
  });
}

function addTwoColumnSlide(prs, title, left, leftItems, right, rightItems) {
  const slide = prs.addSlide();
  
  slide.addShape({
    type: "rect",
    x: 0, y: 0, w: "100%", h: 0.9,
    fill: { color: colors.primary },
    line: { type: "none" }
  });
  
  slide.addText(title, {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 40, bold: true, color: "FFFFFF",
    fontFace: "Segoe UI"
  });
  
  slide.addText(left, {
    x: 0.4, y: 1.1, w: 4.5, h: 0.4,
    fontSize: 20, bold: true, color: colors.primary,
    fontFace: "Segoe UI"
  });
  
  let yPos = 1.6;
  leftItems.forEach((item) => {
    slide.addText("• " + item, {
      x: 0.5, y: yPos, w: 4.3,
      fontSize: 16, color: colors.text,
      fontFace: "Segoe UI"
    });
    yPos += 0.5;
  });
  
  slide.addText(right, {
    x: 5.1, y: 1.1, w: 4.5, h: 0.4,
    fontSize: 20, bold: true, color: colors.secondary,
    fontFace: "Segoe UI"
  });
  
  yPos = 1.6;
  rightItems.forEach((item) => {
    slide.addText("• " + item, {
      x: 5.2, y: yPos, w: 4.3,
      fontSize: 16, color: colors.text,
      fontFace: "Segoe UI"
    });
    yPos += 0.5;
  });
}

// ===== SLIDE 1: TITLE =====
addTitleSlide(prs, "🔬 Cypress Automation Framework", "OrangeHRM Test Automation Suite", "Professional Overview | 2026");

// ===== SLIDE 2: EXECUTIVE SUMMARY =====
addSlide(prs, "Executive Summary", [
  "30 automated test cases across 6 modules",
  "Built with Cypress 13.6 + TypeScript",
  "Page Object Model (POM) architecture",
  "Mochawesome reporting with screenshots",
  "Automated data cleanup & management",
  "CI/CD ready for production deployment"
]);

// ===== SLIDE 3: TECHNOLOGY STACK & ARCHITECTURE =====
addTwoColumnSlide(prs, "Tech Stack & Architecture",
  "Technology Stack",
  ["Cypress 13.6.2 - Test automation", "TypeScript 5.3.3 - Type safety", "Mochawesome 7.1.4 - Reporting", "Node.js 24.11.1 - Runtime"],
  "Architecture Layers",
  ["E2E Tests (6 modules, 30 tests)", "Page Objects & Business Functions", "Cypress Framework & Selectors", "OrangeHRM Application (Target)"]
);

// ===== SLIDE 4: PROJECT STRUCTURE =====
addSlide(prs, "Project Structure", [
  "cypress/e2e/ - 6 Test Modules (30 tests total)",
  "cypress/pageObjects/ - 6 Page Object Models",
  "cypress/businessFunction/ - 5 Command Classes",
  "cypress/fixtures/ - Test Data & Selectors",
  "cypress/support/ - Utilities & Helpers",
  "cypress/reports/ - Mochawesome Reports"
]);

// ===== SLIDE 5: TEST MODULES & NAMING =====
addSlide(prs, "Test Modules & Naming Convention", [
  "TC_01-TC_05: Login Module (Authentication)",
  "TC_06-TC_10: Employee Module (PIM Management)",
  "TC_11-TC_15: User Module (Admin Management)",
  "TC_16-TC_20: Leave Module (Leave Requests)",
  "TC_21-TC_25: Claim Module (Expense Claims)",
  "TC_26-TC_30: Cleanup Module (Data Cleanup - Runs LAST)"
]);

// ===== SLIDE 6: PAGE OBJECT MODEL =====
addSlide(prs, "Page Object Model (POM) Design", [
  "Centralized DOM selectors in page objects",
  "Reusable methods for UI interactions",
  "Easy maintenance when UI changes",
  "Tests read like business scenarios",
  "Example: LoginPage handles all login interactions",
  "6 Page Objects: Login, Dashboard, PIM, Admin, Leave, Claim"
]);

// ===== SLIDE 7: TEST EXECUTION FLOW =====
addTwoColumnSlide(prs, "Test Execution Lifecycle",
  "Setup Phase (beforeEach)",
  ["Load test data fixtures", "Navigate to login page", "Enter admin credentials", "Wait for dashboard load"],
  "Execution & Teardown",
  ["Execute test logic", "Validate expected behavior", "Save test data for cleanup", "Logout after each test"]
);

// ===== SLIDE 8: RUNNING TESTS & REPORTING =====
addTwoColumnSlide(prs, "Test Execution Modes & Reporting",
  "Execution Modes",
  ["npm run test:headless (CI/CD)", "npm run test:headed (Development)", "npm run test:chrome/firefox/edge", "Execution time: 8-10 minutes"],
  "Reporting Pipeline",
  ["Individual test reports generated", "Merged into unified report", "Mochawesome HTML generated", "Screenshots embedded for failed tests"]
);

// ===== SLIDE 9: DATA MANAGEMENT & CLEANUP =====
addSlide(prs, "Test Data Management & Cleanup", [
  "Four-layer approach: Fixtures → Credentials → Selectors → Persistence",
  "Tests create data (employees, users, leaves, claims)",
  "Created data saved to test-data/JSON files",
  "Cleanup module reads saved IDs",
  "Cleanup deletes all created records via UI",
  "Database returns to clean state for next run"
]);

// ===== SLIDE 10: CI/CD READY & BEST PRACTICES =====
addSlide(prs, "CI/CD Ready & Best Practices", [
  "Single command: npm run test:headless",
  "Deterministic execution order",
  "Comprehensive error reporting",
  "Professional Mochawesome reports",
  "Ready for Jenkins, GitHub Actions, GitLab CI, Azure DevOps",
  "Type-safe with TypeScript + POM + Centralized selectors"
]);

// Save presentation
const outputPath = "d:\\CypressAutomationDemo_Presentation.pptx";
prs.writeFile({ fileName: outputPath });
console.log(`\n✅ Concise 10-slide presentation created: ${outputPath}`);
