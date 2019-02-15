/// <reference types="cypress" />
// @ts-check

import { enterTodo, resetDatabase } from './utils'

describe('cy.task', () => {
  beforeEach(resetDatabase)
  beforeEach(() => {
    cy.visit('/')
  })

  it('finds record in the database', () => {
    // random text to avoid confusion
    const id = Cypress._.random(1, 1e6)
    const title = `todo ${id}`
    enterTodo(title)
    // confirm the new item has been saved
    // https://on.cypress.io/task
    cy.task('hasSavedRecord', title).should('equal', true)
  })
})
