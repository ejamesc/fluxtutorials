var AppDispatcher = require('../dispatcher/AppDispatche');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

// This lives inside the closure of the module, but outside of the class, so it
// is effectively private. It can only be accessed through functions provided
// by the TodoStore object, below.
var _todos = {};

/**
 * Create a TODO item.
 * @parem {string} text The content of the TODO
 */
function create(text) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _todos[id] = {
    id: id, 
    complete: false,
    text: text
  };
}

/**
 * Update a TODO item.
 * @param {string} id
 * @param {object} updates an object literal containing only the data to be
 * updated.
 */
function update(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
}

/**
 * Update all of the TODO items with the same object. Used to make all TODOs as
 * completed. @param {objects} updates An object literal containing only the
 * data to be updated.
 */
function updateAll(updates) {
  for (var id in _todos) {
    update(id, updates);
  }
}

/**
 * Delete a TODO item.
 * @params {string} id
 */
function destroy(id) {
  delete _todos[id];
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  for (var id in _todos) {
    if (_todos[id].complete) {
      destroy(id);
    }
  }
}

var TodoStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining TODO items are marked as completed. 
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _todos) {
      if (!_todos[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// This is where the user-started actions are dispatched out
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
      } 
      break;

    case TodoConstants.TODO_COMPLETE:
      update(action.id, {complete: true});
      break;

    case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (TodoStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      break;

    case TodoConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false});
      break;
    
    case TodoConstants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
      }
      break;

    case TodoConstants.TODO_DESTROY:
      destroy(action.id);
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
      break;

    // If there's no case triggered, skip the emitChange and just return
    default: 
      return true;
  }

  // Emit a change after each case occurs, as above.
  TodoStore.emitChange();

  return true; // No errors. Needed by the promise in the Dispatcher, apparently.
});

module.exports = TodoStore;
