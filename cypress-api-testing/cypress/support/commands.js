const area = "/area/";
const borders = "/name/";
const tld = "/tld/"
const language = "/language/";

const data_area = require("../resources-test/area_data_sample.postman_sample_data.json");
const data_borders = require("../resources-test/borders_data_sample.postman_sample_data.json");
const data_tld = require("../resources-test/tld_data_sample.postman_sample_data.json");
const data_languages = require("../resources-test/languages_data_sample.postman_sample_data.json");


Cypress.Commands.add('testCountryArea', (i) => {
  cy.request(`${area}` + data_area[i].guid)
    .should(res => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('area')
      expect(res.body.area).to.be.a("string").and.not.be.empty
      expect(res.body.area).to.deep.equal(data_area[i].guid)
    })
})

Cypress.Commands.add('testCountryBorder', (i) => {
  cy.request(`${borders}` + data_borders[i].guid)
    .should(res => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('borders')
      expect(res.body.borders).to.deep.equal(data_borders[i].borders)
    })
})

Cypress.Commands.add('testTopLevelDomain', (i) => {
  cy.request(`${tld}` + data_tld[i].guid)
    .should(res => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('tld')
      expect(res.body.tld[0]).to.be.a('string').and.not.to.be.empty
      expect(res.body.tld[0].length).to.equal(3)
    })
})

Cypress.Commands.add('testLanguages', (i) => {
  cy.request(`${language}` + data_languages[i].guid)
    .should(res => {
      expect(res.status).to.eq(200)
      expect(res.body[0]).to.have.property('nativeLanguage')
      expect(res.body[0].nativeLanguage).to.deep.equal(data_languages[i].guid)
      expect(res.body[0].nativeLanguage.length).to.equal(3)
    })
})