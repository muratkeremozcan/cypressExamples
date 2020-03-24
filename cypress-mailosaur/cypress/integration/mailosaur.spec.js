/// <reference types="cypress" />
// note: responseTimeout has been set to 45 seconds (default 30) at cypress.json

import { internet } from 'faker';
import { createEmail, getEmailFromMailService } from '../support/mailosaur-helper';
const lorem = require('../fixtures/lorem-ipsum.json');

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
        to: 'nobody',
      }
    })
      .should(response => {
        expect(response.status).to.equal(204);
        return response.body;
      }).then(res => cy.log(res));
  });

  it.only('sends email with helper function', function () {
    getEmailFromMailService({
      sentTo: userEmail,
      subject: 'ipsum',
      content: lorem
    }).its('status').should('eq', 204);
  });
});