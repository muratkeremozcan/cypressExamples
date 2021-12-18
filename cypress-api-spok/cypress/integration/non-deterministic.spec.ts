import spok from 'cy-spok'
import { name as fakeName, address as fakeAddress } from 'faker'

describe('object comparison: nondeterministic values', () => {
  const person = {
    name: {
      first: fakeName.firstName(),
      last: fakeName.lastName(),
      message: 'hello world',
      nickName: 'Frederic Fok',
      saying: 'Lorem ispsum dolor sit amet'
    },
    age: Cypress._.random(0, 30),
    height: Cypress._.random(5, 6),
    weight: Cypress._.random(100, 200),
    circumference: Cypress._.random(10, 20),
    headCircumference: Cypress._.random(2, 5),
    legLength: Cypress._.random(5, 8),
    armLength: Cypress._.random(3, 6),
    iq: Cypress._.random(100, 200),
    address: {
      street: fakeAddress.streetName(),
      streetWithNumber: fakeAddress.streetAddress(),
      city: fakeAddress.cityName(),
      state: fakeAddress.stateAbbr(),
      zip: fakeAddress.zipCodeByState(fakeAddress.stateAbbr()),
      trick: null
    },
    anArray: [...Cypress._.range(20, 30)],
    anotherArray: [
      ...Cypress._.range(Cypress._.random(5, 10), Cypress._.random(15, 20))
    ],
    frequentWhereabouts: [
      {
        street: fakeAddress.streetName(),
        streetWithNumber: fakeAddress.streetAddress(),
        city: fakeAddress.cityName(),
        state: fakeAddress.stateAbbr(),
        zip: fakeAddress.zipCodeByState(fakeAddress.stateAbbr())
      },
      {
        street: fakeAddress.streetName(),
        streetWithNumber: fakeAddress.streetAddress(),
        city: fakeAddress.cityName(),
        state: fakeAddress.stateAbbr(),
        zip: fakeAddress.zipCodeByState(fakeAddress.stateAbbr())
      },
      {
        street: fakeAddress.streetName(),
        streetWithNumber: fakeAddress.streetAddress(),
        city: fakeAddress.cityName(),
        state: fakeAddress.stateAbbr(),
        zip: fakeAddress.zipCodeByState(fakeAddress.stateAbbr())
      }
    ]
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

  it('the big advantage of spok is when testing nondeterministic values', () => {
    // https://github.com/thlorenz/spok#api
    cy.wrap(person).should(
      spok({
        $topic: '***Number***',
        age: spok.range(0, 30),
        height: spok.type('number'),
        weight: spok.number,
        circumference: spok.ge(10),
        headCircumference: spok.gt(1),
        legLength: spok.le(8),
        armLength: spok.lt(7),
        iq: spok.ne(5000)
        // also assertions around 0: gtz, gez, ltz, lez
      })
    )

    cy.wrap(person.name).should(
      spok({
        $topic: '***String***',
        first: spok.type('string'),
        last: spok.string,
        message: spok.test(/lo wo/), // simple regex example
        nickName: spok.startsWith('Fred'),
        saying: spok.endsWith('amet')
      })
    )

    cy.wrap(person.address).should(
      spok({
        $topic: '***regex-undefined-defined***',
        streetWithNumber: spok.test(
          /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/
        ),
        city: spok.defined,
        state: spok.ne(undefined),
        trick: spok.notDefined
      })
    )

    cy.wrap(person).should(
      spok({
        $topic: '***Array***',
        anArray: spok.arrayElements(10), // must have 10 elements
        anotherArray: spok.arrayElementsRange(5, 15), // can be 5 to 15 elements
        frequentWhereabouts: spok.array
      })
    )

    cy.wrap(person).should(
      spok({
        $topic: '***Objects***',
        address: spok.definedObject,
        frequentWhereabouts: spok.type('object')
      })
    )

    cy.wrap(person)
      .should(
        spok({
          $topic: '***predicateFunction***',
          // frequentWhereabouts: (arr) => arr.length === 3 // simple
          frequentWhereabouts: (arr) =>
            // arr.map((i) => i.street) !== (null || undefined) // intermediate
            expect(arr.map((i) => i.street)).to.be.a.string // can use assertions
          // arr.map((i) => i.state).filter((abbr) => abbr.length > 2).length === 0 // overkill
        })
      ) // let's say you want to test an array of objects within an object
      .its('frequentWhereabouts')
      .should('have.length', 3)
      .each((location) =>
        cy.wrap(location).should(
          spok({
            $topic: '***ArrayOfObject***',
            streetWithNumber: spok.test(
              /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/
            ),
            city: spok.defined,
            state: spok.ne(undefined),
            trick: spok.notDefined
          })
        )
      )
  })
})

describe('from docs', () => {
  it('basics', () => {
    const object = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      helloWorld: 'hello world',
      anyNum: 999,
      anotherNum: 888,
      anArray: [1, 2],
      anotherArray: [1, 2, 3],
      anObject: {}
    }

    cy.wrap(object).should(
      spok({
        $topic: 'spok-example', // optional
        one: spok.ge(1),
        two: 2,
        three: spok.range(2, 6),
        four: spok.lt(5),
        helloWorld: spok.startsWith('hello'),
        anyNum: spok.type('number'),
        anotherNum: spok.number,
        anArray: spok.array,
        anotherArray: (arr) => arr.length === 3,
        anObject: spok.ne(undefined)
      })
    )
  })
})
