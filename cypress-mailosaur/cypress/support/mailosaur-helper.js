/**
 * Creates a Mailosaur service email
 * @param {string} randomName any random name
 * @returns {string} Mailosaur service email
 */
export const createEmail = (randomName) => `${randomName}.${Cypress.env('MAILOSAUR_SERVERID')}@mailosaur.io`;

/**
 * Queries Mailosaur for expected email
 * @param {*} query
 * @returns {Cypress.Chainable<any>}
 */
export const postMessageToMailService = query => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('MAILOSAUR_API')}/messages/await?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
    headers: {
      authorization: Cypress.env('MAILOSAUR_PASSWORD')
    },
    auth: {
      user: Cypress.env('MAILOSAUR_API_KEY'),
      password: ''
    },
    body: query,
    retryOnStatusCodeFailure: true
  });
}

export const waitForEmailList = () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('MAILOSAUR_API')}/messages?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
    headers: {
      authorization: Cypress.env('MAILOSAUR_PASSWORD')
    },
    auth: {
      user: Cypress.env('MAILOSAUR_API_KEY'),
      password: ''
    },
    retryOnStatusCodeFailure: true
  }).its('body').its('items').as('getEmailList') // this is the email list in an array
    .its('length').then(length => length > 0);
}

export const waitForUserEmail = (userEmail) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('MAILOSAUR_API')}/messages?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
    headers: {
      authorization: Cypress.env('MAILOSAUR_PASSWORD')
    },
    auth: {
      user: Cypress.env('MAILOSAUR_API_KEY'),
      password: ''
    },
    retryOnStatusCodeFailure: true
  }).its('body').its('items')
  .then(emailList => emailList[0].to[0].email === userEmail)
  // .then(emailList => emailList === userEmail);
}



// // may be useless, delete if so

// /** msg identity function: takes the messages and returns them */
// export const extractIds = arrMsgs => arrMsgs;

// export const filterEmailId = (emailList, userEmail) => Cypress._.filter(emailList, email => email.to[0].email === userEmail);

// /** returns an array of messages */
// export const listMessages = () => {
//   return cy.request({
//     method: 'GET',
//     url: `${Cypress.env('MAILOSAUR_API')}/messages?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
//     headers: {
//       authorization: Cypress.env('MAILOSAUR_PASSWORD')
//     },
//     auth: {
//       user: Cypress.env('MAILOSAUR_API_KEY'),
//       password: ''
//     },
//     retryOnStatusCodeFailure: true
//   }).then(response => {
//     expect(response.status).to.equal(200);
//     return response.body.items; // messages are in the items array
//   });
// }

// /** retrieves a message by id */
// export const retrieveMessage = (id) => {
//   return cy.request({
//     method: 'GET',
//     url: `${Cypress.env('MAILOSAUR_API')}/messages/${id}`,
//     headers: {
//       authorization: Cypress.env('MAILOSAUR_PASSWORD')
//     },
//     auth: {
//       user: Cypress.env('MAILOSAUR_API_KEY'),
//       password: ''
//     },
//     retryOnStatusCodeFailure: true
//   });
// }
