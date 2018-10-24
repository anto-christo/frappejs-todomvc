/*global Vue, todoStorage */
import Vue from 'vue/dist/vue.js';

(function (exports) {

	'use strict';

	var filters = {
		all: function (todos) {
			return todos;
		},
		active: function (todos) {
			return todos.filter(function (todo) {
				return todo.status == "incomplete";
			});
		},
		completed: function (todos) {
			return todos.filter(function (todo) {
				return todo.status == "complete";
			});
		}
	};

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.todoapp',

		// app initial state
		data: {
			todos: todoStorage.fetch(),
			newTodo: '',
			editedTodo: null,
			visibility: 'all'
		},

		// watch todos change for localStorage persistence
		watch: {
			todos: {
				deep: true,
				handler: todoStorage.save
			}
		},

		// computed properties
		// http://vuejs.org/guide/computed.html
		computed: {
			filteredTodos: function () {
				return filters[this.visibility](this.todos);
			},
			remaining: function () {
				return filters.active(this.todos).length;
			},
			allDone: {
				get: function () {
					return this.remaining === 0;
				},
				set: function (value) {
					this.todos.forEach(function (todo) {
						if(value)
							todo.status = "complete";
						else
							todo.status = "incomplete";
					});
				}
			}
		},

		// methods that implement data logic.
		// note there's no DOM manipulation here at all.
		methods: {

			pluralize: function (word, count) {
				return word + (count === 1 ? '' : 's');
			},

			addTodo: function () {
				var value = this.newTodo && this.newTodo.trim();
				if (!value) {
					return;
				}
				this.todos.push({ id: this.todos.length + 1, name: value, status: "incomplete" });
				this.newTodo = '';
			},

			removeTodo: function (todo) {
				var index = this.todos.indexOf(todo);
				this.todos.splice(index, 1);
			},

			editTodo: function (todo) {
				this.beforeEditCache = todo.name;
				this.editedTodo = todo;
			},

			doneEdit: function (todo) {
				if (!this.editedTodo) {
					return;
				}
				this.editedTodo = null;
				todo.name = todo.name.trim();
				if (!todo.name) {
					this.removeTodo(todo);
				}
			},

			cancelEdit: function (todo) {
				this.editedTodo = null;
				todo.name = this.beforeEditCache;
			},

			removestatus: function () {
				this.todos = filters.active(this.todos);
			}
		},

		// a custom directive to wait for the DOM to be updated
		// before focusing on the input field.
		// http://vuejs.org/guide/custom-directive.html
		directives: {
			'todo-focus': function (el, binding) {
				if (binding.value) {
					el.focus();
				}
			}
		}
	});

})(window);
