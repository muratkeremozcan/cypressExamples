describe('login', () => {

  const thresholds = {
    performance: 5,
    accessibility: 50,
    'best-practices': 50,
    seo: 50,
    pwa: 20
  };

  const desktopConfig = {
    formFactor: 'desktop',
    screenEmulation: { disabled: true }
  };


  it('should successfully log into our app', () => {
    cy.login()
      .then( resp => {
        return resp.body;
      })
      .then( body => {
        const { access_token, expires_in, id_token } = body;
        const auth0State = {
          nonce: '',
          state: 'some-random-state'
        };
        const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
        cy.visit(callbackUrl, {
          onBeforeLoad(win) {
            win.document.cookie = 'com.auth0.auth.some-random-state=' + JSON.stringify(auth0State);
          }
        });

        cy.contains('Home')

        cy.contains('Home');

        cy.lighthouse(thresholds, desktopConfig);

      });
  });
});