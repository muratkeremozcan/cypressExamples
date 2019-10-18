const autoRecord = require('cypress-autorecord'); // Require the autorecord function

describe('MyApp', function() {

  autoRecord();

  // Insert [r] at the beginning of your test name to re-record
  it('Works', function() {

    cy.visit('http://localhost:8080/');
    cy.get('ul').find('li').should('have.length', 10);

  });
});
