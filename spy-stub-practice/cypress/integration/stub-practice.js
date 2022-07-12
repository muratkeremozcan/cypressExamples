// https://docs.cypress.io/guides/guides/stubs-spies-and-clocks#Common-Scenarios
// https://sinonjs.org/releases/latest/matchers/

/*
A stub is a way to modify a function and delegate control over its behavior to you (the programmer).
// create a standalone stub (generally for use in unit test)
cy.stub()

// replace obj.method() with a stubbed function
cy.stub(obj, 'method')

// force obj.method() to return "foo"
cy.stub(obj, 'method').returns('foo')

// force obj.method() when called with "bar" argument to return "foo"
cy.stub(obj, 'method').withArgs('bar').returns('foo')

// force obj.method() to return a promise which resolves to "foo"
cy.stub(obj, 'method').resolves('foo')

// force obj.method() to return a promise rejected with an error
cy.stub(obj, 'method').rejects(new Error('foo'))


*/

describe("stub basics: onCall(), onFirstCall(), onSecondCall(), .returns(..), throws(...), invoke('restore')", () => {
  it("replace a function", () => {
    const obj = {
      foo(a, b) {
        return "a", a, "b", b;
      },
    };

    const stub = cy.stub(obj, "foo").as("fooStub");

    obj.foo("foo", "bar");

    expect(stub).to.be.calledWith("foo", "bar");

    cy.get("@fooStub").should("have.been.calledWith", "foo", "bar");
  });

  it("1:1 use with spy", () => {
    const obj = {
      foo() {},
    };

    const stub = cy.stub(obj, "foo").as("fooStub");
    obj.foo();

    expect(stub).to.be.called;
    cy.get("@fooStub").should("have.been.called");
  });

  it("return different values for different calls: .onFirstCall().returns('a')", () => {
    cy.intercept("GET", "/", { fixture: "fav-color.html" });
    cy.visit("/");

    // without the stub, we would have to type in the color to the prompt
    cy.window().then((w) => {
      cy.stub(w, "prompt")
        .onFirstCall()
        .returns("green")
        .onSecondCall()
        .returns("red")
        // after the first 2, return purple
        .returns("purple")
        .as("color-stub");
    });

    cy.get("#fav-color").click();
    cy.contains("#color-output", "green");

    cy.get("#fav-color").click();
    cy.contains("#color-output", "red");

    cy.get("#fav-color").click().click().click();
    cy.contains("#color-output", "purple");
    cy.get("@color-stub").should("have.property", "callCount", 5);
  });

  it("Return different dynamic values: s.onCall(k).returns(..) ", () => {
    cy.intercept("GET", "/", { fixture: "fav-color.html" });
    cy.visit("/");

    cy.window().then((w) => {
      const colors = ["green", "red"];

      const s = cy.stub(w, "prompt");

      colors.forEach((color, k) => s.onCall(k).returns(color));
      // after that always return purple
      s.returns("purple").as("color-stub");

      cy.get("#fav-color").click();
      cy.contains("#color-output", "green");

      cy.get("#fav-color").click();
      cy.contains("#color-output", "red");

      cy.get("#fav-color").click().click().click();
      cy.contains("#color-output", "purple");
      cy.get("@color-stub").should("have.property", "callCount", 5);
    });
  });

  it("stub application code", () => {
    // If the application is asking the user for simple information using window.prompt,
    // you can use cy.stub to respond with a test answer.
    cy.intercept("GET", "/", { fixture: "greet-by-name.html" });
    cy.visit("/");

    cy.window().then((w) => {
      cy.stub(w, "prompt").returns("Cy");
      cy.stub(w, "alert").as("alert");
    });

    cy.get("#greet-by-name").click();
    cy.get("@alert").should("have.been.calledOnceWith", "Hello Cy");
  });

  it("restore the original method, when you no longer want to use the stub", () => {
    const person = {
      getName() {
        return "Joe";
      },
    };

    expect(person.getName()).to.eq("Joe");

    cy.stub(person, "getName").returns("Cliff");
    expect(person.getName()).to.eq("Cliff");

    // restore the original method
    person.getName.restore();
    expect(person.getName()).to.eq("Joe");
  });

  it("Restore the original method from a stub alias", () => {
    const person = {
      getName() {
        return "Joe";
      },
    };

    expect(person.getName()).to.eq("Joe");

    cy.stub(person, "getName").returns("Cliff").as("getNameStub");
    expect(person.getName()).to.eq("Cliff");

    cy.get("@getNameStub")
      .should("have.been.calledOnce")
      .invoke("restore")
      .then(() => {
        expect(person.getName()).to.eq("Joe");
        // cy.wrap(person.getName()).should("eq", "Joe"); // alternative
      });
  });
});

describe("matchers: .callThrough(), withArgs(), match.type, match(predicate)", () => {
  const { match } = Cypress.sinon;

  it("Matching stub depending on arguments", () => {
    const greeter = {
      greet(name) {
        return `Hello, ${name}!`;
      },
    };

    const stub = cy.stub(greeter, "greet");

    stub.callThrough(); // if you want non-matched calls to call the real method
    stub.withArgs(match.string).returns("Hi, Joe!");
    stub.withArgs(match.number).throws(new Error("Invalid name"));

    expect(greeter.greet("World")).to.equal("Hi, Joe!");
    // expect(greeter.greet(42)).to.throw("Invalid name"); // won't work
    expect(() => greeter.greet(42)).to.throw("Invalid name");
    expect(greeter.greet).to.have.been.calledTwice;

    // non-matched calls goes the actual method
    expect(greeter.greet()).to.equal("Hello, undefined!");
  });
});

describe("Call the original method from the stub: callsFake(...), wrappedMethod()", () => {
  it("Sometimes you might want to call the original method from the stub and modify it", () => {
    const person = {
      getName() {
        return "Joe";
      },
    };

    cy.stub(person, "getName").callsFake(() => {
      // call the real person.getName()
      return (
        person.getName
          .wrappedMethod()
          // but then reverse the returned string
          .split("")
          .reverse()
          .join("")
      );
    });

    expect(person.getName()).to.eq("eoJ");
  });
});

describe("cy.clock", () => {
  it("control the time in the browser", () => {
    // When running Cypress tests, the tests themselves are outside the application's iframe.
    // When you use cy.clock() command you change the application clock, and not the spec's clock.

    const specNow = new Date();
    const now = new Date(Date.UTC(2017, 2, 14)).getTime();

    cy.clock(now) // sets the application clock and pause time
      .then(() => {
        // spec clock keeps ticking
        const specNow2 = new Date();
        // confirm by comparing the timestamps in milliseconds
        expect(+specNow2, "spec timestamps").to.be.greaterThan(+specNow);
      });
    // but the application's time is frozen
    cy.window()
      .its("Date")
      .then((appDate) => {
        const appNow = new appDate();
        expect(+appNow, "application timestamps")
          .to.equal(+now)
          .and.to.equal(1489449600000); // the timestamp in milliseconds
      });
    // we can advance the application clock by 5 seconds
    cy.tick(5000);
    cy.window()
      .its("Date")
      .then((appDate) => {
        const appNow = new appDate();
        expect(+appNow, "timestamp after 5 synthetic seconds").to.equal(
          1489449605000
        );
      })
      // meanwhile the spec clock only advanced by probably less than 200ms
      .then(() => {
        const specNow3 = new Date();
        expect(+specNow3, "elapsed on the spec clock").to.be.lessThan(
          +specNow + 200
        );
      });
  });
});

describe.only("geoLocation", () => {
  // https://glebbahmutov.com/cypress-examples/9.7.0/recipes/stub-geolocation.html#sinon-js-callsfake
  /*
    https://www.youtube.com/watch?v=zR6o_tdJKDk&t=59s
    withArgs : controls when the stub is used
    callsArg : CallsArg is the response like calling the callback argument to the stub
    callsArgWith : Like callsArg, but with arguments to pass to the callback.
  */
  beforeEach(() => {
    cy.intercept("GET", "/", { fixture: "geoLocation.html" });
    cy.visit("/");
  });

  it("sinon callsFake", () => {
    // simulate the browser API calling
    // the "onError" callback function
    // passed by the app to geolocation.getCurrentPosition
    const error = new Error("Test geo error");

    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, "getCurrentPosition")
        // our stub just calls the "onError" argument
        .callsFake((onSuccess, onError) => {
          onError(error);
        })
        .as("getCurrentPosition");
    });
    cy.get("#locate").click();
    // confirm the application behaves as it should
    cy.contains("#message", error.message);
    // and the stub was actually used
    cy.get("@getCurrentPosition").should("have.been.calledOnce");
  });

  it("sinon callsArgWit", () => {
    const error = new Error("Test geo error");

    cy.window().then((win) => {
      // instead of implementing a function "callsFake"
      // we can simply say "stub calls the argument at index 1"
      // with the given argument "error"
      cy.stub(win.navigator.geolocation, "getCurrentPosition")
        .callsArgWith(1, error)
        .as("getCurrentPosition");
    });
    cy.get("#locate").click();
    // confirm the application behaves as it should
    cy.contains("#message", error.message);
    // and the stub was actually used
    cy.get("@getCurrentPosition").should("have.been.calledOnce");
  });
});
