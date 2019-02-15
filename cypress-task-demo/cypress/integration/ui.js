/// <reference types="cypress" />
// @ts-check

import { enterTodo, resetDatabase } from './utils'

describe('UI', () => {
  beforeEach(resetDatabase)
  beforeEach(() => {
    cy.visit('/')
  })

  it('adds todo', () => {
    // random text to avoid confusion
    const id = Cypress._.random(1, 1e6)
    const title = `todo ${id}`
    enterTodo(title)
    // confirm the new item has been added to the list
    cy.contains('.todoapp li', title)
  })
})
