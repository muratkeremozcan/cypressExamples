describe('Articles', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load when home page loads', () => {
    cy.get('app-article').should('have.length.greaterThan', 0);
  });

  it('should search', () => {
    cy.get('input.search').type('canvas');
    cy.get('.search-button').click();
    cy.get('app-article').should('have.length', 1);
  });

  // USER CREATED TEST
  // RUN APP WITH 'NPM START'
  // IN A DIFFERENT CONSOLE WINDOW RUN CYPRESS WITH 'NPX CYPRESS OPEN'
  it('should search (student version)', () => {
    // put test here
  });

  // USER CREATED TEST FOR TAGS
  it('should filter tags', () => {
    // check that the total number of tags is 20
    // find tags search input and type 'anim' in it
    // assert the number of tags returned
    // click on 2nd tag 'animations'
    // assert the number of selected tags is 1
    // assert total tags is 15
    // click on the tag with routing
    // assert there are 3 articles
    // BONUS
    // reset filters, check number of tags and articles
    // select a tag, assert it's selected
    // unselect that tag, assert back to default state
  });
});
