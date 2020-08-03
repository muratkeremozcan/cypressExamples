const commonAuthProps = {
  user: Cypress.env('MAILOSAUR_API_KEY'),
  password: ''
};

const commonHeaders = {
  authorization: Cypress.env('MAILOSAUR_PASSWORD')
}

/**
 * Creates a Mailosaur service email
 * @param {string} randomName any random name
 * @returns {string} Mailosaur service email
 */
export const createEmail = (randomName) => `${randomName}.${Cypress.env('MAILOSAUR_SERVERID')}@mailosaur.io`;

/**
 * Queries Mailosaur for expected email
 * @param {*} query
 */
export const postMessageToMailService = query => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('MAILOSAUR_API')}/messages/await?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
    headers: commonHeaders,
    auth: commonAuthProps,
    body: query,
  });
}

/** queries Mailosaur and checks if at least 1 email exists in the messages list */
export const getEmailList = () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('MAILOSAUR_API')}/messages?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
    headers: commonHeaders,
    auth: commonAuthProps,
    retryOnStatusCodeFailure: true
  }).its('body').its('items').as('getEmailList') // this is the email list in an array
    .its('length').then(length => length > 0);
}

/** queries Mailosaur and checks that the specified email exists in the messages list
 * @param {string} userEmail
 * @returns {Cypress.Chainable<boolean>}
*/
export const getUserEmail = userEmail => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('MAILOSAUR_API')}/messages?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
    headers: commonHeaders,
    auth: commonAuthProps,
    retryOnStatusCodeFailure: true
  }).its('body').its('items')
    .then(emailList => emailList[0].to[0].email === userEmail)
}

/**
 * queries Mailosaur and chFecks if at least 1 email exists in the messages list, then
 * checks that the specified email exists in the messages list
 * @param {string} userEmail
 * @returns {Cypress.Chainable<boolean>}
 */
export const waitUntilUserEmail = userEmail => {
  const waitUntilOptions = {
    timeout: 25000,
    interval: 1000,
    customMessage: 'wait until an email is received at Mailosaur',
    errorMsg: 'email did not occur at Mailosaur within time limit',
    verbose: true,
    customCheckMessage: 'periodically  checking if email got received'
  };

  cy.waitUntil(
    () => getEmailList(),
    waitUntilOptions
  );

  // waitUntil expects a boolean result, if the email we need exists, we return true
  return cy.waitUntil(
    () => getUserEmail(userEmail),
    waitUntilOptions
  );
}

/** Clean up to reset state. Deletes all messages at https://mailosaur.com/beta/servers/<serverId>/messages
 * @returns {Cypress.Chainable<Cypress.Response>}
*/
export const deleteAllMessages = () => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('MAILOSAUR_API')}/messages?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
    headers: commonHeaders,
    auth: commonAuthProps,
    retryOnStatusCodeFailure: true
  })
}

/** Deletes 1 email message by message id. Can be useful if you want to delete the message after running the test. */
export const deleteEmailMessage = id => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('MAILOSAUR_API')}/messages/${id}`,
    headers: commonHeaders,
    auth: commonAuthProps,
    retryOnStatusCodeFailure: true
  })
}

/** returns an array of messages */
const listMessages = () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('MAILOSAUR_API')}messages?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
    auth: commonAuthProps,
    retryOnStatusCodeFailure: true
  }).then(response => {
    expect(response.status).to.equal(200);
    return response.body.items; // messages are in the items array
  });
}

/** Given an email message list at Mailosaur, extracts the id of the desired user email
 * @param {[]} emailList
 * @param {string} userEmail
 * @returns {string}
 */
const filterEmailId = (emailList, userEmail) =>
  emailList
    .filter(email => email.to[0].email === userEmail)
    .map((filteredEmail) => filteredEmail.id);

/** To get the full message content, including HTML & Text body content, you need to use the Retrieve a message endpoint.
 * Given an email message's id, yields the email's body. Tags the email body as 'emailBody`. Access it with cy.get('@emailBody')
 * @param {string} id
*/
const retrieveMessage = id => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('MAILOSAUR_API')}/messages/${id}`,
    headers: commonHeaders,
    auth: commonAuthProps,
    retryOnStatusCodeFailure: true
  }).its('body').as('emailBody');
};


/** Given an email, extract its email id (new hybrid apporach with cy.task) */
const getEmailId = email => cy.task('findEmailToUser', email).its('id');

// waitUntil approach (old)
// export const getEmailId = email => {
//   waitUntilUserEmail(email);
//   return listMessages()
//     .then(emailList => filterEmailId(emailList, email));
// };

/** Deletes the most recent email sent to the user. Useful for cleanup */
export const deleteEmail = email =>
  getEmailId(email)
    .then(id => deleteEmailById(id));

/** Abstract all to do with retrieving a message by id, and given the email, yield the body of the email message
 * Later, access the email body synchronously with cy.get('@emailBody')
 * @param {string} email
*/
export const getEmailBody = email => {
  getEmailId(email)
    .then(id => retrieveMessage(id));
};
