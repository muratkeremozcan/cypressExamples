import { ApplicationRef } from '@angular/core'
import { Hero } from "app/hero"

it('Returns deleted hero after reload', () => {
  cy.visit('/heroes')
  cy.get('ul.heroes li').should('have.length', 10)
    .first().should('include.text', 'Dr Nice')
    .find('.delete').click()
  cy.get('ul.heroes li')
    .should('have.length', 9).and('not.include.text', 'Dr Nice')
  cy.reload()
  // Dr Nice is back
  cy.get('ul.heroes li')
    .should('have.length', 10)
    .first().should('include.text', 'Dr Nice')
})

it('Returns deleted hero after reload - with assertions against data', () => {
  cy.visit('/heroes')
  // confirm the data in the component
  getHeroes().should('have.length', 10)
    .then(list => list[0])  // can also use its('0') with // ts-ignore
    .should('deep.equal', {
      id: 11,
      name: 'Dr Nice'
    })
  // confirm the UI
  cy.get('ul.heroes li').should('have.length', 10)
    .first().should('include.text', 'Dr Nice')
    .find('.delete').click()
  cy.get('ul.heroes li')
    .should('have.length', 9).and('not.include.text', 'Dr Nice')
  // confirm the data in the component
  getHeroes()
    // @ts-ignore
    .its('0').should('deep.equal', {
      id: 12,
      name: 'Narco'
    })
  cy.reload()
  // Dr Nice is back
  cy.get('ul.heroes li')
    .should('have.length', 10)
    .first().should('include.text', 'Dr Nice')
})

it('shows Heroes and finds Bombasto', () => {
  cy.visit('/')
    .get('.module.hero').should('have.length', 4)

  cy.get('#search-box').type('Bombasto')
  cy.get('ul.search-result li').should('have.length', 1)
    .first().should('contain', 'Bombasto')
})

it('deletes all heroes through UI', () => {
  cy.visit('/heroes')
  // confirm the heroes have loaded and select "delete" buttons
  cy.get('ul.heroes li button.delete')
    .should('have.length.gt', 0)
    // and delete all heroes
    .click({ multiple: true })
})

it('sets reference to HeroesComponent', () => {
  cy.visit('/heroes')
  cy.window()
    .should('have.property', 'HeroesComponent') // yields window.HeroesComponent
})

const getHeroesComponent = () =>
  cy.window()
    .should('have.property', 'HeroesComponent') // yields window.HeroesComponent

/**
 * yields window.HeroesComponent.heroes array
 * @example
 *  // starts with 10 heroes
 *  cy.visit('/heroes').should('have.length', 10)
 */
const getHeroes = () =>
  getHeroesComponent().should('have.property', 'heroes')
    .then(list => <Hero[]><unknown>list) // make the type work

/**
 * Sets the length of heroes array to 0
 */
const clearHeroes = () =>
  getHeroes()
    .then(heroes => {
      cy.log(`clearing ${heroes.length} heroes`)
      heroes.length = 0
    })

const getAppRef = () =>
  cy.window().should('have.property', 'appRef')
    .then(x => <ApplicationRef><unknown>x) // make the type work

/**
 * Calls `appRef.tick()` to force UI refresh
*/
const tick = () =>
  getAppRef()
    .invoke('tick')

it('starts with 10 heroes', () => {
  cy.visit('/heroes')
  getHeroesComponent()
    .should('have.property', 'heroes') // yields window.HeroesComponent.heroes array
    .should('have.length', 10)
})

Cypress.Commands.add('getHeroesComponent', () => {
  // yields window.HeroesComponent
  return cy.window().should('have.property', 'HeroesComponent')
})

it('starts with 10 heroes (custom command)', () => {
  cy.visit('/heroes')
  cy.getHeroesComponent()
    .should('have.property', 'heroes') // yields window.HeroesComponent.heroes array
    .should('have.length', 10)
})

it('sets zero heroes', () => {
  cy.visit('/heroes')
  cy.getHeroesComponent()
    .should('have.property', 'heroes') // yields window.HeroesComponent.heroes array
    .should('have.length', 10)
    .then(heroes => {
      heroes.length = 0
      cy.log('cleared heroes')
      // the ui still shows the heroes
    })
})

it('deletes all heroes through app action', () => {
  cy.visit('/heroes')
  // confirm the heroes have loaded - because the array has items
  getHeroes().should('have.length.gt', 0)
  clearHeroes()
  tick()
})

/**
 * Adds a new hero. Waits for number of heroes to increase by 1
 */
// const addHero = (name: string) => {
//   // first, save the number of items in the list
//   // save under alias "n", available in the test context "this.n"
//   getHeroes().its('length').as('n')
//   cy.window()
//     // @ts-ignore
//     .its('HeroesComponent')
//     .invoke('add', name)
//   // now retry reading "heroes" array until its length has increased by 1
//   getHeroes().should(function (heroes) {
//     // use "function () {...}" callback to make sure
//     // "this" points at the test context
//     // and we can access previously saved alias "n"
//     expect(heroes).to.have.length(this.n + 1)
//   })
// }

/**
 * Adds a new hero. If the application method "add(name)" returns a promise,
 * the Cypress test command chain automatically waits for the promise to resolve.
 */
const addHero = (name: string) =>
  cy.window()
    .its('HeroesComponent')
    .invoke('add', name)

it.only('shows new hero', () => {
  cy.visit('/heroes')
  clearHeroes()
  tick()

  addHero('Gleb') // the world needs a new hero
  tick()
  cy.contains('.heroes li', 'Gleb')
})
