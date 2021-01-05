/// <reference types="cypress" />
// destructuring json
import { posts } from "../../posts.json";

describe("Blog", { viewportWidth: 600, viewportHeight: 1200 }, () => {
  it("loads", () => {
    cy.visit("/");
  });

  it("has anchor tags", () => {
    cy.visit("2020/develop-preview-test");
    cy.contains("a", "#")
      .scrollIntoView()
      .should("not.have.attr", "href", "#undefined");
  });

  it("has anchor tags using cy.contains with message", () => {
    cy.visit("2020/develop-preview-test");
    cy.contains("a", "#")
      .scrollIntoView()
      .should($a => {
        const message = $a.parent().parent().text();
        expect($a, message).to.not.have.attr("href", "#undefined");
      });
  });

  it("has anchor tags using cy.get and .each", () => {
    cy.visit("2020/develop-preview-test");
    // trick - we could replace cy.contains that returns a single element with cy.get command, which returns all elements matching the selector
    cy.get("a:contains(#)").each($a => {
      const message = $a.parent().parent().text();
      expect($a, message).to.not.have.attr("href", "#undefined");
    });
  });

  context("Post", () => {
    posts.forEach(post => {
      it(`"${post.title}" has no broken # anchors`, () => {
        const year = new Date(post.date).getFullYear();
        const url = `${year}/${post.id}`;
        cy.visit(url);
        // trick - can combine .get selectors with ,
        cy.get("a:contains(#), a.src").each($a => {
          const message = $a.parent().parent().text();
          expect($a, message).to.not.have.attr("href", "#undefined");
        });
      });

      it(`"${post.title}" has no broken anchors at all`, () => {
        const year = new Date(post.date).getFullYear();
        const url = `${year}/${post.id}`;
        cy.visit(url);
        cy.get("a").each($a => {
          const message = $a.text();
          expect($a, message).to.have.attr("href").not.contain("undefined");
        });
      });
    });
  });
});
