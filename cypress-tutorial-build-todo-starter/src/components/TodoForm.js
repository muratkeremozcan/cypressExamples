import React from 'react';

export default props => (
  <form onSubmit={props.handleToDoSubmit}>
    <input
      type="text"
      autoFocus
      value={props.currentTodo}
      onChange={props.handleNewToDoChange}
      className="new-todo"
      placeholder="What needs to be done?"
    />
  </form>
);
