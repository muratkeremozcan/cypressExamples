import spok from 'cy-spok'

describe('pokemon api', () => {
  it('get one pokemon', () => {
    cy.api({
      method: 'GET',
      url: 'pokemon/1/',
      retryOnStatusCodeFailure: true
    })
      .its('body')
      .should(
        spok({
          $topic: '***pokemon-top-level',
          abilities: spok.array,
          base_experience: spok.number,
          forms: spok.arrayElements(1),
          game_indices: spok.arrayElementsRange(5, 30),
          height: spok.number,
          id: spok.number,
          is_default: spok.type('boolean'),
          location_area_encounters: spok.startsWith('https://pokeapi.co'),
          moves: (arr) => arr.length > 20,
          name: spok.string,
          order: spok.ge(1),
          past_types: (arr) => arr.length >= 0,
          species: spok.type('object'),
          sprites: (obj) => expect(obj).to.have.property('front_default'),
          types: (arr) =>
            expect(arr.map((i) => i.type.name)).to.not.be.undefined,
          weight: spok.gtz,
          stats: spok.arrayElements(6)
        })
      )
      .its('stats')
      .should('have.length', 6) // an array of objects
      .each((stat) =>
        cy.wrap(stat).should(
          spok({
            $topic: 'each-pokemon-stat',
            base_stat: spok.gtz,
            effort: spok.gez,
            stat: (obj) =>
              expect(obj.name).to.be.a('string') &&
              expect(obj.url).to.include('https://pokeapi.co')
          })
        )
      )
  })

  const getPokemon = (id) =>
    cy
      .api({
        method: 'GET',
        url: `pokemon/${id}/`,
        retryOnStatusCodeFailure: true
      })
      .its('body')

  const getPokeCount = () =>
    cy
      .api({
        method: 'GET',
        url: 'pokemon',
        retryOnStatusCodeFailure: true
      })
      .its('body.count')

  const topLevelProps = {
    $topic: '***pokemon-top-level***',
    abilities: spok.array,
    forms: spok.arrayElements(1),
    game_indices: spok.arrayElementsRange(5, 30),
    height: spok.number,
    id: spok.number,
    is_default: spok.type('boolean'),
    location_area_encounters: spok.startsWith('https://pokeapi.co'),
    moves: (arr) => arr.length > 2,
    name: spok.string,
    order: spok.ge(1),
    past_types: (arr) => arr.length >= 0,
    species: spok.type('object'),
    sprites: (obj) => expect(obj).to.have.property('front_default'),
    types: (arr) => expect(arr.map((i) => i.type.name)).not.to.be.null,
    weight: spok.gtz,
    stats: spok.arrayElements(6)
  }

  const statProps = {
    $topic: '***each-pokemon-stat***',
    base_stat: spok.gtz,
    effort: spok.gez,
    stat: (obj) =>
      expect(obj.name).to.be.a.string &&
      expect(obj.url).to.include('https://pokeapi.co')
  }

  it('get many with forEach', () => {
    // you could do all, but it takes a long time
    // getPokeCount().then((pokeCount) =>
    Cypress._.range(1, 10).forEach((pokeId) =>
      getPokemon(pokeId)
        .should(spok(topLevelProps))
        .its('stats')
        .should('have.length', 6) // an array of objects
        .each((stat) => cy.wrap(stat).should(spok(statProps)))
    )
    // )
  })

  context('get many with cypress-each', () => {
    it.each(Cypress._.range(1, 10))('checking pokemon %k', (pokeId) => {
      getPokemon(pokeId)
        .should(spok(topLevelProps))
        .its('stats')
        .should('have.length', 6) // an array of objects
        .each((stat) => cy.wrap(stat).should(spok(statProps)))
    })
  })

  context.skip('how would you make this work?', () => {
    let count = 1

    before(() =>
      getPokeCount().then((pokeResultCount) => {
        count = pokeResultCount
      })
    )

    // count is yielded in a different context, so how can we get this value to be dynamic?
    it.each(Cypress._.range(1, count))('checking pokemon %k', (pokeId) => {
      getPokemon(pokeId)
        .should(spok(topLevelProps))
        .its('stats')
        .should('have.length', 6) // an array of objects
        .each((stat) => cy.wrap(stat).should(spok(statProps)))
    })
  })
})
