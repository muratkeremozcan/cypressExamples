/** seedAndVisit
 * function is taking a default parameter @seedData todos.json
 */
Cypress.Commands.add('seedAndVisit', (seedData = 'fixture:todos') => {
    // stubbing an API call to control response
    cy.server(); // starts a server which allows us to stub responses
    // stubbing a route: request, to url, response
    cy.route('GET', '/api/todos', seedData);
    cy.visit('/');
});
