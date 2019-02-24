describe('List items', () => {

  before(function() {
    cy.eyesOpen({
      appName: 'Hello World!',
      testName: 'My first JavaScript test!',
      browser: [
        {width: 800, height: 600, name: 'firefox'},
        {width: 1024, height: 768, name: 'chrome'},
        {deviceName: 'iPad', screenOrientation: 'landscape'}
      ]
    });
  });
  beforeEach(() => {
    cy.seedAndVisit();
  });

  it('properly displays completed items', () => {
    
    cy.get('.todo-list li')
      .filter('.completed') // Get the DOM elements that match a specific selector. https://docs.cypress.io/api/commands/filter.html#Arguments 
      .should('have.length', 1)
      .and('contain', 'Eggs')
      .find('.toggle')
      .should('be.checked');
    cy.eyesCheckWindow('Completed Items');
  });

  it('Shows remaining todos in the footer', () => {
    cy.get('.todo-count')
      .should('contain', 3);
    cy.eyesCheckWindow('Remaining Items');
  });

  it('Removes a todo', () => {
    // removing todos will be handled by an xhr called to the back-end API, stub that with cy.route
    cy.route({
      url: 'api/todos/1',
      method: 'DELETE',
      status: 200,
      response: {}
    });

    // ALIASing
    cy.get('.todo-list li')
      .as('list');

    cy.get('@list')
      .first()
      .find('.destroy') // the button is not actually visible (hint: the icons) , the css is set to none, won't be shown until hovered
      // .click({force: true}); // force makes it so that Cypress internal checks for the buttons interactibility are disabled
      // rather than forcing, it is better to show the items. Mind that delete button is visible in the app preview
      .invoke('show')
      .click();

    cy.get('@list')
      .should('have.length', 3)
      .and('not.contain', 'Milk');
    cy.eyesCheckWindow('Removed a todo');
  });

  it('Marks an incomplete item complete', () => {

    cy.fixture('todos') // fixtures/todos.json - cy.fixture() accesses the fixture data
      .then(todos => { // flatten the data
        const target = Cypress._.head(todos); // Cypress lodash head() function - getting the first item in the todos array

        // route() command is used to define the request we want to handle
        cy.route( // request, url, response
          'PUT',
          `/api/todos/${target.id}`, // when there is a PUT request, respond with first item
          Cypress._.merge(target, {isComplete: true}) // updated version of the original todo, 
        ); // now we have a route, where the response is a list of items with the first item set to true
      });

    cy.get('.todo-list li')
      .first()
      .as('first-todo'); // an alias for the first item on the list

    cy.get('@first-todo')
      .find('.toggle') // find the checkbox and click it
      .click()
      .should('be.checked');

    cy.get('.todo-count')
      .should('contain', 2);
    cy.eyesCheckWindow('Marked incomplete item complete');
  });
  after(function() {
    cy.eyesClose();
  });
});