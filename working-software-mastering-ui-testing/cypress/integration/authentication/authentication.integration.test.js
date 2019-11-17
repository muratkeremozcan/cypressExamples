/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL } from "../../../src/constants";
// all the app strings are imported, they allow us to test the front-end app like the user is going
// to consume it (through contents, not through selectors)
// @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#test-through-contents
// @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#frontend-contants
import {
  GENERIC_ERROR,
  LOADING,
  LOGIN_BUTTON,
  LONG_WAITING,
  PASSWORD_PLACEHOLDER,
  SUCCESS_FEEDBACK,
  UNAUTHORIZED_ERROR,
  USERNAME_PLACEHOLDER
} from "../../../src/strings";

context("Authentication", () => {
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

  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  it("should work with the right credentials", () => {
    // intercepts every auth AJAX request and responds with the content of the
    // authentication-success.json fixture. This is called server stubbing
    cy.route({
      method: "POST",
      response: "fixture:authentication/authentication-success.json",
      url: `**${AUTHENTICATE_API_URL}`
    }).as("auth-xhr");

    // retrieves the elements to interact with by contents, the same way the user would do so
    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      // in case of failures, a lot of assertions drive you directly to the exact problem that
      // occured, making test debugging useless
      // @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#assert-frequently
      .should("be.visible")
      .type(username);
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible") // assertions FTW
      .type(password);
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible") // assertions FTW
      .click();

    // the AJAX request is a deterministic event, it MUST happen for the front-end app to work!
    // Asserting on deterministic events make your test more robust
    // @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#deterministic-events
    cy.wait("@auth-xhr").then(xhr => {
      // a lot of times the front-end app does not work because of wrong communication with the
      // back-end app, always assert on the request payload
      // @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#backend-contract
      // assert the payload body
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
      // assert the request headers
      expect(xhr.request.headers).to.have.property('Content-Type', 'application/json;charset=utf-8');
    });

    // finally, the user must see the feedback
    cy.getByText(SUCCESS_FEEDBACK).should("be.visible");
  });

  // from now on, it will use a shared function to fill the form.
  // Remember always to add simple abstractions because, test by test, you always need to slightly
  // change the behavior to test every flow.
  const fillFormAndClick = ({ username, password }) => {
    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible") // assertions FTW
      .type(username);
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible") // assertions FTW
      .type(password);
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible") // assertions FTW
      .click();
  };

  it("should alert the user it the login lasts long", () => {
    // it allows you to manage manually the front-end clock, see the `cy.tick` call
    cy.clock();

    cy.route({
      method: "POST",
      // the response is not useful for this test, it has to test the long-awaiting feedback, not
      // the feedback after the AJAX call completion
      response: {},
      url: `**${AUTHENTICATE_API_URL}`,
      // adds a super-long delay to the AJAX response
      delay: 5000
    }).as("auth-xhr");

    fillFormAndClick({ username, password });

    // moves forward the front-end clock, it allows to manage to force `setTimeout` to happen in a while
    cy.tick(1000);

    cy.getByText(LOADING).should("be.visible");
    cy.getByText(LONG_WAITING).should("be.visible");
  });

  it("should alert the user it the credentials are wrong", () => {
    // intercepts every auth AJAX request and responds with a 401 status
    cy.route({
      method: "POST",
      response: {},
      url: `**${AUTHENTICATE_API_URL}`,
      status: 401
    }).as("auth-xhr");

    fillFormAndClick({ username, password });

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    cy.getByText(UNAUTHORIZED_ERROR).should("be.visible");
  });

  it("should alert the user it the server does not work", () => {
    // intercepts every auth AJAX request and responds with a 500 status
    cy.route({
      method: "POST",
      response: {},
      url: `**${AUTHENTICATE_API_URL}`,
      status: 500
    }).as("auth-xhr");

    fillFormAndClick({ username, password });
    cy.getByText(LOGIN_BUTTON).click();

    cy.getByText(GENERIC_ERROR).should("be.visible");
  });

  // Other tests must not waste time with authentication, always allows them to authenticate as fast
  // as they can, they will save precious seconds at every run.
  // @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#test-shortcuts
  it("should expose a shortcut for fast authentication", () => {
    cy.route({
      method: "POST",
      response: "fixture:authentication/authentication-success.json",
      url: `**${AUTHENTICATE_API_URL}`
    }).as("auth-xhr");

    cy.window().invoke("cypressShortcuts.authenticate", username, password);

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });
  });
});
