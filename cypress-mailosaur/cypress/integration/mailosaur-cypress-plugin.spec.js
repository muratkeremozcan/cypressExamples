/// <reference types="cypress" />

import { internet } from 'faker';
import { createEmail, deleteAllMessages } from '../support/mailosaur-helper';

const sendEmailFromRandomUser = () => {
  const userEmail = createEmail(internet.userName());
  return  cy.task('sendSimpleEmail', userEmail);
}

describe('tests with Mailosaur Cypress plugin', function () {
  it.skip('deletes all email messages at Mailosaur', function () {
    cy.mailosaurDeleteAllMessages(Cypress.env('MAILOSAUR_SERVERID'));
  });
  it('tests sanity with listServers & getServer', function () {
    cy.mailosaurListServers();
    cy.mailosaurGetServer(Cypress.env('MAILOSAUR_SERVERID'));
  });
  it('gets email from user, check with listMessages', function () {
    const userEmail = createEmail(internet.userName());
    cy.task('sendSimpleEmail', userEmail);
    // will work if you did not clean up emails in the beginning, otherwise it does not wait for emails
    cy.mailosaurListMessages(Cypress.env('MAILOSAUR_SERVERID')).its('items').its('length',).should('not.eq', 0);
  });
  it('gets email from user, check with getMessage', function () {
    // const userEmail = createEmail(internet.userName());
    // cy.task('sendSimpleEmail', 'userEmail');
    
    cy.mailosaurGetMessage(
      Cypress.env('MAILOSAUR_SERVERID'), 
      { to: 'Trenton60.x4be6xxf@mailosaur.io' }
    );
  });
  // it('gets email from user, check with getMessagesBySentTo', function () {
  //   const userEmail = createEmail(internet.userName());
  //   cy.task('sendSimpleEmail', userEmail)
  //   // can't get this to work
  //   cy.mailosaurGetMessagesBySentTo(
  //     Cypress.env('MAILOSAUR_SERVERID'), 
  //     userEmail
  //   ).its('items').should('have.length', 1);
  // });

});

/**
mailosaurSearchMessages(serverId, criteria, options)
mailosaurGetMessagesBySubject(serverId, subjectSearchText)
mailosaurGetMessagesByBody(serverId, bodySearchText)
mailosaurGetMessagesBySentTo(serverId, emailAddress)
mailosaurDownloadAttachment(attachmentId)
mailosaurDownloadMessage(messageId)
mailosaurGetSpamAnalysis(messageId)
*/