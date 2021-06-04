/// <reference types="cypress" />

const todos = require('../fixtures/twoTodos')

beforeEach( () => {

  cy
    .request('POST', '/todos/seed', todos)

  cy
    .visit('localhost:3000');

});

it('Checks texts of todo items', () => {

  cy
    .get('.todo')
    .eq(0)
    .should('contain.text', 'buy milk');

  cy
    .get('.todo')
    .eq(1)
    .should('contain.text', 'wash dishes');
  
});