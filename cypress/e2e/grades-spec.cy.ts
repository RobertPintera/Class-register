describe('Grades - dialog', () => {
  const controlGrade = '47';

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

  it('adds a new grade for Jan Kowalski', () => {
    cy.get('[data-cy="Jan Kowalski"]')
      .closest('tr')
      .as('janRow');

    // Check control grade - if data has been loaded
    cy.get('@janRow')
      .find('[data-cy="grade-cell"]')
      .contains(controlGrade, { timeout: 5000 })
      .scrollIntoView()
      .should('be.visible');
      
    // get all grade cells and find first empty
    cy.get('@janRow')
      .find('[data-cy="grade-cell"]')
      .then(($cells) => {
        const testIds = Array.from($cells).map((cell) => cell.getAttribute('data-test-id'));
        cy.log(`All testIds in this row: ${testIds.join(', ')}`);
        cy.wrap(testIds).as('testIds');

        const firstEmptyCell = Array.from($cells).find((cell) => cell.textContent?.trim() === '-');

        if (!firstEmptyCell) {
          throw new Error('No empty grade cell found for this student');
        }

        const studentId = firstEmptyCell.getAttribute('data-student-id');
        const testId = firstEmptyCell.getAttribute('data-test-id');

        cy.log(`First empty cell: studentId=${studentId}, testId=${testId}`);

        cy.wrap(studentId).as('studentId');
        cy.wrap(testId).as('testId');

        cy.wrap(firstEmptyCell).scrollIntoView().should('be.visible').click();
      });

    cy.get('#score input').then(($input) => {
      const max = Number($input.attr('aria-valuemax'));
      const value = max - 1;

      cy.wrap(value).as('value');

      cy.wrap($input)
        .clear({ force: true })
        .type(String(value));
    });

    cy.get('[data-cy="save-button"]')
      .should('be.visible')
      .click();

    cy.get('@studentId').then((studentId) => {
      cy.get('@testId').then((testId) => {
        cy.get('@value').then((value) => {
          cy.get(
            `[data-cy="grade-cell"][data-student-id="${studentId}"][data-test-id="${testId}"]`)
            .scrollIntoView()
            .should('be.visible')
            .then(($cell) => {
              const cellText = $cell.text().trim();
              cy.log(`Current cell value after save: ${cellText}`);
              expect(cellText).to.eq(String(value));
            });
        });
      });
    });
  });

  it('edits a grade for Jan Kowalski', () => {
    const specificGrade = '47';

    cy.get('[data-cy="Jan Kowalski"]')
      .closest('tr')
      .as('janRow');

    // Check control grade - if data has been loaded
    cy.get('@janRow')
      .find('[data-cy="grade-cell"]')
      .contains(controlGrade, { timeout: 5000 })
      .scrollIntoView()
      .should('be.visible');

    // get all grade cells and find first with specific value
    cy.get('@janRow')
      .find('[data-cy="grade-cell"]')
      .then(($cells) => {
        const testIds = Array.from($cells).map((cell) => cell.getAttribute('data-test-id'));
        cy.log(`All testIds in this row: ${testIds.join(', ')}`);
        cy.wrap(testIds).as('testIds');

        const firstCell = Array.from($cells).find((cell) => cell.textContent?.trim() === specificGrade);
        expect(firstCell).to.exist;

        if (!firstCell) {
          throw new Error('No specific grade cell found for this student');
        }

        const studentId = firstCell.getAttribute('data-student-id');
        const testId = firstCell.getAttribute('data-test-id');

        cy.log(`First specific cell: studentId=${studentId}, testId=${testId}`);

        cy.wrap(studentId).as('studentId');
        cy.wrap(testId).as('testId');

        cy.wrap(firstCell).scrollIntoView().should('be.visible').click();
      });

    cy.get('#score input').then(($input) => {
      const max = Number($input.attr('aria-valuemax'));
      const value = max - 1;

      cy.wrap(value).as('value');

      cy.wrap($input)
        .clear({ force: true })
        .type(String(value));
    });

    cy.get('[data-cy="save-button"]')
      .should('be.visible')
      .click();

    cy.get('@studentId').then((studentId) => {
      cy.get('@testId').then((testId) => {
        cy.get('@value').then((value) => {
          cy.get(
            `[data-cy="grade-cell"][data-student-id="${studentId}"][data-test-id="${testId}"]`)
            .scrollIntoView()
            .should('be.visible')
            .then(($cell) => {
              const cellText = $cell.text().trim();
              cy.log(`Current cell value after save: ${cellText}`);
              expect(cellText).to.eq(String(value));
            });
        });
      });
    });
  });
});


describe('Grades - input', () => {
  const controlGrade = '47';

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

        if (currentValue !== 'With input') {
          cy.wrap($select).click();

          cy.get('[data-cy="editing-grade-option-I"]')
            .contains('With input')
            .click();

          cy.get('[data-cy="editing-grade-select"]')
            .should('contain.text', 'With input');
        }
      });

    cy.visit("#/main/grades");
  });

  it('adds a new grade for Jan Kowalski', () => {
    cy.get('[data-cy="Jan Kowalski"]')
      .closest('tr')
      .as('janRow');

    // Check control grade - if data has been loaded
    cy.get('@janRow')
      .find('[data-cy="grade-cell"]')
      .contains(controlGrade, { timeout: 5000 })
      .scrollIntoView()
      .should('be.visible');
      
    // get all grade cells and find first empty
    cy.get('@janRow')
      .find('[data-cy="grade-cell"]')
      .then(($cells) => {
        const testIds = Array.from($cells).map((cell) => cell.getAttribute('data-test-id'));
        cy.log(`All testIds in this row: ${testIds.join(', ')}`);
        cy.wrap(testIds).as('testIds');

        const firstEmptyCell = Array.from($cells).find((cell) => cell.textContent?.trim() === '-');

        if (!firstEmptyCell) {
          throw new Error('No empty grade cell found for this student');
        }

        const studentId = firstEmptyCell.getAttribute('data-student-id');
        const testId = firstEmptyCell.getAttribute('data-test-id');

        cy.log(`First empty cell: studentId=${studentId}, testId=${testId}`);

        cy.wrap(studentId).as('studentId');
        cy.wrap(testId).as('testId');

        cy.wrap(firstEmptyCell).scrollIntoView().should('be.visible').click();
      });

    cy.get('[data-cy="grade-input-cell"] input').then(($input) => {
      const max = Number($input.attr('aria-valuemax'));
      const value = max - 1;

      cy.wrap(value).as('value');

      cy.wrap($input)
        .clear({ force: true })
        .type(String(value) + '{enter}', { force: true });
    });

    cy.get('@studentId').then((studentId) => {
      cy.get('@testId').then((testId) => {
        cy.get('@value').then((value) => {
          cy.get(
            `[data-cy="grade-cell"][data-student-id="${studentId}"][data-test-id="${testId}"]`)
            .scrollIntoView()
            .should('be.visible')
            .then(($cell) => {
              const cellText = $cell.text().trim();
              cy.log(`Current cell value after save: ${cellText}`);
              expect(cellText).to.eq(String(value));
            });
        });
      });
    });
  });

  it('edits a grade for Jan Kowalski', () => {
    const specificGrade = '47';

    cy.get('[data-cy="Jan Kowalski"]')
      .closest('tr')
      .as('janRow');

    // Check control grade - if data has been loaded
    cy.get('@janRow')
      .find('[data-cy="grade-cell"]')
      .contains(controlGrade, { timeout: 5000 })
      .scrollIntoView()
      .should('be.visible');
      
    // get all grade cells and find first empty
    cy.get('@janRow')
      .find('[data-cy="grade-cell"]')
      .then(($cells) => {
        const testIds = Array.from($cells).map((cell) => cell.getAttribute('data-test-id'));
        cy.log(`All testIds in this row: ${testIds.join(', ')}`);
        cy.wrap(testIds).as('testIds');

        const firstCell = Array.from($cells).find((cell) => cell.textContent?.trim() === specificGrade);

        if (!firstCell) {
          throw new Error('No empty grade cell found for this student');
        }

        const studentId = firstCell.getAttribute('data-student-id');
        const testId = firstCell.getAttribute('data-test-id');

        cy.log(`First empty cell: studentId=${studentId}, testId=${testId}`);

        cy.wrap(studentId).as('studentId');
        cy.wrap(testId).as('testId');

        cy.wrap(firstCell).scrollIntoView().should('be.visible').click();
      });

    cy.get('[data-cy="grade-input-cell"] input').then(($input) => {
      const max = Number($input.attr('aria-valuemax'));
      const value = max - 1;

      cy.wrap(value).as('value');

      cy.wrap($input)
        .clear({ force: true })
        .type(String(value) + '{enter}', { force: true });
    });

    cy.get('@studentId').then((studentId) => {
      cy.get('@testId').then((testId) => {
        cy.get('@value').then((value) => {
          cy.get(
            `[data-cy="grade-cell"][data-student-id="${studentId}"][data-test-id="${testId}"]`)
            .scrollIntoView()
            .should('be.visible')
            .then(($cell) => {
              const cellText = $cell.text().trim();
              cy.log(`Current cell value after save: ${cellText}`);
              expect(cellText).to.eq(String(value));
            });
        });
      });
    });
  });
});