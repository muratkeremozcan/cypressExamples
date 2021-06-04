/// <reference types="cypress" />
import { mount } from "cypress-react-unit-test";
import Page, { Book } from "../../../../pages/2020/books-people-reread";
import { RouterContext } from "next/dist/next-server/lib/router-context";

describe("Book", () => {
  it("works", () => {
    const props = {
      URL:
        "https://www.amazon.com/How-Win-Friends-Influence-People/dp/0671027034",
      ASIN: "0671027034",
      Name: "How to Win Friends & Influence People",
      Votes: 100,
    };
    mount(<Book {...props} />);
    cy.get("a").should("have.attr", "href", props.URL);
  });
});

describe("Books page", { viewportWidth: 1024, viewportHeight: 1024 }, () => {
  const books = [
    {
      URL:
        "https://www.amazon.com/How-Win-Friends-Influence-People/dp/0671027034",
      ASIN: "0671027034",
      Name: "How to Win Friends & Influence People",
      Votes: 7,
    },
    {
      URL:
        "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
      ASIN: "0735211299",
      Name: "Atomic Habits",
      Votes: 6,
    },
    {
      URL: "https://www.amazon.com/Alchemist-Paulo-Coelho/dp/0061122416",
      ASIN: "0061122416",
      Name: "The Alchemist",
      Votes: 6,
    },
    {
      URL:
        "https://www.amazon.com/Factfulness-Reasons-World-Things-Better/dp/1250107814",
      ASIN: "1250107814",
      Name: "Factfulness",
      Votes: 4,
    },
  ];
  it("renders bunch of books", () => {
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
    const props = {
      tweets: 101,
      views: 500,
      books,
    };
    mount(
      <RouterContext.Provider value={router}>
        <Page {...props} />
      </RouterContext.Provider>
    );
  });
});
