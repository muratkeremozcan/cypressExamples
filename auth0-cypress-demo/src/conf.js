const {
  REACT_APP_AUTH0_DOMAIN: AUTH0_DOMAIN = '',
  REACT_APP_AUTH0_CLIENT_ID: AUTH0_CLIENT_ID = '',
} = process.env;

export default {
  AUTH0: {
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    callbackUrl: `${ window.location.origin }/callback`,
    returnTo: `${ window.location.origin }`,
    responseType: 'token id_token',
    scope: 'openid profile email',
  },
};
