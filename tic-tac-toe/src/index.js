import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { interpret } from "xstate/lib/interpreter";
import { ticTacToeMachine } from "./machine";
import "./styles.css";


function range(start, end) {
  return Array(end - start)
    .fill(null)
    .map((_, i) => i + start);
}

const StyledTicTacToeGrid = styled.div`
  height: 50vmin;
  width: 50vmin;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 1rem;
`;

const StyledTile = styled.div`
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.05);

  &[data-player="x"] {
    &:before,
    &:after {
      content: "";
      position: absolute;
      height: 100%;
      width: 0.2rem;
      background: red;
      left: calc(50% - 0.1rem);
      top: 0;
    }

    &:before {
      transform: rotate(-45deg);
    }
    &:after {
      transform: rotate(45deg);
    }
  }

  &[data-player="o"] {
    &:before {
      content: "";
      height: 80%;
      width: 80%;
      left: 10%;
      top: 10%;
      position: absolute;
      border-radius: 50%;
      border: 0.2rem solid blue;
    }
  }
`;

const StyledGame = styled.section`
  h2 {
    font-family: Proxima Nova, sans-serif;
    font-weight: bold;
    font-size: 2rem;
  }
`;

class TicTacToeGrid extends React.Component {
  machine = ticTacToeMachine;
  state = {
    currentState: this.machine.initialState
  };
  interpreter = interpret(this.machine).onTransition(currentState => {
    this.setState({ currentState });
    console.log(JSON.stringify(currentState, null, 2));
  });
  componentDidMount() {
    this.interpreter.start();
  }
  renderTitle() {
    const { currentState } = this.state;

    if (currentState.matches("playing")) {
      return <h2>Player {currentState.context.player.toUpperCase()}</h2>;
    }

    if (currentState.matches("winner")) {
      return <h2>Player {currentState.context.winner.toUpperCase()} wins!</h2>;
    }

    if (currentState.matches("draw")) {
      return <h2>Draw</h2>;
    }
  }
  render() {
    const { currentState } = this.state;
    const { send } = this.interpreter;
    const player = currentState.context.player;

    return (
      <StyledGame>
        {this.renderTitle()}
        <StyledTicTacToeGrid>
          {range(0, 9).map(i => {
            return (
              <StyledTile
                key={i}
                onClick={_ => send({ type: "PLAY", player, value: i })}
                data-player={currentState.context.board[i]}
                data-testid={`square-${i}`}
              />
            );
          })}
        </StyledTicTacToeGrid>
      </StyledGame>
    );
  }
}

class App extends Component {
  render() {
    return <TicTacToeGrid />;
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
