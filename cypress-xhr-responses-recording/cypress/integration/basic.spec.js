// to test this without having to flip between yarn e2e:record  and yarn e2e:open, just flip the bit
const isRecord = () => Cypress.env('ENVIRONMENT') !== 'record';

describe('MyApp', function() {

  // We declare an empty array to gather XHR responses
  const xhrData = [];

  after(function() {
    // In record mode, save gathered XHR data to local JSON file
    if (isRecord()) {
      const path = './cypress/fixtures/fixture.json';
      cy.writeFile(path, xhrData);
      cy.log(`Wrote ${xhrData.length} XHR responses to local file ${path}`);
    }
  });

  it('Works', function() {

    console.log(isRecord());
    cy.server({
      // Here we handle all requests passing through Cypress' server
      onResponse: (response) => {
        if (isRecord()) {
          const url = response.url;
          const method = response.method;
          const data = response.response.body;
          // We push a new entry into the xhrData array
          xhrData.push({ url, method, data });
        }
      },
    });

    // This tells Cypress to hook into any GET request
    if (isRecord()) {
      cy.log('recording!');
      cy.route({
        method: 'GET',
        url: '*',
      });
    }

    // Load stubbed data from local JSON file
    if (!isRecord()) {
      cy.fixture('fixture')
        .then((data) => {
          for (let i = 0, length = data.length; i < length; i++) {
            cy.route(data[i].method, data[i].url, data[i].data);
          }
        });
    }

    cy.visit('http://localhost:8080/');
    cy.get('ul').find('li').should('have.length', 10);

  });
});
