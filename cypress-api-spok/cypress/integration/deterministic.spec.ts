import spok from 'cy-spok'

describe('object comparison: deterministic values (constants or known from the test context)', () => {
  const person = {
    name: {
      first: 'John',
      last: 'Doe'
    },
    age: 30,
    address: {
      street: '123 Main St.',
      city: 'Any town',
      state: 'CA',
      zip: 12345
    }
  }

  const shallowProperty = {
    age: 30
  }

  const deepProperty = {
    name: {
      first: 'John',
      last: 'Doe'
    }
  }

  const clone = { ...person }

  it('shallowProperty comparison', () => {
    cy.log('for shallow properties, spot checks are the simplest = way')
    cy.wrap(person).its('age').should('eq', 30)

    cy.log('can check shallow properties with anything')
    cy.wrap(person)
      .should('deep.include', shallowProperty)
      .and('deep.contain', shallowProperty)
      .and('have.contain', shallowProperty)
      .and('contain', shallowProperty)

    cy.log('can use spok')
    cy.wrap(person).should(spok(shallowProperty))
  })

  it('deepProperty comparison ', () => {
    cy.log('for deep properties, would have to check each property')
    cy.wrap(person).its('name.first').should('eq', 'John')
    cy.wrap(person).its('name.last').should('eq', 'Doe')
    cy.wrap(person).its('address').its('street').should('contain', '123')
    // more...

    cy.log('can check deep properties with deep.include only')
    cy.wrap(person).should('deep.include', deepProperty)
    cy.wrap(person).should('deep.contain', deepProperty)
    // will not work with deep properties
    // cy.wrap(person).should('have.contain', deepProperty)
    // cy.wrap(person).should('contain', deepProperty)

    cy.log('can use spok')
    cy.wrap(person).should(spok(deepProperty))
  })

  it('full clone comparison', () => {
    cy.log('in a full clone, would have to check each property...')
    cy.wrap(person).its('age').should('eq', 30)
    cy.wrap(person).its('name.first').should('eq', 'John')
    cy.wrap(person).its('name.last').should('eq', 'Doe')
    cy.wrap(person).its('address').its('street').should('contain', '123')
    // more ....

    cy.log('can check deep properties with anything')
    cy.wrap(person)
      .should('deep.include', clone)
      .and('deep.contain', clone)
      .and('have.contain', clone)
      .and('contain', clone)

    cy.log('can use spok')
    cy.wrap(person).should(spok(clone))
  })
})
