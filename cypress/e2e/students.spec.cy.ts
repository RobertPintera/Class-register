describe('Students', () => {
  beforeEach(() => {
    cy.visit("#/main/settings");
    cy.get('[data-cy="load-demo-data-button"]').click();
    cy.get('[data-cy="confirm-accept-button"]').should('be.visible');
    cy.get('[data-cy="confirm-accept-button"]').click();
    cy.get('.p-toast-message')
      .should('contain', 'Successfully loaded demo data')
      .and('be.visible');
    
    cy.visit("#/main/students");
  });

  it(`creates a new student`, () => {
    cy.get('[data-cy="new-student-button"]').click();
    
    cy.get('[data-cy="name-input"]').then(($input) => {
      cy.wrap($input)
        .clear({ force: true })
        .type("Grzegorz");
    });

    cy.get('[data-cy="surname-input"]').then(($input) => {
      cy.wrap($input)
        .clear({ force: true })
        .type("Romanek");
    });

    cy.get('[data-cy="gender-select"]')
      .contains('button', 'Male')
      .then($btn => {
        if ($btn.attr('aria-pressed') === 'false') {
          cy.wrap($btn).click();
        }
      });

    cy.get('[data-cy="add-button"]').click();

    cy.get('[data-cy="students-table-header-row"]')
      .contains('.p-datatable-column-title', 'Name')
      .closest('th')
      .scrollIntoView()
      .find('button.p-datatable-column-filter-button')
      .click({ force: true });

    cy.get('div.p-datatable-filter-overlay')
      .should('exist')
      .within(() => {
        cy.get('[data-cy="name-input"]')
          .clear({ force: true })
          .type('Grzegorz', { force: true });

        cy.get('button[aria-label="Apply"]').click();
      });

    cy.get('.p-datatable-filter-buttonbar')
      .find('button[aria-label="Apply"]')
      .click();

    cy.get('[data-cy="students-table-header-row"]')
      .contains('.p-datatable-column-title', 'Surname')
      .closest('th')
      .scrollIntoView()
      .find('button.p-datatable-column-filter-button')
      .click({ force: true });

    cy.get('div.p-datatable-filter-overlay')
      .should('exist')
      .within(() => {
        cy.get('[data-cy="surname-input"]')
          .clear({ force: true })
          .type('Romanek', { force: true });

        cy.get('button[aria-label="Apply"]').click();
      });

    cy.get('tbody.p-datatable-tbody')
      .contains('tr', 'Grzegorz')
      .contains('tr', 'Romanek')
      .should('exist');     
  });

  it(`edit a student`, () => {

  });

  it(`delete a student`, () => {

  });

  it(`generate a student report`, () => {

  });
});