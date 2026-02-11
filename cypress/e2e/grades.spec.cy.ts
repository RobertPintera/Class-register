describe('Grades - dialog', () => {
  beforeEach(() => {
    cy.visit("#/main/settings");
    cy.get('[data-cy="load-demo-data-button"]').click();
    cy.get('[data-cy="confirm-accept-button"]').should('be.visible');
    cy.get('[data-cy="confirm-accept-button"]').click();
    cy.get('.p-toast-message')
      .should('contain', 'Successfully loaded demo data')
      .and('be.visible');

    cy.get('[data-cy="editing-grade-select"]')
      .then(($select) => {
        const currentValue = $select.text().trim();

        if (currentValue !== 'With dialog') {
          cy.wrap($select).click();

          cy.get('[data-cy="editing-grade-option-D"]')
            .contains('With dialog')
            .click();

          cy.get('[data-cy="editing-grade-select"]')
            .should('contain.text', 'With dialog');
        }
      });

    cy.visit("#/main/grades");
  });

  it('adds a new grade', () => {
    cy.get('[data-cy="Jan Kowalski"]')
      .closest('tr')
      .as('janRow');

    cy.get('@janRow')
      .find('td div')
      .contains('-')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('#score input').then(($input) => {
      const max = Number($input.attr('aria-valuemax'));
      const value = max - 1;

      cy.wrap($input)
        .clear({ force: true })
        .type(String(value));

      cy.get('[data-cy="save-button"]').click();

      cy.get('@janRow')
        .find('td div')
        .contains(String(value))
        .scrollIntoView()
        .should('be.visible')
        .click();
    });
  });

  it('edits a grade', () => {
    cy.get('[data-cy="Jan Kowalski"]')
      .closest('tr')
      .as('janRow');

    cy.get('@janRow')
      .find('td div')
      .contains('47')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('#score input').then(($input) => {
      const max = Number($input.attr('aria-valuemax'));
      const value = max - 1;

      cy.wrap($input)
        .clear({ force: true })
        .type(String(value));

      cy.get('[data-cy="save-button"]').click();

      cy.get('@janRow')
        .find('td div')
        .contains(String(value))
        .scrollIntoView()
        .should('be.visible')
        .click();
    });
  });
});