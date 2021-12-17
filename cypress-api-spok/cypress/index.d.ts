/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export {}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /** the meaning of life */
      customCommand(): Chainable<number>
    }
  }
}
