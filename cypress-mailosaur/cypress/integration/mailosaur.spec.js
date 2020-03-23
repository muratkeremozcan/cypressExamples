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
      .and('include', Cypress.env('MAILOSAUR_SERVERID'));
  });

  // not working yet
  it('sends email to mailosaur and gets a response', function () {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('MAILOSAUR_API')}/messages/await?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
      headers: {
        authorization: Cypress.env('MAILOSAUR_API_KEY')
      },
      body: {
        sentTo: userEmail,
      },
    })
    // .should(response => {
    //   expect(response.status).to.equal(200);
    //   return response.body;
    // });
  });
});