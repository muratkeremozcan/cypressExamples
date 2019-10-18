# Dynamic XHR responses recording & stubbing with Cypress

This is as simple project that showcases a way of dynamically saving XHR responses as JSON fixtures while running tests and using these fixtures to stub requests in subsequent tests.

This was created as a supplement to a Medium article that you can read here: [https://medium.com/ax2-inc/dynamic-xhr-responses-recording-stubbing-with-cypress-9257d4f730cd](https://medium.com/ax2-inc/dynamic-xhr-responses-recording-stubbing-with-cypress-9257d4f730cd)

To try this out, clone the project and install its dependencies:

```sh
yarn install
```

To start the server and run the tests. Auto-record test will work regardless of this setting.

```sh
yarn e2e:record
yarn e2e:open
```

You can run cypress in either mode, however you can also just flip the bit in `basic.spec.js` .

```javascript
// will record
const isRecord = () => Cypress.env('ENVIRONMENT') === 'record';
// will not record
const isRecord = () => Cypress.env('ENVIRONMENT') !== 'record';
```
