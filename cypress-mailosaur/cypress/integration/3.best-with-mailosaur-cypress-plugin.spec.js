/// <reference types="cypress" />

import { internet } from '@withshepherd/faker'
import { createEmail } from '../support/mailosaur-helper'
import spok from 'cy-spok'

// The beauty of the plugin
// no need to create cy.task utilities and hyberdize them. With the cypress plugin, you can just use the custom functions

describe('tests with Mailosaur Cypress plugin', () => {
  it('deletes all email messages at Mailosaur', () => {
    cy.mailosaurDeleteAllMessages(Cypress.env('MAILOSAUR_SERVERID'))
  })
  it('tests sanity with listServers & getServer', () => {
    cy.mailosaurListServers()
    cy.mailosaurGetServer(Cypress.env('MAILOSAUR_SERVERID'))
  })

  describe('email verifications', () => {
    let userEmail

    beforeEach(() => {
      userEmail = createEmail(internet.userName())
      cy.task('sendSimpleEmail', userEmail)
    })

    it('Using the complex hybrid approach for comparison: gets email from user, check with cy.task hybrid approach', () => {
      cy.task('findEmailToUser', userEmail).then((emailContent) => {
        cy.wrap(emailContent)
          .its('from')
          .its(0)
          .its('email')
          .should('contain', 'test@nodesendmail.com')
        cy.wrap(emailContent)
          .its('to')
          .its(0)
          .its('email')
          .should('eq', userEmail)
        cy.wrap(emailContent)
          .its('subject')
          .should('contain', 'MailComposer sendmail')
        // similar approach with attachments.
        // You can always end with ... .then(console.log) to take a look at the content
        // or you can check out the mailosaur email as JSON content, which makes everything easier!
        // cy.wrap(emailContent).then(console.log);

        // htmlLinks().should(..); // or chain further
        // images().should(..);

        // note that you can use different styles of api assertions with Cypress
        // check out api testing examples at
        // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__e2e-api-testing
        // https://github.com/muratkeremozcan/cypressExamples/blob/master/cypress-api-testing/cypress/integration/firstTest.spec.js
      })
    })

    it('uses the mailosaur cypress plugin to check the email content (no need for creating complex utilities with cy.task) ', () => {
      cy.mailosaurListMessages(Cypress.env('MAILOSAUR_SERVERID'))
        .its('items')
        .its('length')
        .should('not.eq', 0)

      cy.log('get message')
      cy.mailosaurGetMessage(
        Cypress.env('MAILOSAUR_SERVERID'),
        { sentTo: userEmail }
        // note from Jon at Mailosaur:
        // The get method looks for messages received within the last hour
        // if looking for emails existing before that, you have to add this. Optional otherwise
        // { receivedAfter: new Date('2000-01-01') }
      ).then((emailContent) => {
        cy.wrap(emailContent)
          .its('from')
          .its(0)
          .its('email')
          .should('contain', 'test@nodesendmail.com')
        cy.wrap(emailContent)
          .its('to')
          .its(0)
          .its('email')
          .should('eq', userEmail)
        cy.wrap(emailContent)
          .its('subject')
          .should('contain', 'MailComposer sendmail')
      })

      cy.log('alternate approach to getting message by sent to')
      cy.mailosaurGetMessagesBySentTo(
        Cypress.env('MAILOSAUR_SERVERID'),
        userEmail
      ).then((emailItem) => {
        // the response is slightly different, but you can modify it to serve the same purpose
        const emailContent = emailItem.items[0]
        cy.wrap(emailContent)
          .its('from')
          .its(0)
          .its('email')
          .should('contain', 'test@nodesendmail.com')
        cy.wrap(emailContent)
          .its('to')
          .its(0)
          .its('email')
          .should('eq', userEmail)
        cy.wrap(emailContent)
          .its('subject')
          .should('contain', 'MailComposer sendmail')
      })

      cy.mailosaurGetMessagesBySentTo(
        Cypress.env('MAILOSAUR_SERVERID'),
        userEmail
      )
        .its('items')
        .its(0)
        .its('id')
        .then((messageId) => {
          cy.log('does convenient spam analysis')
          cy.mailosaurGetSpamAnalysis(messageId).its('score').should('be.gt', 0)
        })
    })

    it.only('meta way to test emails: uses cy-spok, matches email payload and verifies the data', () => {
      cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVERID'), {
        sentTo: userEmail
      })
        .should(
          spok({
            from: [
              {
                email: 'test@nodesendmail.com'
              }
            ],
            to: [
              {
                email: userEmail
              }
            ],
            subject: 'MailComposer sendmail',
            html: {
              body: (b) => expect(b).to.include('here is some text')
            }
          })
        )
        .its('id')
        .then((messageId) => {
          cy.mailosaurGetSpamAnalysis(messageId).its('score').should('be.gt', 0)

          // clean up
          cy.mailosaurDeleteMessage(messageId)
        })
    })
  })
})

/*
Mailosaur plugin has a few more handy functions which help you abstract complex needs

full list can be found at at https://github.com/mailosaur/cypress-mailosaur

mailosaurListServers()
mailosaurCreateServer({ name })
mailosaurGetServer(serverId)
mailosaurUpdateServer(serverId, server)
mailosaurDeleteServer(serverId)
mailosaurListMessages(serverId)
mailosaurCreateMessage(serverId)
mailosaurGetMessage(serverId, criteria)
mailosaurGetMessageById(messageId)
mailosaurSearchMessages(serverId, criteria, options)
mailosaurGetMessagesBySubject(serverId, subjectSearchText)
mailosaurGetMessagesByBody(serverId, bodySearchText)
mailosaurGetMessagesBySentTo(serverId, emailAddress)
mailosaurDeleteMessage(messageId)
mailosaurDeleteAllMessages(serverId)
mailosaurDownloadAttachment(attachmentId)
mailosaurDownloadMessage(messageId)
mailosaurGetSpamAnalysis(messageId)
*/
