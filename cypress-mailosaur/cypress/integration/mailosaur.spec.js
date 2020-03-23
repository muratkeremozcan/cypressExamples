/// <reference types="cypress" />

import { internet } from 'faker';
import { createEmail } from '../support/mailosaur-helper';

describe('Mailosaur', function () {
  const userEmail = createEmail(internet.userName());

  it('succeeds basic GET', function () {
    cy.request({
      method: 'GET',
      url: 'https://mailosaur.com/',
    }).then(response => {
      expect(response.status).to.equal(200);
      return response.body;
    });
  });

  it('checks created random email', function () {
    cy.wrap(userEmail).should('exist')
      .and('include', Cypress.env('MAILOSAUR_USERNAME'));
  });

  // not working yet
  it.skip('sends email to mailosaur and gets a response', function () {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('MAILOSAUR_API_URL')}/messages/await?server=${Cypress.env('MAILOSAUR_SERVERNAME')}`,
      body: {
        sentTo: userEmail,
        timeout: 10000
      },
      headers: {
        authorization: Cypress.env('MAILOSAUR_API_KEY')
      }
    })
    .should(response => {
      expect(response.status).to.equal(200);
      return response.body;
    });
  });
});