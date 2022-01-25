/// <reference types="cypress" />

import { internet } from "@withshepherd/faker";
import { createEmail } from "../support/mailosaur-helper";

// The beauty of the plugin
// no need to create cy.task utilities and hyberdize them. With the cypress plugin, you can just use the custom functions

describe("tests with Mailosaur Cypress plugin", function () {
  it("deletes all email messages at Mailosaur", function () {
    cy.mailosaurDeleteAllMessages(Cypress.env("MAILOSAUR_SERVERID"));
  });
  it("tests sanity with listServers & getServer", function () {
    cy.mailosaurListServers();
    cy.mailosaurGetServer(Cypress.env("MAILOSAUR_SERVERID"));
  });
});

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
