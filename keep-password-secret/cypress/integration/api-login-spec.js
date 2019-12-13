/// <reference types="cypress" />
import { login } from '../support'

it('logs in using cy.request', () => {
  login()

  // now visit the profile page
  cy.visit('/profile').contains('Email: jack@example.com')
})
