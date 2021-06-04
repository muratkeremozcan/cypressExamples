/// <reference types="cypress" />

const todos = require('../fixtures/fiveTodos')
const todosTitles = ["buy milk", "wash dishes", "clean windows", "clean up bedroom", "wash clothes"]

beforeEach( () => {

  cy
    .request('POST', '/todos/seed', todos)

  cy
    .visit('localhost:3000');

});

it('Checks texts of todos item', () => {

  cy
    .get('.todo').each( (item, index) => {

      cy
        .wrap(item)
        .should('contain.text', todosTitles[index])
        
    })
  
});