/// <reference types="cypress" />
/* eslint-disable no-undef */

describe("login", () => {
  const thresholds = {
    performance: 5,
    accessibility: 50,
    "best-practices": 50,
    seo: 50,
    pwa: 20,
  };

  const desktopConfig = {
    formFactor: "desktop",
    screenEmulation: { disabled: true },
  };

  it("should successfully log into our app", () => {
    cy.progLogin();

    cy.lighthouse(thresholds, desktopConfig);
  });
});
