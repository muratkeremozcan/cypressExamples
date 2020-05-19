/// <reference types="cypress" />

import { internet } from 'faker';
import { createEmail } from '../support/mailosaur-helper';


describe('tests with Mailosaur Cypress plugin', function () {
  it('deletes all email messages at Mailosaur', function () {
    cy.mailosaurDeleteAllMessages(Cypress.env('MAILOSAUR_SERVERID'));
  });
  it('tests sanity with listServers & getServer', function () {
    cy.mailosaurListServers();
    cy.mailosaurGetServer(Cypress.env('MAILOSAUR_SERVERID'));
  });
  it('gets email from user, check with listMessages', function () {
    const userEmail = createEmail(internet.userName());
    cy.task('sendSimpleEmail', userEmail);

    cy.mailosaurGetMessage(
      Cypress.env('MAILOSAUR_SERVERID'),
      { sentTo: userEmail },
      // note from Jon at Mailosaur: 
      // The get method looks for messages received within the last hour
      // if looking for emails existing before that, you have to add this. Optional otherwise
      // { receivedAfter: new Date('2000-01-01') } 
    );
    cy.mailosaurListMessages(Cypress.env('MAILOSAUR_SERVERID')).its('items').its('length').should('not.eq', 0);

  });
});
