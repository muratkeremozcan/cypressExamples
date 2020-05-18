/// <reference types="cypress" />
// note: responseTimeout has been set to 45 seconds (default 30) at cypress.json

import { internet } from 'faker';
import {
  createEmail, postMessageToMailService, deleteAllMessages, getEmailList,
  getUserEmail, waitUntilUserEmail, getEmailBody
} from '../support/mailosaur-helper';
const lorem = require('../fixtures/lorem-ipsum.json');

describe('Mailosaur', function () {
  const userEmail = createEmail(internet.userName());

  before('deletes all email messages at Mailosaur', function () {
    deleteAllMessages();
  });

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

  it('sends basic message to mailosaur and gets a response - can take 20secs', function () {
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
        expect(response.status).to.be.oneOf([204, 200]);
        return response.body;
      }).then(res => cy.log(res));
  });

  it('posts a message with helper function - can take 20secs', function () {
    postMessageToMailService({
      sentTo: userEmail,
      subject: 'ipsum',
      content: lorem
    }).its('status').should('be.oneOf', [204, 200]);
  });

  // https://docs.mailosaur.com/reference#list-all-messages
  it('lists messages ', function () {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('MAILOSAUR_API')}/messages?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
      headers: {
        authorization: Cypress.env('MAILOSAUR_PASSWORD')
      },
      auth: {
        user: Cypress.env('MAILOSAUR_API_KEY'),
        password: ''
      }
    });
  });

  // https://docs.mailosaur.com/reference#search-for-messages
  it('searches for messages', function () {
    // note: a message or messages exist(s) with the specified criteria in the body
    // think of the body property as a way to filter
    cy.request({
      method: 'POST',
      url: `${Cypress.env('MAILOSAUR_API')}/messages/search?server=${Cypress.env('MAILOSAUR_SERVERID')}`,
      headers: {
        authorization: Cypress.env('MAILOSAUR_PASSWORD')
      },
      auth: {
        user: Cypress.env('MAILOSAUR_API_KEY'),
        password: ''
      },
      body: {
        match: 'ALL', // or 'ANY' to match any of the specified values vs All. Think of it like a filter.
        sentTo: '',
        subject: 'sanity test from gmail',
        body: 'check the content',
      }
    });
  });

  it('sends an email using npm package (your app would normally do this) and waits until email arrives - can take 20secs', function () {
    // Cypress provides full node utility through cy.task() 
    // node-sendmail npm package allows to send an email without a SMTP server. Check it out at https://www.npmjs.com/package/sendmail
    cy.task('sendSimpleEmail', userEmail);

    // we use waitUntil plugin, because it can take up to 25 seconds for an email to occur
    // first we check that there is a list of emails, and then we check the first item on the email list; this is the newest email

    const waitUntilOptions = {
      timeout: 25000,
      interval: 1000,
      customMessage: 'wait until an email is received at Mailosaur',
      errorMsg: 'email did not occur at Mailosaur within time limit',
      verbose: true,
      customCheckMessage: 'periodically checking if email got received'
    };

    // waitUntil expects a boolean result, if the length of the email array is > 0, we return true
    cy.waitUntil(
      () => getEmailList(),
      waitUntilOptions
    );

    // waitUntil expects a boolean result, if the email we need exists, we return true
    cy.waitUntil(
      () => getUserEmail(userEmail),
      waitUntilOptions
    );
  });

  it('waits until an email (with attachment) arrives using helper function', function () {
    cy.task('sendEMailWithAttachment', userEmail);
    waitUntilUserEmail(userEmail);
  })

  
  // one can keep building the test suite with the api docs https://docs.mailosaur.com/reference and getEmailBody function
});