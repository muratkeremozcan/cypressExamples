/// <reference types="cypress" />
/* eslint-disable no-undef */

describe("progLogin", () => {
  it("should successfully log into our app", () => {
    cy.progLogin();

    cy.contains("Home");
  });
});
