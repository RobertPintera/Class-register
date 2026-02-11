describe('Main pages', () => {
  beforeEach(() => {
    cy.visit("#/main/dashboard");
  });

  const links = ["dashboard", "grades", "tests", "students", "settings"];

  links.forEach((link) => {
    it(`navigates to ${link} page`, () => {
      cy.get('[data-cy="sidebar-toggle"]').then($btn => {
        if ($btn.attr('aria-expanded') === 'false') {
          cy.wrap($btn).click();
        }
      });

      cy.get(`[data-cy="sidebar-${link}"]`).click();
      cy.url().should("include", `#/main/${link}`);
      cy.get("h1, h2").should("be.visible");
    });
  }); 
});