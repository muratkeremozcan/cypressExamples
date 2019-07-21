/// <reference types="Cypress" />
// stub network responses

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

    // longer way of doing fixtures
    // cy.fixture('tweets').then((tweets) => {
    //   cy.route({
    //     url: '/tweets*',
    //     response: tweets,
    //     delay: 3000, // simulate slow response
    //     status: 404
    //   })
    //     .as('tweets')
    // })

    // shorter syntax with fixtures
    cy.route({
      method: 'GET',
      url: '/tweets*',
      response: 'fixture:tweets',
      delay: 3000, // simulate slow response
      status: 404
    }).as('tweets')

    cy.get('#hashtags')
      .type('javascript{enter}')
      .type('cypressio{enter}')

    cy.wait('@tweets')
      .its('status').should('eq', 404)
    cy.wait('@tweets') // the fixture still has length 30 
      .its('response.body.tweets').should('have.length', 30)
    // but nothing displays in the window
    cy.window().then(win => {
      expect(win.app.$store.state.tweets.length).to.eq(0);
      // alternative
      cy.wrap(win.app.$store.state.tweets.length).should('eq', 0);
    })

  })
})
