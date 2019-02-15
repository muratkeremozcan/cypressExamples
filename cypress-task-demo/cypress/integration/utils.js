// @ts-check
export const resetDatabase = () => {
  cy.log('reset database')
  cy.request({
    method: 'POST',
    url: '/reset',
    body: {
      todos: []
    },
    log: false
  })
}

export const enterTodo = (text = 'example todo') => {
  cy.get('.todoapp .new-todo').type(`${text}{enter}`)
}
