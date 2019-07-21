/// <reference types="Cypress" />
// programmatic login: directly use the login function of the application
const userSeed = require('../../server/seed/users')

context('User setup', () => {
  before(() => {
    cy.visit('http://localhost:8080/login')
    // Prepare database
    cy.task('clear:db')
    cy.task('seed:db', userSeed.data)
  })

  it('login user', () => {

    cy.login('amir@cypress.io', '1234')

    cy.location('pathname').should('eq', '/board')
  })
})
