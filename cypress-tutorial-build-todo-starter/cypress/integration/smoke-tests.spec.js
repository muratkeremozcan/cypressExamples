describe('Smoke tests', () => {
  beforeEach(() => {
    // sample API usage, clearing todo list, clearing database before each test
    cy.request('GET', '/api/todos') // cy.request to make an API GET request to a url
      .its('body') // its('body') is used to get the resulting response from the GET request
      .each(todo => cy.request('DELETE', `api/todos/${todo.id}`)); // the response will have the db items, send a DELETE API request to each
  });

  context('With no todos', () => {
    it('Saves new todos', () => {
      const items = [ // for data driven tests
        {
          text: 'Buy milk',
          expectedLength: 1
        },
        {
          text: 'Buy eggs',
          expectedLength: 2
        },
        {
          text: 'Buy bread',
          expectedLength: 3
        }
      ]

      cy.visit('/');

      // Example API test
      cy.server();
      cy.route('POST', 'api/todos') // any POST request to api/todos endpoint. cy.route without stub - no response is defined
        .as('create'); // creating an alias for the request

      cy.wrap(items)
        .each(todo => {
          cy.focused() // Yields the element currently in focus
            .type(todo.text) // type and enter
            .type('{enter}');

          cy.wait('@create'); // explicit wait for response (network request to complete) before moving on

          cy.get('.todo-list li')
            .should('have.length', todo.expectedLength);
        });
    });
  });

  context('With active todos', () => {
    // sample API usage, seeding the application with data and testing the application's behavior with a populated database
    beforeEach(() => {
      cy.fixture('todos') // loading the data from the todos fixture (todos.json)
        .each(todo => { // iterate over the todos, for each todo item create a new todo object
          const newTodo = Cypress._.merge(todo, {
            isComplete: false
          }); // lodash merge to take the todo from the fixture and merge it with isComplete: false property
          cy.request('POST', '/api/todos', newTodo); // use the back-end API to create a todo POST request for each todo
        });
      cy.visit('/'); // after the data has been populated, visit the application
    });

    it('Loads existing data from the DB', () => {
      cy.get('.todo-list li')
        .should('have.length', 4);
    });

    it('Deletes todos', () => {
      cy.server();
      cy.route('DELETE', '/api/todos/*') // API call for delete
        .as('delete');

      cy.get('.todo-list li')
        .each($el => { // getting a array of selectors
          cy.wrap($el) // cy.wrap() Yields the object passed into it, here Wraps the element to continue executing command
            .find('.destroy') // this is hidden until hover
            .invoke('show') // show the hidden element
            .click(); // deletes the element

          cy.wait('@delete'); // API test to ensure the DELETE request
        })
        .should('not.exist');
    });

    it('Toggles todos', () => {
      const clickAndWait = ($el) => {
        cy.wrap($el) // cy.wrap() Yields the object passed into it
          .as('item') // alias for list item
          .find('.toggle')
          .click();

        cy.wait('@update');
      }

      cy.server();
      cy.route('PUT', '/api/todos/*') // PUT requests to save updates
        .as('update');

      // toggle each item in todo list
      cy.get('.todo-list li')
        .each($el => {
          clickAndWait($el);
          cy.get('@item')
            .should('have.class', 'completed');
        })
        .each($el => { // chain a new each
          clickAndWait($el);
          cy.get('@item')
            .should('not.have.class', 'completed');
        });

    });
  });
});