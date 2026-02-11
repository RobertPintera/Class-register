describe('Home Page', () => {
  it('displays the main header', () => {
    cy.visit('/');
    cy.contains("h1", "Class register").should("be.visible");
  });

  it('navigates to dashboard after clicking start button', () => {
    cy.visit('/');
    cy.get('[data-cy="start-button"]').click();
    cy.url().should("include", "/main/dashboard");
  });
});