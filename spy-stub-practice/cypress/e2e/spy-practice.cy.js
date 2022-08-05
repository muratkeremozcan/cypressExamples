// https://docs.cypress.io/guides/guides/stubs-spies-and-clocks#Common-Scenarios
/*

A spy does not modify the behavior of the function - it is left perfectly intact.
A spy is most useful when you are testing the contract between multiple functions
and you don't care about the side effects the real function may create (if any).

cy.spy(obj, 'method')

*/

describe("spy basics and call arguments: called, calledOnce, calledWith, calledWithExactly, calledOnceWith etc.", () => {
  it("basic", () => {
    const obj = {
      foo() {
        return "yo";
      },
    };
    // spies and stubs are synchronous
    const spy = cy.spy(obj, "foo").as("fooSpy");

    obj.foo();

    // assert against the spy directly
    expect(spy).to.be.called;
    // or get the spy via its reference
    cy.get("@fooSpy").should("have.been.called");
  });

  it("spies can retry with the Cypress api", () => {
    const obj2 = {
      foo() {
        return "yo";
      },
    };

    cy.spy(obj2, "foo").as("foo");

    setTimeout(() => {
      return obj2.foo();
    }, 50);

    setTimeout(() => {
      return obj2.foo();
    }, 100);

    cy.get("@foo").should("have.been.calledTwice");
  });

  it("checking the call arguments: called, calledOnce, calledWith, calledWithExactly, calledOnceWith ", () => {
    const person = {
      setName(first, last) {
        this.name = first + " " + last;
      },
    };

    cy.spy(person, "setName").as("setName");

    // simulate the application calling the method after some random delay
    setTimeout(() => {
      return person.setName("John", "Doe");
    }, Math.random() * 100);

    // check if the spy was called
    cy.get("@setName").should("have.been.called");
    // called once
    cy.get("@setName").should("have.been.calledOnce");
    // called with specific arguments
    cy.get("@setName").should("have.been.calledWith", "John");
    cy.get("@setName").should("have.been.calledWith", "John", "Doe");
    cy.get("@setName").should("have.been.calledWithExactly", "John", "Doe");
    cy.get("@setName").should("have.been.calledOnceWith", "John", "Doe");
    // check if the spy was called once with a string and "Doe"
    cy.get("@setName").should(
      "have.been.calledWith",
      Cypress.sinon.match.string,
      "Doe"
    );
    cy.get("@setName").should(
      "have.been.calledWith",
      "John",
      Cypress.sinon.match.string
    );

    // verify the property was set
    cy.wrap(person).should("have.property", "name", "John Doe");
  });
});

describe("matchers: match.type, match(predicate, 'optional-message'), match.in([...])", () => {
  // shorten it
  const { match } = Cypress.sinon;

  it("call args with sinon matchers", () => {
    const calculator = {
      add(a, b) {
        return a + b;
      },
    };
    const spy = cy.spy(calculator, "add").as("add");

    calculator.add(2, 3);

    // if we want to assert the exact values used during the call
    expect(spy).to.be.calledWith(2, 3);
    // confirm that the method was called with two numbers
    expect(spy).to.be.calledWith(match.number, match.number);
    // alternatively, provide the value to match
    expect(spy).to.be.calledWith(match(2), match(3));
    // match any value
    expect(spy).to.be.calledWith(match.any, 3);
    // match any value from a list
    expect(spy).to.be.calledWith(match.in([1, 2, 4, 5]), 3);

    ////////
    const isEven = (x) => x % 2 === 0;
    const isOdd = (x) => x % 2 === 1;

    // expect the value to pass a custom predicate function
    // the second argument to "match(predicate, message)" is shown if the predicate does not pass and assertion fails
    expect(spy).to.be.calledWith(match(isEven), match(isOdd, "is odd"));

    ////////
    const isGreaterThan = (limit) => (x) => x > limit;
    const isLessThan = (limit) => (x) => x < limit;

    cy.log(isGreaterThan(2)(3)); // 3 is gt 2
    cy.log(isLessThan(4)(3)); // 3 is lt 4

    // combined matchers
    expect(spy).to.be.calledWith(
      match.number, // 2
      Cypress.sinon
        .match(isGreaterThan(2), "> 2") // 3
        .and(match(isLessThan(4), "< 4")) // 3
    );

    expect(spy).to.be.calledWith(
      match.number,
      match(isLessThan(200), "< 200").and(match(3))
    );

    // BDD style assertions
    cy.get("@add").should("have.been.calledWith", match.number, match(3));
  });
});

describe("call count & promises: have.been.calledThrice, its('callCount).should('eq', 4), invoke('resetHistory'), for promises: .its('returnValues')", () => {
  it("access properties with its", () => {
    cy.intercept("GET", "/", { fixture: "greeting.html" });
    cy.visit("/");

    // spy on console.log
    cy.window()
      .its("console")
      .then((console) => cy.spy(console, "log"))
      .as("log");

    // act on the UI
    cy.get("#greet").click().click().click();

    // assert that the spy was called 3 times
    cy.get("@log").should("have.been.calledThrice");
    cy.get("@log").its("callCount").should("eq", 3);

    // reset call count
    cy.get("@log").invoke("resetHistory");
    cy.get("#greet").click();
    cy.get("@log").should("have.been.calledOnceWith", "Happy Testing!");
  });

  it("call count 2nd example", () => {
    // test subject
    const person = {
      age: 0,
      birthday() {
        this.age += 1;
      },
    };

    // spy on the subject's method
    cy.spy(person, "birthday").as("birthday");
    cy.wrap(person)
      .its("age")
      .should("equal", 0)
      .then(() => {
        // the application calls the method twice
        person.birthday();
        person.birthday();
      });
    // verify the spy recorded two calls
    cy.get("@birthday").should("have.been.calledTwice");
    cy.wrap(person)
      .its("age")
      .should("equal", 2)
      .then(() => {
        // and call the app some more
        person.birthday();
        person.birthday();
      });
    cy.get("@birthday").its("callCount").should("equal", 4);

    cy.log("**reset history**");
    cy.get("@birthday").invoke("resetHistory");
    // the spy call count and the history have been cleared
    cy.get("@birthday").its("callCount").should("equal", 0);
    cy.get("@birthday").should("not.have.been.called");
  });

  it("resolved value (promises)", () => {
    const calc = {
      async add(a, b) {
        return /* await */ Cypress.Promise.resolve(a + b).delay(100); // don't use await redundantly
      },
    };

    cy.spy(calc, "add").as("add");
    // wait for the promise to resolve then confirm its resolved value
    cy.wrap(calc.add(4, 5)).should("equal", 9);
    // make a few more calls
    cy.wrap(calc.add(1, 90)).should("equal", 91);
    cy.wrap(calc.add(-5, -8)).should("equal", -13);

    // example of confirming one of the calls used add(4, 5)
    cy.get("@add").should("have.been.calledWith", 4, 5);
    cy.get("@add").should("have.been.calledWith", 1, 90);
    cy.get("@add").should("have.been.calledWith", -5, -8);

    // now let's confirm the resolved values
    // first we need to wait for all promises to resolve
    cy.get("@add")
      .its("returnValues")
      // yields N promises, let's wait for them to resolve
      // in this test they should be resolved already since we used cy.wrap() individually
      // .then(Promise.all.bind(Promise))
      // alternative to avoid wrong 'this' value
      .then((ps) => Promise.all(ps))
      .should("deep.equal", [9, 91, -13]);
  });

  it("call the spy from the test", () => {
    // When spying on the object's method typically you call the method.
    // If you do call the created spy function, it does not have the this pointing at the original object.
    // You can bind the this to point to the object by using .bind method.

    const testRunner = {
      name: "Cypress",
      getName() {
        return this.name;
      },
    };

    const getNameSpy = cy.spy(testRunner, "getName");

    // the created spy is just a function
    expect(getNameSpy).to.be.a("function");

    // call the object's method
    expect(testRunner.getName()).to.equal("Cypress");
    expect(getNameSpy).to.be.calledOnce;

    // call the spy directly
    expect(getNameSpy.call(testRunner)).to.equal("Cypress");
    expect(getNameSpy).to.be.calledTwice;
  });
});

describe("spy on application code", () => {
  it("stub and spy are exchangeable here", () => {
    cy.intercept("GET", "/", { fixture: "alert-me.html" });
    cy.visit("/");

    cy.window()
      .its("actions")
      // .then((actions) => cy.stub(actions, "alertTheUser").as("alerted"));
      .then((actions) => cy.spy(actions, "alertTheUser").as("alerted"));

    cy.get("#alerter").click();
    cy.get("@alerted").should("have.been.called");
  });

  it("also here", () => {
    cy.intercept("GET", "/", { fixture: "click-me.html" });
    cy.visit("/");

    // cy.window().then((w) => cy.stub(w, "alert").as("alert"));
    cy.window().then((w) => cy.spy(w, "alert").as("alert"));

    cy.get("#sayhi").click();
    cy.get("@alert").should("have.been.calledOnceWith", "Hello there!");

    // the application can trigger the alert several times
    cy.get("#sayhi").click().click();
    // we can confirm the total number of calls
    cy.get("@alert").its("callCount").should("equal", 3);
  });
});

describe("Check the order of calls: toHaveBeenCalledBefore", () => {
  it("you can check if one stub was called before or after another stub", () => {
    const cart = {
      init() {
        return "initialized";
      },
      finalize() {
        return "finalized";
      },
      execute() {
        this.init();
        this.finalize();
      },
    };

    cy.spy(cart, "init");
    cy.spy(cart, "finalize");
    cart.execute();

    expect(cart.init).to.have.been.calledBefore(cart.finalize);
  });
});
