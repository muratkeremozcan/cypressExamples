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


  it('sends basic email to mailosaur and gets a response', function () {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('MAILOSAUR_API')}/messages/await?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
      headers: {
        authorization: Cypress.env('MAILOSAUR_PASSWORD')
      },
      // Andy from Mailosaur: for Mailosaur, Basic Authentication is used for the authentication 
      // which requires a specific format for the authorization header.
      // Which means that you have to BASE64 encode the username and password.
      // Cypress has a method to add the auth header for you in the right way.
      // The API key needs to be passed in as the username. Password is empty.
      auth: {
        user: Cypress.env('MAILOSAUR_API_KEY'),
        password: ''
      },
      body: {
        sentTo: userEmail,
        subject: 'test'
      }
    })
    .should(response => {
      expect(response.status).to.equal(204);
      return response.body;
    }).then(res => cy.log(res));
  });
});