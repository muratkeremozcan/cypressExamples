import * as React from "react";
import styled from "styled-components";

const StyledMiniState = styled.div`
  padding: 0.25rem;
  text-align: center;
  border: 2px solid #c2c6cc;
  margin: 0.125rem;
  flex-grow: 0;
  flex-shrink: 1;

  & > .children {
    display: none;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  &[data-open='true'] > .children {
    display: flex;
  }

  &[data-active='true'] {
    border-color: #0071c4;
  }

  [data-type='parallel'] > .children > & {
    border-style: dashed;
  }

  &[data-type='history'] {
    opacity: 0.5;
  }
`;

export class StateViewer extends React.Component {
  state = {
    toggleStates: {}
  };
  renderStates(stateNode) {
    const { state } = this.props;

    return (
      <StyledMiniState
        key={stateNode.id}
        data-open={
          this.state.toggleStates[stateNode.id] === undefined
            ? true
            : this.state.toggleStates[stateNode.id]
        }
        data-type={stateNode.type}
        data-active={state.matches(stateNode.path.join("."))}
        onClick={e => {
          e.stopPropagation();
          this.setState({
            toggleStates: {
              ...this.state.toggleStates,
              [stateNode.id]:
                this.state.toggleStates[stateNode.id] === undefined
                  ? false
                  : !this.state.toggleStates[stateNode.id]
            }
          });
        }}
      >
        <strong>{stateNode.key}</strong>
        <div className="children">
          {Object.keys(stateNode.states || []).map(key => {
            const childStateNode = stateNode.states[key];

            return this.renderStates(childStateNode);
          })}
        </div>
      </StyledMiniState>
    );
  }
  render() {
    const { machine, state } = this.props;

    const stateNodes = machine.getStateNodes(state);
    const events = new Set();

    stateNodes.forEach(stateNode => {
      const potentialEvents = Object.keys(stateNode.on);

      potentialEvents.forEach(event => {
        const transitions = stateNode.on[event];

        transitions.forEach(transition => {
          if (transition.target !== undefined) {
            events.add(event);
          }
        });
      });
    });

    return (
      <section
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          background: "white"
        }}
      >
        <pre
          style={{
            maxHeight: "10vh",
            overflowY: "auto"
          }}
        >
          {JSON.stringify(state.context, null, 2)}
        </pre>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%"
          }}
        >
          {this.renderStates(this.props.machine)}
        </div>
      </section>
    );
  }
}
