# keep-password-secret [![CircleCI](https://circleci.com/gh/bahmutov/keep-password-secret/tree/master.svg?style=svg)](https://circleci.com/gh/bahmutov/keep-password-secret/tree/master)

> Example site for showing how to prevent accidentally revealing passwords during Cypress tests

Read [Keep passwords secret in E2E tests](https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/).

Actual login and password: `jack` and `secret`

Originally cloned from [passport/express-4.x-local-example](https://github.com/passport/express-4.x-local-example)

## Tests

### login-spec.js

[cypress/integration/login-spec.js](cypress/integration/login-spec.js) types username and password into the form and submits its. Notice that you can see the entered password in the spec video and screenshots - this is insecure.

![Login spec showing the password](images/login-spec.gif)

### no-password-spec.js

[cypress/integration/no-password-spec.js](cypress/integration/no-password-spec.js) avoids hardcoding the username and the password by reading them from environment variables using [Cypress.env](https://on.cypress.io/env) command.

### api-login-spec.js

The spec file [cypress/integration/api-login-spec.js](cypress/integration/api-login-spec.js) uses a `login` function exported from [cypress/support/index.js](cypress/support/index.js) to login via a single [`cy.request`](https://on.cypress.io/request) call to submit username and password form, bypassing entire login UI.

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2019

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/keep-password-secret/issues) on Github

## MIT License

Copyright (c) 2019 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
