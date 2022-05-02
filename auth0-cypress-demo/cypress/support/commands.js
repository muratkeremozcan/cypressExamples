/* eslint-disable no-undef */

const requestToken = () =>
  cy.request({
    method: "POST",
    url: Cypress.env("auth_url"),
    body: {
      grant_type: "password",
      username: Cypress.env("auth_username"),
      password: Cypress.env("auth_password"),
      audience: Cypress.env("auth_audience"),
      scope: "openid profile email",
      client_id: Cypress.env("auth_client_id"),
      client_secret: Cypress.env("auth_client_secret"),
    },
  });

Cypress.Commands.add("progLogin", () => {
  Cypress.log({
    name: "loginViaAuth0",
  });

  requestToken()
    .its("body")
    .then(({ access_token, expires_in, id_token }) => {
      const auth0State = {
        nonce: "",
        state: "some-random-state",
      };

      const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;

      return cy.visit(callbackUrl, {
        onBeforeLoad: (win) => {
          win.document.cookie =
            "com.auth0.auth.some-random-state=" + JSON.stringify(auth0State);
        },
      });
    });
});
