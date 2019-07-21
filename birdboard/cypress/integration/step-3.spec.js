/// <reference types="Cypress" />
// use helper function loginWithUI for DRY

context('User setup', () => {
  before(() => {
    cy.visit('http://localhost:8080/signup')
    // clear database from previously signed up users
    cy.task('clear:db')
  })

  it('signup and login user', () => {

    cy.get('input[name="email"]').type('amir@cypress.io')
    cy.get('input[name="password"]').type('1234')
    cy.get('input[name="confirm-password"]').type('1234')
    cy.get('#signup-button').click()

    cy.location('pathname').should('eq', '/login')

    cy.loginWithUI('amir@cypress.io', '1234')

    cy.location('pathname').should('eq', '/board')
  })
})
