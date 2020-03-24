

/**
 * Queries Mailosaur for expected email
 * @param {*} query
 * @returns {Cypress.Chainable<any>}
 */
export const getEmailFromMailService = query => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('MAILOSAUR_API')}/messages/await?server=x4be6xxf`,
    headers: {
      authorization: Cypress.env('MAILOSAUR_PASSWORD')
    },
    auth: {
      user: Cypress.env('MAILOSAUR_API_KEY'),
      password: ''
    },
    body: query
  });
}

/**
 * Creates a Mailosaur service email
 * @param {string} randomName any random name
 * @returns {string} Mailosaur service email
 */
export const createEmail = (randomName) => `${randomName}.${Cypress.env('MAILOSAUR_SERVERID')}@mailosaur.io`;

