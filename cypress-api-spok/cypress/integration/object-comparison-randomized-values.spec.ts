import spok from 'cy-spok'
import { name, address } from 'faker'

describe('object comparison: nondeterministic values', () => {
  const person = {
    name: {
      first: name.firstName(),
      last: name.lastName()
    },
    age: Cypress._.random(0, 30),
    address: {
      street: address.streetName(),
      city: address.cityName(),
      state: address.stateAbbr(),
      zip: address.zipCodeByState(address.stateAbbr())
    }
  }

  it(`Base assertion limitations: 
  can check that the value is not undefined, have to check 1 by 1 
  can check the existence of a full or subset of only shallow keys`, () => {
    cy.log('can check that the value is not undefined, have to check 1 by 1')
    cy.wrap(person).its('age').should('exist')
    cy.wrap(person).its('name.first').should('exist')
    cy.wrap(person).its('name.last').should('exist')
    cy.wrap(person).its('address').its('street').should('exist')
    // more ..

    cy.log('can check only shallow keys, full or subset. No deep keys')
    cy.wrap(person).should('include.all.keys', 'name', 'age', 'address')
  })

  // it('the big advantage of spok is when testing nondeterministic values', () => {
  //   cy.wrap(person).should(spok(
  //     name:
  //   ))
  // })
})
