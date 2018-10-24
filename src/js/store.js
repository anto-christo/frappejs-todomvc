/*jshint unused:false */
const frappe = require('frappejs');
(function (exports) {

	'use strict';

	// var STORAGE_KEY = 'todos-vuejs';

	exports.todoStorage = {
		insert: function (name) {
			const event = frappe.newDoc({
				doctype: 'Event',
				name
			});
			event.insert().then(() => {
				this.retrieveEvents();
			});
		},
		fetch: async function () {
			return await frappe.db.getAll({
				doctype: 'ToDo',
				fields: ["*"]
			});
		},
		deleteAll: async function(prevTodos) {
			Promise.all(prevTodos.map(async (todo) => {
				let newTodo = await frappe.getDoc('ToDo', todo.name);
				await newTodo.delete();
			}));
		},
		updateAll: async function(newTodos) {
			Promise.all(prevTodos.map(async (todo) => {
				const newTodo = frappe.newDoc({
					doctype: 'ToDo',
					name: todo.name,
					status: todo.status
				});
				await newTodo.insert();
			}));
		},
		save: async function (todos) {
			let prevTodos = await this.fetch();
			await this.deleteAll(prevTodos);
			await this.updateAll(todos);
		}
	};

})(window);
