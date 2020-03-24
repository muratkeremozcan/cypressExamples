const flag = "/flag/";
const capital = "/capital/";

const tld = "/tld/"

const data_flag = require("../resources-test/flags_data_sample.postman_sample_data.json");
const data_capital = require("../resources-test/capital_data_sample.postman_sample_data.json");
const data_languages = require("../resources-test/languages_data_sample.postman_sample_data.json");
const data_tld = require("../resources-test/tld_data_sample.postman_sample_data.json");
const data_area = require("../resources-test/area_data_sample.postman_sample_data.json");
const data_borders = require("../resources-test/borders_data_sample.postman_sample_data.json");


describe('API tests', () => {
  context('Smoke test', () => {
    it('basic sanity', () => {
      cy.request('/')
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.length(250);
          expect(response.headers).to.have.property('connection');
        }) // you can check response in 2 ways
        .its('headers')
        .its('content-type')
        .should('include', 'application/json')
    })
  })
  context('country flag tests', () => {
    it('should test Japanese flag', () => {
      cy.request(`${flag}jp`)
        .should((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property('flag');
          expect(res.body).to.have.property('callingCode');
          expect(res.body).to.have.property('relevance');
          expect(res.body.relevance).to.eq('2.5');
          expect(res.body.translations.fra).to.eq('Japon');
        })
    })
    it('should test all flags', () => {
      for (let i = 0; i < data_flag.length; i++) {
        cy.request(`${flag}` + data_flag[i].guid)
          .should((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('flag');
            expect(res.body).to.have.property('callingCode');
            expect(res.body).to.have.property('relevance');
            expect(res.body.flag[0]).to.deep.equal(data_flag[i].guid)
          })
      }
    })
  })
  context('country capital tests', () => {
    it('should test Turkish capital', () => {
      cy.request(`${capital}Ankara`)
        .its('status').should('eq', 200)
      cy.request(`${capital}Ankara`)
        .its('headers').its('content-type').should('include', 'application/json')
      cy.request(`${capital}Ankara`)
        .should((res) => {
          expect(res.headers).to.have.property('vary')
          expect(res.headers).to.have.property('x-powered-by')
          // cy.wrap(res).its('headers').its('x-powered-by').should('exist') // this would work if the next block is not chained
        }) // the yielded subject still is cy.request after then or should
        .its('headers').then( headers => {
          cy.wrap(headers).as('headers')
          cy.get('@headers').its('x-powered-by').should('eq', 'Express')
          cy.wrap(headers).its('vary').should('eq', 'Accept-Encoding')          
        })     
    });
    it('should test all capitals', () => {
      for (let i = 0; i < data_capital.length; i++) {
        cy.request(`${capital}` + data_capital[i].guid)
          .should((res) => {
            expect(res.status).to.eq(200)
            expect(res.body[0]).to.have.property('capital')
            expect(res.body[0].capital).to.deep.equal(data_capital[i].guid);
          })
      }
    })
  })
  context('country top level domain', () => {
    it.skip('Non-loopy explicity version - tld should deep equal data tld ', () => {
      for (let i = 0; i < data_tld.length; i++) {
      cy.request(`${tld}` + data_tld[i].guid)
        .should( res => {
          expect(res.status).to.eq(200)
          expect(res.body).to.have.property('tld')
          expect(res.body.tld[0]).to.be.a('string').and.not.to.be.empty
          expect(res.body.tld[0].length).to.equal(3)
        })
      }
    })
    describe('test all country top level domains', () => {
      for (let i = 0; i < data_tld.length; i++) {
        it('tld should be deep equal ' + data_tld[i].guid + '', () => {
          cy.testTopLevelDomain(i);
        })
      }
    })
  })
  // with explicit test case names using cypress.command
  context('country by area, explicit test case names, using custom cypress.command ', () => {
    describe('test all country areas', () => {
      for(let i = 0; i < data_area.length; i++) {
        it('area for '+data_area[i].cca3+' should deep equal '+data_area[i].guid+' ', () => {
          cy.testCountryArea(i);
        })
      }
    })
  })
  context('country by borders, explicit test case names, using custom cypress.command', () => {
    describe('test all country borders ', () => {
      for(let i = 0; i < data_borders.length; i++) {
        it(' DATA borders for '+data_borders[i].guid+' should be deep equal to API borders for '+data_borders[i].guid+' ', () => {
          cy.testCountryBorder(i);
        })
      }
    })
  })
  context('country language tests', () => {
    describe('test all country languages', () => {
      for(let i = 0; i < data_languages.length; i++) {
        it('nativeLanguage should be deep equal ' + data_languages[i].guid + ' ', () => {
          cy.testLanguages(i)
        })
      }
    })
  })
})
