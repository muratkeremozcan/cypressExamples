describe('Input form', () => {

  beforeEach('visit url', () => {
    // cy.visit('/'); // nav to url
    cy.seedAndVisit([]); // stubbed API call with fixed response for todo items, fixed response is empty array in this case
  });

  it('focuses input on load', () => {
    cy.focused()  // Yields the element currently in focus
      .should('have.class', 'new-todo');
  });

  it('accepts input', () => {
    const typedText = 'Buy Milk';
    cy.get('.new-todo')
      .type('Buy Milk')
      .should('have.value', typedText);
  });

  context('Form submission', () => {
    beforeEach(() => {
      cy.server();  // starts a server which allows us to stub responses
    });
    
    it('Adds a new todo on submit', () => {
      const itemText = 'Buy eggs';

      // route() command is used to define the request we want to handle
      cy.route('POST', '/api/todos'), { // stubbing a route: request, to url, response
        name: itemText, // predefined response the application receives when it makes the API call
        id: 1,
        isComplete: false
      }
      cy.get('.new-todo')
        .type(itemText)
        .type('{enter}')
        .should('have.value', '')
      cy.get('.todo-list li')
        .should('have.length', 1)
        .and('contain', itemText)
    });

    it('Shows an error message on a failed submission', () => {
      // route() command is used to define the request we want to handle
      cy.route({ // defining route with options object as the only argument. Simulating failed call
        url: '/api/todos',
        method: 'POST',
        status: 500,
        response: {}
      });

      cy.get('.new-todo')
        .type('test{enter}')

      cy.get('.todo-list li')
        .should('not.exist')

      cy.get('.error')
        .should('be.visible')
    });
  });
});