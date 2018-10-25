/*global Vue, todoStorage */
import Vue from 'vue/dist/vue.js';
import todoStorage from './store.js';

const frappe = require('frappejs');
const common = require('frappejs/common')
const models = require('../../models');
const coreModels = require('frappejs/models');
const HTTPClient = require('frappejs/backends/http');
const Observable = require('frappejs/utils/observable');

const server = 'localhost:8000';
window.frappe = frappe;
frappe.init();
frappe.registerLibs(common);
frappe.registerModels(coreModels);
frappe.registerModels(models);
frappe.fetch = window.fetch.bind();
frappe.db = new HTTPClient({ server });
frappe.docs = new Observable();

(function (exports) {

	'use strict';

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.todoapp',

		// app initial state
		data: {
			todos: [],
			newTodo: '',
			isChecked: 0,
			editedTodo: null,
			visibility: 'all',
			remaining: 0
		},

		async created() {
			await this.getAllTodo();
		},

		methods: {

			pluralize: function (word, count) {
				return word + (count === 1 ? '' : 's');
			},

			addTodo: async function () {
				var value = this.newTodo && this.newTodo.trim();
				if (!value) {
					return;
				}
				await todoStorage.insert(value);
				this.newTodo = '';
				await this.getAllTodo();
			},

			getAllTodo: async function () {
				this.todos = await todoStorage.fetch();
				await this.countRemaining();
			},

			toggleStatus: async function(name) {
				await todoStorage.updateStatus(name);
				await this.countRemaining();
			},

			toggleAllStatus: async function() {
				await todoStorage.updateAllStatus();
				await this.getAllTodo();
			},

			deleteTodo: async function (name) {
				await todoStorage.remove(name);
				await this.getAllTodo();
			},

			editTodo: function (todo) {
				this.beforeEdit = todo.name;
				this.editedTodo = todo;
			},

			updateTodo: async function (name, value) {
				if (!this.editedTodo) {
					return;
				}
				this.editedTodo = null;
				value = value.trim();
				if (!value) {
					await this.deleteTodo(name);
				} else {
					await todoStorage.update(name, value);
				}
				await this.getAllTodo();
			},

			selectActive: async function() {
				this.todos = await todoStorage.selectActive();
			},

			selectCompleted: async function() {
				this.todos = await todoStorage.selectCompleted();
			},

			removeCompleted: async function () {
				await todoStorage.removeCompleted();
				await this.getAllTodo();
			},

			countRemaining: async function () {
				this.remaining = await todoStorage.countRemaining();
			}
		},

		directives: {
			'todo-focus': function (el, binding) {
				if (binding.value) {
					el.focus();
				}
			}
		}
	});

})(window);
