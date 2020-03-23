import { internet } from 'faker';
import { createEmail } from '../support/mailosaur-helper';

describe('Mailosaur', function () {
  it('succeeds basic GET', function () {
    cy.request({
      method: 'GET',
      url: 'https://mailosaur.com/',
    }).then(response => {
      expect(response.status).to.equal(200);
      return response.body;
    });
  });

  it('creates random email', function () {
    cy.log(createEmail(internet.userName()));
  });

  it('sends email to mailosaur and gets a response', function () {
    // cy.request({
    //   method: 'POST',
    //   url: `https://mailosaur.com/api/messages/await?server=${Cypress.env('MAILOSAUR_SERVERNAME')}`,
    //   body: query,
    //   headers: { 'Content-Type': 'application/json' },
    //   auth: { user: Cypress.env('MAILOSAUR_API_KEY') }
    // })
    // .then(response => {
    //   expect(response.status).to.equal(200);
    //   return response.body;
    // });

  });
});