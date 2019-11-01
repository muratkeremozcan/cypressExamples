
describe('Articles', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load when home page loads', () => {
    cy.get('app-article').should('have.length.greaterThan', 0);
  });

  it('should open a new tab when clicked', () => {
    cy.get('app-article')
      .eq(2)
      .children('a')
      .should('have.attr', 'target', '_blank');
  });

  it('should search', () => {
    cy.get('input.search').type('canvas')
    cy.get('.search-button').click();
    cy.get('app-article')
      .should('have.length', 1);
  })

  // USER CREATED TEST
  it('should search (student version)', () => {
    cy.get('input.search').type('validator')
    cy.get('.search-button').click();
    cy.get('app-article')
      .should('have.length', 6);
  })

  // USER CREATED TEST FOR TAGS
  it('should filter tags', () => {
    // VERY IMPORTANT - MUST COUNT FIRST SO THAT WE AREN'T
    // TYPING BEFORE ANY TAGS GET RETURNED
    cy.get('div.tags').should('have.length', 20)

    cy.get('.tags-container input').type('anim');
    cy.get('div.tags').should('have.length', 3)
      .eq(1).click();
    cy.get('div.tags.selected').should('have.length', 1);
    cy.get('div.tags').should('have.length', 15)
      .contains('routing').click()
    cy.get('app-article')
      .should('have.length', 3);
  })
});
