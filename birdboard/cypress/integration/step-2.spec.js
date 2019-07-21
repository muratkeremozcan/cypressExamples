/// <reference types="Cypress" />
// clear the database with cy.task() to ensure idempotent test execution

context('User setup', () => {
  before(() => {
    cy.visit('http://localhost:8080/signup')
    cy.task('clear:db')
  })

  it('signup and login user', () => {

    cy.get('input[name="email"]').type('amir@cypress.io')
    cy.get('input[name="password"]').type('1234')
    cy.get('input[name="confirm-password"]').type('1234')
    cy.get('#signup-button').click()

    cy.location('pathname').should('eq', '/login')

    cy.get('input[name="email"]').type('amir@cypress.io')
    cy.get('input[name="password"]').type('1234')
    cy.get('#login-button').click()

    cy.location('pathname').should('eq', '/board')
  })
})
