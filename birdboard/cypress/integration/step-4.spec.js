/// <reference types="Cypress" />
// instead of sign up, seed the database with the user info
  // inserting a users collection to the db

const userSeed = require('../../server/seed/users')

context('User setup', () => {
  before(() => {
    cy.visit('http://localhost:8080/login')
    // Prepare database
    cy.task('clear:db')
    cy.task('seed:db', userSeed.data)
  })

  it('login user', () => {

    cy.loginWithUI('amir@cypress.io', '1234')

    cy.location('pathname').should('eq', '/board')
  })
})
