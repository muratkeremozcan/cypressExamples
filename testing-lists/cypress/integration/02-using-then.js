/// <reference types="cypress" />

const todos = require('../fixtures/twoTodos')

beforeEach( () => {

  cy
    .request('POST', '/todos/seed', todos)

  cy
    .visit('localhost:3000');

});

it('Checks texts of todos items', () => {

  cy
    .get('.todo').then( items => {

      expect(items[0]).to.contain.text('buy milk')
      expect(items[1]).to.contain.text('wash dishes')
        
    })
  
});