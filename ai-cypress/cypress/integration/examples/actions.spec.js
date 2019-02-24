/// <reference types="Cypress" />

context("Actions", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  afterEach(() => {
    cy.eyesClose();
  });

  // https://on.cypress.io/interacting-with-elements

  it(".type() - type into a DOM element", () => {
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".type() - type into a DOM element"
    });
    // https://on.cypress.io/type

    cy.get(".action-email")
      .type("fake@email.com")
      .should("have.value", "fake@email.com")

      // .type() with special character sequences
      .type("{leftarrow}{rightarrow}{uparrow}{downarrow}")
      .type("{del}{selectall}{backspace}")

      // .type() with key modifiers
      .type("{alt}{option}") //these are equivalent
      .type("{ctrl}{control}") //these are equivalent
      .type("{meta}{command}{cmd}") //these are equivalent
      .type("{shift}")

      // Delay each keypress by 0.1 sec
      .type("slow.typing@email.com", { delay: 100 })
      .should("have.value", "slow.typing@email.com");

    cy.eyesCheckWindow({
      tag: "Step1",
      sizeMode: "selector",
      selector: ".action-email"
    });

    cy.get(".action-disabled")
      // Ignore error checking prior to type
      // like whether the input is visible or disabled
      .type("disabled error checking", { force: true })
      .should("have.value", "disabled error checking");

    cy.eyesCheckWindow({
      tag: "Step2",
      sizeMode: "selector",
      selector: ".action-disabled"
    });
  });

  it(".focus() - focus on a DOM element", () => {
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".focus() - focus on a DOM element"
    });
    // https://on.cypress.io/focus
    cy.get(".action-focus")
      .focus()
      .should("have.class", "focus")
      .prev()
      .should("have.attr", "style", "color: orange;");

    cy.eyesCheckWindow({
      tag: ".focus() - focus on a DOM element",
      sizeMode: "selector",
      selector: ".action-focus"
    });
  });

  it(".blur() - blur off a DOM element", () => {
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".blur() - blur off a DOM element"
    });
    // https://on.cypress.io/blur
    cy.get(".action-blur")
      .type("About to blur")
      .blur()
      .should("have.class", "error")
      .prev()
      .should("have.attr", "style", "color: red;");

    cy.eyesCheckWindow({
      tag: ".blur() - blur off a DOM element",
      sizeMode: "selector",
      selector: ".action-blur"
    });
  });

  it(".clear() - clears an input or textarea element", () => {
    // https://on.cypress.io/clear
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".clear() - clears an input or textarea element"
    });

    cy.get(".action-clear")
      .type("Clear this text")
      .should("have.value", "Clear this text")
      .clear()
      .should("have.value", "");

    cy.eyesCheckWindow({
      tag: ".clear() - clears an input or textarea element",
      sizeMode: "selector",
      selector: ".action-blur"
    });
  });

  it(".submit() - submit a form", () => {
    // https://on.cypress.io/submit
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".submit() - submit a form"
    });

    cy.get(".action-form")
      .find('[type="text"]')
      .type("HALFOFF");

    cy.get(".action-form")
      .submit()
      .next()
      .should("contain", "Your form has been submitted!");

    cy.eyesCheckWindow({
      tag: ".submit() - submit a form",
      sizeMode: "selector",
      selector: ".action-form"
    });
  });

  it(".click() - click on a DOM element", () => {
    // https://on.cypress.io/click
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".click() - click on a DOM element"
    });

    cy.get(".action-btn").click();

    // You can click on 9 specific positions of an element:
    //  -----------------------------------
    // | topLeft        top       topRight |
    // |                                   |
    // |                                   |
    // |                                   |
    // | left          center        right |
    // |                                   |
    // |                                   |
    // |                                   |
    // | bottomLeft   bottom   bottomRight |
    //  -----------------------------------

    // clicking in the center of the element is the default
    cy.get("#action-canvas").click();

    cy.get("#action-canvas").click("topLeft");
    cy.get("#action-canvas").click("top");
    cy.get("#action-canvas").click("topRight");
    cy.get("#action-canvas").click("left");
    cy.get("#action-canvas").click("right");
    cy.get("#action-canvas").click("bottomLeft");
    cy.get("#action-canvas").click("bottom");
    cy.get("#action-canvas").click("bottomRight");

    // .click() accepts an x and y coordinate
    // that controls where the click occurs :)

    cy.get("#action-canvas")
      .click(80, 75) // click 80px on x coord and 75px on y coord
      .click(170, 75)
      .click(80, 165)
      .click(100, 185)
      .click(125, 190)
      .click(150, 185)
      .click(170, 165);

    // click multiple elements by passing multiple: true
    cy.get(".action-labels>.label").click({ multiple: true });

    // Ignore error checking prior to clicking
    cy.get(".action-opacity>.btn").click({ force: true });

    cy.eyesCheckWindow({
      tag: ".click() - click on a DOM element",
      sizeMode: "selector",
      selector: "#action-canvas"
    });
  });

  it(".dblclick() - double click on a DOM element", () => {
    // https://on.cypress.io/dblclick
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".dblclick() - double click on a DOM element"
    });

    // Our app has a listener on 'dblclick' event in our 'scripts.js'
    // that hides the div and shows an input on double click
    cy.get(".action-div")
      .dblclick()
      .should("not.be.visible");
    cy.get(".action-input-hidden").should("be.visible");

    cy.eyesCheckWindow({
      tag: ".dblclick() - double click on a DOM element",
      sizeMode: "selector",
      selector: ".action-div"
    });
  });

  it(".check() - check a checkbox or radio element", () => {
    // https://on.cypress.io/check
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".check() - check a checkbox or radio element"
    });

    // By default, .check() will check all
    // matching checkbox or radio elements in succession, one after another
    cy.get('.action-checkboxes [type="checkbox"]')
      .not("[disabled]")
      .check()
      .should("be.checked");

    cy.get('.action-radios [type="radio"]')
      .not("[disabled]")
      .check()
      .should("be.checked");

    // .check() accepts a value argument
    cy.get('.action-radios [type="radio"]')
      .check("radio1")
      .should("be.checked");

    // .check() accepts an array of values
    cy.get('.action-multiple-checkboxes [type="checkbox"]')
      .check(["checkbox1", "checkbox2"])
      .should("be.checked");

    // Ignore error checking prior to checking
    cy.get(".action-checkboxes [disabled]")
      .check({ force: true })
      .should("be.checked");

    cy.get('.action-radios [type="radio"]')
      .check("radio3", { force: true })
      .should("be.checked");

    cy.eyesCheckWindow(".check() - check a checkbox or radio element");
  });

  it(".uncheck() - uncheck a checkbox element", () => {
    // https://on.cypress.io/uncheck
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".uncheck() - uncheck a checkbox element"
    });

    // By default, .uncheck() will uncheck all matching
    // checkbox elements in succession, one after another
    cy.get('.action-check [type="checkbox"]')
      .not("[disabled]")
      .uncheck()
      .should("not.be.checked");

    // .uncheck() accepts a value argument
    cy.get('.action-check [type="checkbox"]')
      .check("checkbox1")
      .uncheck("checkbox1")
      .should("not.be.checked");

    // .uncheck() accepts an array of values
    cy.get('.action-check [type="checkbox"]')
      .check(["checkbox1", "checkbox3"])
      .uncheck(["checkbox1", "checkbox3"])
      .should("not.be.checked");

    // Ignore error checking prior to unchecking
    cy.get(".action-check [disabled]")
      .uncheck({ force: true })
      .should("not.be.checked");

    cy.eyesCheckWindow(".uncheck() - uncheck a checkbox element");
  });

  it(".select() - select an option in a <select> element", () => {
    // https://on.cypress.io/select

    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".select() - select an option in a <select> element"
    });

    // Select option(s) with matching text content
    cy.get(".action-select").select("apples");

    cy.get(".action-select-multiple").select(["apples", "oranges", "bananas"]);

    // Select option(s) with matching value
    cy.get(".action-select").select("fr-bananas");

    cy.get(".action-select-multiple").select([
      "fr-apples",
      "fr-oranges",
      "fr-bananas"
    ]);

    cy.eyesCheckWindow({
      tag: ".select() - select an option in a <select> element",
      sizeMode: "selector",
      selector: ".action-select"
    });

    cy.eyesCheckWindow({
      tag: ".select() - select an option in a <select> element",
      sizeMode: "selector",
      selector: ".action-select-multiple"
    });
  });

  it(".scrollIntoView() - scroll an element into view", () => {
    // https://on.cypress.io/scrollintoview
    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: ".scrollIntoView() - scroll an element into view"
    });
    // normally all of these buttons are hidden,
    // because they're not within
    // the viewable area of their parent
    // (we need to scroll to see them)
    cy.get("#scroll-horizontal button").should("not.be.visible");

    cy.eyesCheckWindow({
      tag: ".scrollIntoView() - scroll an element into view",
      sizeMode: "selector",
      selector: "#scroll-horizontal button"
    });
    // scroll the button into view, as if the user had scrolled
    cy.get("#scroll-horizontal button")
      .scrollIntoView()
      .should("be.visible");

    cy.eyesCheckWindow({
      tag: ".scrollIntoView() - scroll an element into view",
      sizeMode: "selector",
      selector: "#scroll-horizontal button"
    });
    cy.get("#scroll-vertical button").should("not.be.visible");

    // Cypress handles the scroll direction needed
    cy.get("#scroll-vertical button")
      .scrollIntoView()
      .should("be.visible");

    cy.eyesCheckWindow({
      tag: ".scrollIntoView() - scroll an element into view",
      sizeMode: "selector",
      selector: "#scroll-vertical button"
    });

    cy.get("#scroll-both button").should("not.be.visible");

    cy.eyesCheckWindow({
      tag: ".scrollIntoView() - scroll an element into view",
      sizeMode: "selector",
      selector: "#scroll-both button"
    });

    // Cypress knows to scroll to the right and down
    cy.get("#scroll-both button")
      .scrollIntoView()
      .should("be.visible");

    cy.eyesCheckWindow({
      tag: ".scrollIntoView() - scroll an element into view",
      sizeMode: "selector",
      selector: "#scroll-both button"
    });
  });

  it("cy.scrollTo() - scroll the window or element to a position", () => {
    // https://on.cypress.io/scrollTo

    cy.eyesOpen({
      //baselineEnvName: "CrossBrowser",
      browser: [{ width: 1024, height: 768, name: "chrome" }],

      batchName: "actions.spec",
      appName: "Cypress Example app",
      testName: "cy.scrollTo() - scroll the window or element to a position"
    });

    // You can scroll to 9 specific positions of an element:
    //  -----------------------------------
    // | topLeft        top       topRight |
    // |                                   |
    // |                                   |
    // |                                   |
    // | left          center        right |
    // |                                   |
    // |                                   |
    // |                                   |
    // | bottomLeft   bottom   bottomRight |
    //  -----------------------------------

    // if you chain .scrollTo() off of cy, we will
    // scroll the entire window
    cy.scrollTo("bottom");

    cy.get("#scrollable-horizontal").scrollTo("right");

    // or you can scroll to a specific coordinate:
    // (x axis, y axis) in pixels
    cy.get("#scrollable-vertical").scrollTo(250, 250);

    cy.eyesCheckWindow({
      tag: "cy.scrollTo() - scroll the window or element to a position",
      sizeMode: "region",
      region: { top: 0, left: 0, width: 250, height: 250 }
    });

    // or you can scroll to a specific percentage
    // of the (width, height) of the element
    cy.get("#scrollable-both").scrollTo("75%", "25%");

    // control the easing of the scroll (default is 'swing')
    cy.get("#scrollable-vertical").scrollTo("center", { easing: "linear" });

    // control the duration of the scroll (in ms)
    cy.get("#scrollable-both").scrollTo("center", { duration: 2000 });
  });
});
