// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

describe("testin datalayer", () => {
  before(() => {
    cy.intercept("POST", "**mule/customer/clicktocall").as("clicktocall");
    // cy.visit command yields the window object
    // and cy.its command retries until the "dataLayer" property is found
    // then we check if there is a method "push" on that object
    cy.visit("/")
      .its("dataLayer")
      .should("respondTo", "push")
      .then((dataLayer) => {
        cy.spy(dataLayer, "push").as("dataL");
      });
  });
  it("wait & assert", () => {
    cy.get("lla-floating-button").click();
    cy.get("lla-click-to-call-form input").eq(0).type("111111111");
    cy.get("lla-click-to-call-form input").eq(1).type("9872819281");

    cy.get("lla-button.llad-contact-info-form__button button").click();
    cy.wait("@clicktocall");

    // The most interesting thing here is how to check if the spy function was called by the application.
    //  We have complex calls, and are only interested in the call where the first argument
    // is an object with property event: "lead".
    // Luckily, Chai-Sinon assertions included with Cypress provide a way to use a custom matcher to check the calls.

    // confirm there was a call that satisfies the custom predicate function
    const isLead = (d) => d.event === "lead";

    cy.get("@dataL").should(
      "have.been.calledWith",
      Cypress.sinon.match(isLead, "lead event")
    );

    //   cy.wait(10000);
    //   // find the index of the argument that corresponds to this event
    //   // cy.wrap('@open').should((res) => {
    //   //   const index = res.args.findIndex((i) => i[0].event == 'lead');
    //   //   cy.log(index);
    //   // });
    //   const data = cy.spy(win.dataLayer, "push").as("dataL");
    //   cy.log(data.args);
    //   cy.get("@dataL").then((res) => {
    //     cy.log(res.args);
    //   });
  });
});

// the above is too much noise
// We really need to avoid using cy.spy for calls we are not interested in.
// We can do this by constructing a "plain" Sinon.js stub function avoiding the cy.stub or cy.spy command
// to avoid logging every call.

describe("testing datalayer with less noise", () => {
  const isLead = (d) => d.event === "lead";

  before(() => {
    cy.intercept("POST", "**mule/customer/clicktocall").as("clicktocall");
    // cy.visit command yields the window object
    // and cy.its command retries until the "dataLayer" property is found
    // then we check if there is a method "push" on that object
    // https://on.cypress.io/visit
    // https://on.cypress.io/its
    // https://glebbahmutov.com/cypress-examples/commands/assertions.html
    cy.visit("/")
      .its("dataLayer")
      .should("respondTo", "push")
      .then((dataLayer) => {
        // we need to call the real method on the dataLayer object
        const realPush = dataLayer.push.bind(dataLayer);
        // and our stub function to be able to check it later
        const leadStub = cy.stub().as("lead");
        // use "plain" Sinon stub to replace dataLayer.push method
        Cypress.sinon.stub(dataLayer, "push").callsFake((...args) => {
          // if this is a lead event, call the Cypress stub
          if (isLead(args[0])) {
            leadStub(...args);
          }
          // and always call the real dataLayer.push
          return realPush(...args);
        });
      });
  });

  it("wait & assert", () => {
    cy.get("lla-floating-button").click();
    cy.get("lla-click-to-call-form input").eq(0).type("111111111");
    cy.get("lla-click-to-call-form input").eq(1).type("9872819281");

    cy.get("lla-button.llad-contact-info-form__button button").click();
    cy.wait("@clicktocall");
    // confirm the cy.stub was called
    cy.get("@lead")
      .should("have.been.calledOnce")
      // and grab its first call's arguments
      .its("firstCall.args")
      // and log them to Cypress Command Log
      .then(JSON.stringify)
      .then(cy.log);
  });
});
