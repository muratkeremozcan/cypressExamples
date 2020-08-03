## Sample repo for Mailosaur tests with Cypress

### The setup needed to run the tests:
We are using an email `cypress-mailosaur-test@protonmail.com` in this repo.
To reproduce the test executions, use your own email and create an account at [Mailosaur application](https://mailosaur.com/app/).

A sampe `cypress.env.json` is shared. You need to update these values for your account
This is so that things can work out of the box without any setup.

To get started:
```
npm i
npm run cypress:open
```

There are 3 test specs with different approaches.

* The most primitive approach: `mailosaur-waituntil-cypress.spec` implements [Mailosaur API](https://docs.mailosaur.com/reference) using Cypress. Utilizes plugins and helper utilities to construct a test suite.

* Slightly advanced approach: `mailosaur-npm-cy-task.spec` utilizes [Mailosaur's Node package](https://www.npmjs.com/package/mailosaur) and [Mailosaur getting started examples ](https://docs.mailosaur.com/docs/development) and implements them using [`cy.task`](https://docs.cypress.io/api/commands/task.html#Syntax).

* Best and least effort approach: `mailosaur-cypress-plugin.spec.js` uses [Mailosaur Cypress plugin](https://github.com/mailosaur/mailosaur-cypress) released in May 2020. It abstracts a lot of the complexity needed with other approaches.

> Note: [`sendmail` npm package](https://www.npmjs.com/package/sendmail) has been included to send custom emails utilizing `cy.task()`. Note that this is for testing the repo and usually your application would be sending these emails.

[Youtube video explaining the repo](https://youtu.be/_76TMg4yfrU). The plugin topic is not in the video - this came later - but the code should be simple enough to go through.

