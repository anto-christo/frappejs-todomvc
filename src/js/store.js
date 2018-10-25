/*jshint unused:false */

// (function (exports) {

// 	'use strict';

//  	var STORAGE_KEY = 'todos-vuejs';

// 	exports.todoStorage = {
// 		fetch: function () {
// 			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
// 		},
// 		save: function (todos) {
// 			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
// 		}
// 	};

// })(window);

module.exports = {
	fetch: async function() {
		return await frappe.db.getAll({ doctype:'Todos', fields:["*"] });
	},

	insert: async function(todo) {
		const doc = frappe.newDoc({
			doctype: 'Todos',
			title: todo,
			completed: false
		});
		await doc.insert();
	},

	remove: async function(name) {
		let todo = await frappe.getDoc('Todos', name);
		await todo.delete();
	},

	removeCompleted: async function() {
		let todos = await this.selectCompleted();
		console.log(todos);
		for(let todo of todos) {
			let doc = await frappe.getDoc('Todos', todo.name);
			await doc.delete();
		}
	},

	update: async function(name, value) {
		let todo = await frappe.getDoc('Todos', name);
		todo.title = value;
		await todo.update();
	},

	updateStatus: async function(name) {
		let todo = await frappe.getDoc('Todos', name);
		todo.completed = 1 - todo.completed;
		await todo.update();
	},

	checkAllStatus: async function() {
		let allComplete = 1;
		let status = 0;
		let todos = await frappe.db.getAll({ doctype:'Todos', fields:["*"] });
		for(let todo of todos) {
			let doc = await frappe.getDoc('Todos', todo.name);
			if(doc.completed == 0) {
				allComplete = 0;
			}
		}
		if(allComplete) {
			status = 0;
		} else {
			status = 1;
		}
		this.updateAllStatus(todos, status);
		return status;
	},

	updateAllStatus: async function(todos, status) {
		for(let todo of todos) {
			let doc = await frappe.getDoc('Todos', todo.name);
			doc.completed = status;
			await doc.update();
		}
	},

	selectActive: async function() {
		return await frappe.db.getAll({doctype:'ToDos', fields:['*'], filters: {completed: 0}});
	},

	selectCompleted: async function() {
		return await frappe.db.getAll({doctype:'ToDos', fields:['*'], filters: {completed: 1}});
	},

	countRemaining: async function() {
		let todos = await this.selectActive();
		console.log(todos.length);
		return todos.length;
	}
}
