const {
  getShortestValuePaths,
  deserializeStateString
} = require('xstate/lib/graph')
const {join} = require('path')
const { ticTacToeMachine } = require(join('..', 'src', 'machine'))

const shortestValuePaths = getShortestValuePaths(ticTacToeMachine, {
  events: {
    PLAY: [
      { type: 'PLAY', value: 0 },
      { type: 'PLAY', value: 1 },
      { type: 'PLAY', value: 2 },
      { type: 'PLAY', value: 3 },
      { type: 'PLAY', value: 4 },
      { type: 'PLAY', value: 5 },
      { type: 'PLAY', value: 6 },
      { type: 'PLAY', value: 7 },
      { type: 'PLAY', value: 8 }
    ]
  },
  filter: state => {
    // return state.context.moves <= 5;
    return true;
  }
});

const drawPaths = Object.keys(shortestValuePaths).filter(stateString => {
  const { value, context } = deserializeStateString(stateString);

  return value === 'draw';
});

function deserializeEventString(eventString) {
  const [type, payload] = eventString.split(' | ');

  return {
    type,
    ...(payload ? JSON.parse(payload) : {})
  };
}

const {writeFileSync} = require('fs')
const str = JSON.stringify(drawPaths, null, 2) + '\n\n'
const filename = join(__dirname, '..', 'cypress', 'fixtures', 'draws.json')
writeFileSync(filename, str, 'utf8')
console.log('saved fixture file with all paths that end in a draw %s', filename)

writeFileSync(join(__dirname, '..', 'cypress', 'fixtures', 'shortest.json'),
  JSON.stringify(shortestValuePaths, null, 2) + '\n\n', 'utf8')
