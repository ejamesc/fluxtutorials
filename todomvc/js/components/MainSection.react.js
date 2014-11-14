var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');
var TodoItem = require('./TodoItem.react');

var MainSection = React.createClass({

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section will be hidden by default 
    // and only shown when there are todos.
    if (Object.keys(this.props.allTodos).length < 1) {
      return null;
    }

    var allTodo = this.props.allTodos;
    var todos = [];

    for (var key in allTodos) {
      todos.push(<TodoItem key={key} todo={allTodos[key]} />);
    }

    return (
        <section id="main">
          <input
            id="toggle-all"
            type="checkbox"
            onChange={this._onToggleCompleteAll}
            checked={this.props.areAllComplete ? 'checked' : ''}
          />
          <label htmlFor="toggle-all">Mark all as complete, you doofus</label>
          <ul id="todo-list">{todos}</ul>
        </section>
        );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    TodoActions.toggleCompleteAll();
  }
});

module.exports = MainSection;
