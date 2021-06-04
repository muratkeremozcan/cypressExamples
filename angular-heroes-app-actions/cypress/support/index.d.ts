declare namespace Cypress {
  interface Chainable {
    getHeroesComponent(): Chainable<any>
  }
}
