/// <reference types="cypress" />
describe('process environment variables', () => {
  it('has variable my-var from cypress.json', () => {
    expect(Cypress.env('my-var')).to.equal("ok")
  })

  it('has variables FOO and BAR from process.env', () => {
    // FOO=42 BAR=baz cypress open
    // see how FOO and BAR were copied in "cypress/plugins/index.js"
    expect(Cypress.env()).to.contain({
      FOO: '42',
      BAR: 'baz'
    })
  })

  it.only('has renamed variable "ping" from "CYPRESS_ping"', () => {
    // this is from cypress:open command
    //  "cypress:run": "./node_modules/.bin/cross-env FOO=42 BAR=baz CYPRESS_ping=123 ../../node_modules/.bin/cypress run",
    expect(Cypress.env('ping')).to.equal(123)
  })
})
