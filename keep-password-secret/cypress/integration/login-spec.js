/// <reference types="cypress" />
it('logs in', () => {
  cy.visit('/login')
  cy.get('[name=username]').type('jack')
  cy.get('[name=password]').type('secret')
  cy.get('[type=Submit]').click()

  cy.contains('a', 'profile').should('be.visible').click()
  cy.url().should('match', /profile$/)
  cy.contains('Email: jack@example.com')
})
