import DashboardPage from '../pageObjects/DashboardPage';
import ClaimManagementPage from '../pageObjects/ClaimManagementPage';

interface ClaimRequest {
  eventType: string;
  claimType: string;
  amount: number;
  remarks?: string;
}

class ClaimCommands {
  submitClaim(claim: ClaimRequest): void {
    DashboardPage.navigateTo('Claim');
    ClaimManagementPage.clickSubmitClaim();
    ClaimManagementPage.fillClaimRequest(claim);
    ClaimManagementPage.submitClaim();
    cy.log('✓ Claim submission workflow completed');
  }
}

export default new ClaimCommands();
