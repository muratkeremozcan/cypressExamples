/// <reference types="cypress" />
import { mount } from "cypress-react-unit-test";
import Header from "../../components/header";
import { RouterContext } from "next/dist/next-server/lib/router-context";

describe("header", () => {
  it("works", () => {
    const router = {
      pathname: "/",
      route: "/",
      query: {},
      asPath: "/",
      components: {},
      isFallback: false,
      basePath: "",
      events: { emit: cy.spy(), off: cy.spy(), on: cy.spy() },
      push: cy.spy(),
      replace: cy.spy(),
      reload: cy.spy(),
      back: cy.spy(),
      prefetch: cy.stub().resolves(),
      beforePopState: cy.spy(),
    };

    mount(
      <RouterContext.Provider value={router}>
        <Header
          title="7 Principles of Rich Web Applications"
          date="November 4, 2014"
          views={1001}
        />
      </RouterContext.Provider>
    ).then(() => {
      // when we mount, Next.js tries to prefetch links
      expect(router.prefetch).to.have.been.calledOnce;
    });
  });
});
