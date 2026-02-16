describe('Tests - test list', () => {
  beforeEach(() => {
    cy.visit("#/main/settings");
    cy.get('[data-cy="load-demo-data-button"]').click();
    cy.get('[data-cy="confirm-accept-button"]').should('be.visible');
    cy.get('[data-cy="confirm-accept-button"]').click();
    cy.get('.p-toast-message')
      .should('contain', 'Successfully loaded demo data')
      .and('be.visible');
    
    cy.visit("#/main/tests");
  });

  it(`creates a new test`, () => {
    cy.get('[data-cy="new-test-button"]').click();

    cy.get('[data-cy="name-input"]').then(($input) => {
      cy.wrap($input)
        .clear({ force: true })
        .type("English - Vocabulary");
    });

    cy.get('[data-cy="points-input"] input')
      .clear({ force: true })
      .type('20');

    cy.get('[data-cy="weight-input"] input')
      .clear({ force: true })
      .type('3');

    cy.get('[data-cy="required-checkbox"] input[type="checkbox"]')
      .check({ force: true });

    cy.get('[data-cy="required-points-input"] input')
      .clear({ force: true })
      .type('10');

    cy.get('[data-cy="mandatory-checkbox"] input[type="checkbox"]')
      .check({ force: true });

    cy.get('[data-cy="add-button"]').click();

    // Filter data in datatable
    cy.get('[data-cy="tests-table-header-row"]')
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
          .type('English - Vocabulary', { force: true });

        cy.get('button[aria-label="Apply"]').click();
      });

    cy.get('.p-datatable-filter-buttonbar')
      .find('button[aria-label="Apply"]')
      .click();

    cy.get('[data-cy="tests-table-header-row"]')
      .contains('.p-datatable-column-title', 'Weight')
      .closest('th')
      .scrollIntoView()
      .find('button.p-datatable-column-filter-button')
      .click({ force: true });

    cy.get('div.p-datatable-filter-overlay')
      .should('exist')
      .within(() => {
        cy.get('[data-cy="weight-input"]')
          .clear({ force: true })
          .type('3', { force: true });

        cy.get('button[aria-label="Apply"]').click();
      });

    cy.get('tbody.p-datatable-tbody')
      .contains('tr', 'English - Vocabulary')
      .contains('tr', '3')
      .should('exist');
  });
});


describe('Tests - test details', () => {
  beforeEach(() => {
    cy.visit("#/main/settings");
    cy.get('[data-cy="load-demo-data-button"]').click();
    cy.get('[data-cy="confirm-accept-button"]').should('be.visible');
    cy.get('[data-cy="confirm-accept-button"]').click();
    cy.get('.p-toast-message')
      .should('contain', 'Successfully loaded demo data')
      .and('be.visible');
    
    cy.visit("#/main/tests");

    // Filter data in datatable
    cy.get('[data-cy="tests-table-header-row"]')
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
          .type('English - Grammar', { force: true });

        cy.get('button[aria-label="Apply"]').click();
      });

    cy.get('.p-datatable-filter-buttonbar')
      .find('button[aria-label="Apply"]')
      .click();

    cy.get('[data-cy="tests-table-header-row"]')
      .contains('.p-datatable-column-title', 'Weight')
      .closest('th')
      .scrollIntoView()
      .find('button.p-datatable-column-filter-button')
      .click({ force: true });

    cy.get('div.p-datatable-filter-overlay')
      .should('exist')
      .within(() => {
        cy.get('[data-cy="weight-input"]')
          .clear({ force: true })
          .type('3', { force: true });

        cy.get('button[aria-label="Apply"]').click();
      });

    cy.get('tbody.p-datatable-tbody > tr').each(($row) => {
      const text = $row.text();
      if (text.includes('English - Grammar') && text.includes('3')) {
        cy.wrap($row).click();
      }
    });
  });

  it(`edit a test`, () => {
    cy.get('[data-cy="edit-button"]').click();
        
    cy.get('[data-cy="name-input"]').then(($input) => {
      cy.wrap($input)
        .clear({ force: true })
        .type("English - Vocabulary");
    });

    cy.get('[data-cy="points-input"] input')
      .clear({ force: true })
      .type('20');

    cy.get('[data-cy="weight-input"] input')
      .clear({ force: true })
      .type('3');

    cy.get('[data-cy="required-checkbox"] input[type="checkbox"]')
      .check({ force: true });

    cy.get('[data-cy="required-points-input"] input')
      .clear({ force: true })
      .type('10');

    cy.get('[data-cy="mandatory-checkbox"] input[type="checkbox"]')
      .check({ force: true });

    cy.get('[data-cy="save-button"]').click();

    // Select an option to change student grades
    cy.get('[data-cy="reduce-radio-button"] input[type="radio"]')
      .check({ force: true });

    cy.get('[data-cy="normalize-radio-button"] input[type="radio"]')
      .check({ force: true });

    cy.get('[data-cy="delete-radio-button"] input[type="radio"]')
      .check({ force: true });

    cy.get('[data-cy="reduce-radio-button"] input[type="radio"]')
      .check({ force: true });

    cy.get('[data-cy="save-button"]').click();

    // Check if data is updated
    cy.get('[data-cy="name"]')
      .should('exist')
      .and('contain.text', 'English - Vocabulary');

    cy.get('[data-cy="weight"]')
      .should('exist')
      .and('contain.text', '3');

    cy.get('[data-cy="max-points"]')
      .should('exist')
      .and('contain.text', '20');

    cy.get('[data-cy="required-points"]')
      .should('exist')
      .and('contain.text', '10');

    cy.get('[data-cy="mandatory"]')
      .should('exist')
      .and('contain.text', 'Yes');
  });

  it(`delete a test`, () => {
    cy.get('[data-cy="delete-button"]').click();
    cy.get('[data-cy="confirm-accept-button"]').should('be.visible');
    cy.get('[data-cy="confirm-accept-button"]').click();
    cy.location('hash').should('eq', '#/main/tests');

    cy.get('.p-toast-message')
      .should('contain', 'Successfully deleted test')
      .and('be.visible');
  });

  it(`generate a test report`, () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('[data-cy="report-button"]').should('be.visible').click();

    cy.get('@windowOpen').should('have.been.calledOnce');

    // Check if it is pdf
    cy.get('@windowOpen').then((stub: any) => {
      const url = stub.getCall(0).args[0];
      expect(url).to.match(/^blob:/);
    });
  });
});