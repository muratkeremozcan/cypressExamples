/* eslint-disable @typescript-eslint/no-explicit-any */
describe('pokemon api', () => {
  it('get one pokemon', () => {
    cy.api({
      method: 'GET',
      url: 'pokemon/1/',
      retryOnStatusCodeFailure: true
    })
      .its('body')
      .should((body) => {
        expect(body.abilities).to.be.an('array')
        expect(body.base_experience).to.be.a('number')
        expect(body.forms).to.be.an('array').and.have.length(1)
        expect(body.game_indices) // verbose vs spok
          .to.be.an('array')
          .and.have.length.within(5, 30)
        expect(body.height).to.be.a('number')
        expect(body.id).to.be.a('number')
        expect(body.is_default).to.be.a('boolean')
        expect(body.location_area_encounters).to.match(/^https:\/\/pokeapi.co/) // verbose vs spok
        expect(body.moves).to.be.an('array').and.have.length.above(20) // verbose vs a spok predicate function
        expect(body.name).to.be.a('string')
        expect(body.order).to.be.a('number').and.be.least(1) // verbose vs spok
        expect(body.past_types).to.be.an('array').and.have.length.least(0) // verbose vs spok
        expect(body.species).to.be.an('object')
        expect(body.sprites).to.have.property('front_default')
        // expect(body.types.name).to.not.be.undefined // complex spok predicates are impossible with classic assertions
        expect(body.weight).to.be.greaterThan(0) // verbose vs spok
        expect(body.stats).to.be.an('array').and.have.length(6) // verbose vs spok
      })
      .its('stats')
      .should('have.length', 6)
      .each((stat) =>
        cy.wrap(stat).should((eachStat: any) => {
          expect(eachStat.base_stat).to.be.greaterThan(0)
          expect(eachStat.effort).to.be.least(0)
          expect(eachStat.stat.name).to.be.a('string') // verbose vs spok
          expect(eachStat.stat.url).to.include('https://pokeapi.co')
        })
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

  const topLevelProps = (body) => {
    expect(body.abilities).to.be.an('array')
    expect(body.base_experience).to.be.a('number')
    expect(body.forms).to.be.an('array').and.have.length(1)
    expect(body.game_indices) // verbose vs spok
      .to.be.an('array')
      .and.have.length.within(5, 30)
    expect(body.height).to.be.a('number')
    expect(body.id).to.be.a('number')
    expect(body.is_default).to.be.a('boolean')
    expect(body.location_area_encounters).to.match(/^https:\/\/pokeapi.co/) // verbose vs spok
    expect(body.moves).to.be.an('array').and.have.length.above(20) // verbose vs a spok predicate function
    expect(body.name).to.be.a('string')
    expect(body.order).to.be.a('number').and.be.above(0) // verbose vs spok
    expect(body.past_types).to.be.an('array').and.have.length.least(0) // verbose vs spok
    expect(body.species).to.be.an('object')
    expect(body.sprites).to.have.property('front_default')
    // expect(body.types.name).to.not.be.undefined // impossible with classic assertions
    expect(body.weight).to.be.greaterThan(0) // verbose vs spok
    expect(body.stats).to.be.an('array').and.have.length(6) // verbose vs sp
  }

  const statProps = (stat) => {
    cy.wrap(stat).should((eachStat: any) => {
      expect(eachStat.base_stat).to.be.greaterThan(0)
      expect(eachStat.effort).to.be.least(0)
      expect(eachStat.stat.name).to.be.a('string') // verbose vs spok
      expect(eachStat.stat.url).to.include('https://pokeapi.co')
    })
  }

  it('get many with forEach', () => {
    // you could do all, but it takes a long time
    // getPokeCount().then((pokeCount) =>
    Cypress._.range(1, 10).forEach((pokeId) =>
      getPokemon(pokeId)
        .should(topLevelProps)
        .its('stats')
        .should('have.length', 6) // an array of objects
        .each((stat) => cy.wrap(stat).then(statProps))
    )
    // )
  })

  context('get many with cypress-each', () => {
    it.each(Cypress._.range(1, 10))('checking pokemon %k', (pokeId) => {
      getPokemon(pokeId)
        .should(topLevelProps)
        .its('stats')
        .should('have.length', 6) // an array of objects
        .each((stat) => cy.wrap(stat).then(statProps))
    })
  })
})
