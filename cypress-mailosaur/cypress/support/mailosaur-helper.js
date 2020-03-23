

/**
 * Queries Mailosaur for expected email
 * @param {*} query
 * @returns {Cypress.Chainable<any>}
 */
export const getEmailFromMailService = query => {
  return cy
    .request({
      method: 'POST',
      url: `https://mailosaur.com/api/messages/await?server=${Cypress.env('MAILOSAUR_SERVERNAME')}`,
      body: query,
      headers: { 'Content-Type': 'application/json' },
      auth: { user: Cypress.env('MAILOSAUR_API_KEY') }
    })
    .then(response => {
      expect(response.status).to.equal(200);
      return response.body;
    });
}

/**
 * Creates a Mailosaur service email
 * @param {string} name any random name
 * @returns {string} Mailosaur service email
 */
export const createEmail = (name) => `${name}.${Cypress.env('MAILOSAUR_SERVERID')}@mailosaur.io`;


// export function getEmailFromMailService(query): Cypress.Chainable<any> {
//   return cy
//     .request({
//       method: 'POST',
//       url: `https://mailosaur.com/api/messages/await?server=${Cypress.env('MAILOSAUR_SERVERNAME')}`,
//       body: query,
//       headers: { 'Content-Type': 'application/json' },
//       auth: { user: Cypress.env('MAILOSAUR_API_KEY') }
//     })
//     .then(response => {
//       expect(response.status).to.equal(200);
//       return response.body;
//     });
// }

