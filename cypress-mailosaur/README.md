## Sample repo for Mailosaur tests with Cypress

We are using an open email `cypress-mailosaur-test@protonmail.com` with pw `Password-1`. Login at [](https://mailosaur.com/app/).

`cypress.env.json` is shared.

This is so that things can work out of the box without any setup. We trust the community to put it to good use.

`npm i`

`npm run cypress:open`


### Examples to improve upon

One can keep building the test suite with the api docs [](https://docs.mailosaur.com/reference).
* [Downloading attachments](https://docs.mailosaur.com/reference#download-an-attachment)
* [Spam test](https://docs.mailosaur.com/reference#perform-a-spam-test)
* Validating links in email: have a look at `retrieveMessage` function in use. The idea is to [retrieve the the message by id](https://docs.mailosaur.com/reference#retrieve-a-message) and access its html, links, images, attachments etc. properties.
