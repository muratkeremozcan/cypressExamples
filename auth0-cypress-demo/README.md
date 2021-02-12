# auth0-cypress-demo

This repo is to be used with Dan Lourenço's auth0 blog post at https://auth0.com/blog/end-to-end-testing-with-cypress-and-auth0/ .
The original repo is at https://github.com/danlourenco/auth0-cypress-demo . This repo is strictly for my self-reproduction of the tutorial.

> Note that I have changed the default port to 3200 from 3000. This is sent in the .env file. Since this is changed, you will also have to change under Auth0/Application/Settings the values in Allowed Web Origins, Allowed Logout URLs and Allowed Callback URLs.

## Installation

To run this sample application on your machine, clone this repo, run `npm install` in the root directory, and `npm run start` to kick off the development server.

To run Cypress tests, run `npm run cypress:open`