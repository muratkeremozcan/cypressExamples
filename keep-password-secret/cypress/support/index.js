require('cypress-failed-log')

/**
 * Logs the user by making API call to POST /login.
 * Make sure "cypress.json" + CYPRESS_ environment variables
 * have username and password values set.
 */
export const login = () => {
  const username = Cypress.env('username')
  const password = Cypress.env('password')

  // it is ok for the username to be visible in the Command Log
  expect(username, 'username was set').to.be.a('string').and.not.be.empty
  // but the password value should not be shown
  if (typeof password !== 'string' || !password) {
    throw new Error('Missing password value, set using CYPRESS_password=...')
  }

  cy.request({
    method: 'POST',
    url: '/login',
    form: true,
    body: {
      username,
      password
    }
  })
  cy.getCookie('connect.sid').should('exist')
}
