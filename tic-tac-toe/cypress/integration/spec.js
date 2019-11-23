/// <reference types="cypress" />

// load previously computed paths
const shortestValuePaths = require('../fixtures/shortest')
const draws = require('../fixtures/draws')
const winnerX = require('../fixtures/winner-x')
const winnerO = require('../fixtures/winner-o')

function deserializeEventString(eventString) {
  const [type, payload] = eventString.split(' | ');

  return {
    type,
    ...(payload ? JSON.parse(payload) : {})
  };
}

const eventMap = {
  PLAY: event => {
    const selector = `[data-testid="square-${event.value}"]`
    cy.get(selector).click()
  }
};

const play = (pathConfig) => {
  for (const { state, event: eventString } of pathConfig) {
    if (!eventString) {
      continue;
    }
    const event = deserializeEventString(eventString);
    const realEvent = eventMap[event.type];

    if (realEvent) {
      realEvent(event);
    }
  }
}

const winnerXPath = shortestValuePaths[winnerX[0]]
const winnerOPath = shortestValuePaths[winnerO[0]]

describe('Tic Tac Toe', () => {
  beforeEach(() => {
    cy.visit('/')
    // this is how we know the app UI is ready
    cy.contains('h2', /^Player X$/)
  })

  it('player X wins', () => {
    play(winnerXPath)
    cy.contains('h2', 'Player X wins!')
  })

  it('player O wins', () => {
    play(winnerOPath)
    cy.contains('h2', 'Player O wins!')
  })

  draws.forEach((draw, k) => {
    it(`plays to a draw ${k}`, () => {
      const drawPath = shortestValuePaths[draw]
      play(drawPath)
      cy.contains('h2', 'Draw')
    })
  })
})

// makes the end of the video better
after(() => {
  cy.wait(2000, {log: false})
})
