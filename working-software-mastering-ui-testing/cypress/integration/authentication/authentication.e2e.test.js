/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL, SERVER_URL } from "../../../src/constants";
import {
  LOGIN_BUTTON,
  PASSWORD_PLACEHOLDER,
  SUCCESS_FEEDBACK,
  USERNAME_PLACEHOLDER
} from "../../../src/strings";

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  // the presence of database data is one of the things that make E2E tests less practical
  before(() => {
    // E2E tests need to have credible data. Always wipe the previous tests data BEFORE the test
    // because to avoid the possibility of test failure because of not-ready data
    cy.request("POST", `${SERVER_URL}/e2e-tests/wipe-data`, {
      username,
      password
    });

    //  E2E tests need to have credible data.
    cy.request("POST", `${SERVER_URL}/e2e-tests/seed-data`, {
      username,
      password
    });
  });

  beforeEach(() => {
    // just to leave more space to the Cypress test runner
    cy.viewport(300, 600);

    // cy.server() allows you to intercept (and wait for) every fronte-end AJAX request
    // @see https://docs.cypress.io/api/commands/server.html
    cy.server();

    // visit a relative url, see the `cypress.json` file where the baseUrl is set
    // @see https://docs.cypress.io/api/commands/visit.html#Syntax
    cy.visit("/");
  });

  // this is a copy of the integration test but without server stubbing.
  // Remember to write a few E2E tests and a lot of integration ones
  // @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#ui-integration-tests
  it("should work with the right credentials", () => {
    // intercepts every auth AJAX request
    cy.route({
      method: "POST",
      url: `**${AUTHENTICATE_API_URL}`
    }).as("auth-xhr");

    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible")
      .type(username);
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible")
      .type(password);
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible")
      .click();

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
      // since the integration tests already tested the front-end app, we use E2E tests to check the
      // back-end app. It needs to ensure that the back-end app works and gets the correct response
      // data
      // @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#backend-contract

      // response body assertions and status should be in the e2e tests since these rely on the server
      // https://github.com/NoriSte/ui-testing-best-practices/blob/master/sections/server-communication-testing/test-request-and-response-payload.md
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.have.property("token");
    });

    cy.getByText(SUCCESS_FEEDBACK).should("be.visible");
  });
});
