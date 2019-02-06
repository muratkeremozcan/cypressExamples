Cypress.Commands.add('loginByCSRF', (csrfToken) => {
  cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false, // dont fail so we can make assertions
      form: true, // we are submitting a regular form body
      body: {
        username: 'cypress',
        password: 'password123',
        _csrf: csrfToken // insert this as part of form body
      }
    })
})