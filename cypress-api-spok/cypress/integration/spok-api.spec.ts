import spok from 'cy-spok'

// improve api examples
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
