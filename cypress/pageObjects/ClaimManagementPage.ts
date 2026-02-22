import selectors from '../fixtures/selectors.json';

interface ClaimRequest {
  eventType: string;
  claimType: string;
  amount: number;
  remarks?: string;
}

class ClaimManagementPage {
  clickSubmitClaim(): void {
    cy.contains('button', 'Submit Claim', { timeout: 10000 }).click();
    cy.log('✓ Submit Claim button clicked');
    cy.wait(1000);
  }

  selectEventType(eventType: string): void {
    cy.get(selectors.claim.eventTypeDropdown).first().click();
    cy.contains(eventType).click();
    cy.log(`✓ Event type selected: ${eventType}`);
    cy.wait(500);
  }

  selectClaimType(claimType: string): void {
    cy.get(selectors.claim.claimTypeDropdown).eq(1).click();
    cy.contains(claimType).click();
    cy.log(`✓ Claim type selected: ${claimType}`);
    cy.wait(500);
  }

  fillClaimRequest(claim: ClaimRequest): void {
    this.selectEventType(claim.eventType);
    this.selectClaimType(claim.claimType);

    cy.get(selectors.claim.amountInput).clear().type(claim.amount.toString(), { delay: 100 });
    cy.log(`✓ Amount entered: ${claim.amount}`);

    if (claim.remarks) {
      cy.get(selectors.claim.remarksTextarea).clear().type(claim.remarks, { delay: 100 });
      cy.log(`✓ Remarks entered: ${claim.remarks}`);
    }

    cy.wait(500);
  }

  submitClaim(): void {
    cy.get(selectors.claim.saveButton).click();
    cy.log('✓ Claim submitted');
    cy.get(selectors.claim.successNotification, { timeout: 20000 }).should('be.visible');
    cy.log('✓ Claim submitted successfully');
    cy.wait(1000);
  }
}

export default new ClaimManagementPage();
