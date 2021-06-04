# todomvc-expanded
Expanded todomvc with login, signup and drag and drop

Simple todoMVC app build with Vue.js, originally forked from [testing-workshop-cypress](https://github.com/cypress-io/testing-workshop-cypress). I expanded the appliaction and added a couple of features.

## Features
### drag & drop
Reorder todos in list.
TBD: make sure the reorder keeps it’s state after refresh 🙂
![Drag and drop](/img/dragndrop.gif "Drag and drop")

### signup page
Signup page with ability to send a real welcome email. Using [sendmail](https://www.npmjs.com/package/sendmail) to do that. Signups are stored in data.json, in plain text. So, yeah.
![Signup](/img/signup.png "Signup")

### login page
Works with previously signed up emails. Server returns an auth cookie in form of auth=true, LOL 😆
![Login](/img/login.png "Login")

## api
Backend is a json-server on a static json file. Middleware handles couple of cases. Some of these are:

### POST /reset
Deletes all todos and all accounts, that were created on signup page.

### DELETE /todos
Deletes all todos

### DELETE /accounts
Deletes all accounts, created on signup page

## Installation
1. `npm i`
2. `npm start`

App runs on localhost:3000 by default.