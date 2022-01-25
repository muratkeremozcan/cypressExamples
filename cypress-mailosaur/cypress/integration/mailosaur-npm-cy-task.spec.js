/// <reference types="cypress" />

import { internet } from "@withshepherd/faker";
import { createEmail, deleteAllMessages } from "../support/mailosaur-helper";

describe("tests with Mailosaur npm package and cy.task", function () {
  before("deletes all email messages at Mailosaur", function () {
    deleteAllMessages();
  });
  it("tests sanity with npm Mailosaur package", function () {
    cy.task("checkServerName").should("exist");
  });

  it("generates a random email address with mailosaur client", function () {
    cy.task("createEmail").should("include", Cypress.env("MAILOSAUR_SERVERID"));
  });
});
