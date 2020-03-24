/// <reference types="cypress" />
// note: responseTimeout has been set to 45 seconds (default 30) at cypress.json

import { internet } from 'faker';
import { createEmail, postMessageToMailService, listMessages, retrieveMessage } from '../support/mailosaur-helper';
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

  it('sends basic message to mailosaur and gets a response', function () {
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

  it('posts a message with helper function', function () {
    postMessageToMailService({
      sentTo: userEmail,
      subject: 'ipsum',
      content: lorem
    }).its('status').should('eq', 204);
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

  // To get the full message content, including HTML & Text body content, you need to use the Retrieve a message endpoint.
  // https://docs.mailosaur.com/reference#retrieve-a-message
  it('retrieves a message', function () {
    // first you need a list of messages. Each message contains an id. You use the id to make the retrieve message call
    listMessages()
      .then(messages =>
        messages.map(
          message =>
            message.id
        )
      ) // an array with message id is yielded
      .then(id => 
        retrieveMessage(id)
      ) // the body of the message is yielded. Here, from the body, we can access html, links, images, attachments etc.
      .then(console.log);
  })

  // one can keep building the test suite with the api docs https://docs.mailosaur.com/reference

});