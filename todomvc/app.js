var React = require('react');

var TodoApp = require('./components/TodoApp.react');

React.renderComponent(
    <TodoApp />,
    document.getElementById('todoapp')
);
