Cypress.Commands.add('customCommand', () => {
  return cy.wrap(42)
})
