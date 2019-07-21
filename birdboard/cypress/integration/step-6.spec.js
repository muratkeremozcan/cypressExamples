/// <reference types="Cypress" />
// stub network response with fixtures

const userSeed = require('../../server/seed/users')

context('BirdBoard', () => {
  before(() => {
    // Visit Login page
    cy.visit('http://localhost:8080/login')

    // Prepare database
    cy.task('clear:db')
    cy.task('seed:db', userSeed.data)
    
    // Login to account
    cy.login('amir@cypress.io', '1234')
  })

  it('load tweets for selected hashtags', () => {
    cy.server()

    // Fixture is stored in cypress/fixtures/tweets.json
    cy.route('GET', '/tweets*', 'fixture:tweets')
      .as('tweets')

    cy.get('#hashtags')
      .type('javascript{enter}')
      .type('cypressio{enter}')

    // with the given stubbed network response, the application should have x many tweets
    cy.window().then(win => {
      cy.wait('@tweets')
        .its('response.body.tweets')
        .should('have.length', win.app.$store.state.tweets.length)
    })
  })
})
