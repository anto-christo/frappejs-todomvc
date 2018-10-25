<template>
    <div>
        <section class="todoapp" v-cloak>
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" v-model="newTodo" @keyup.enter="addTodo">
        </header>
        <section class="main" v-show="todos.length">
            <input id="toggle-all" class="toggle-all" type="checkbox" v-on:change="toggleAllStatus()">
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                <li class="todo" v-for="todo in todos" :key="todo.name" :class="{completed: todo.completed, editing: todo == editedTodo}">
                    <div class="view">
                        <input class="toggle" type="checkbox" v-model="todo.completed" v-on:change="toggleStatus(todo.name)">
                        <label @dblclick="editTodo(todo)">{{todo.title}}</label>
                        <button class="destroy" @click="deleteTodo(todo.name)"></button>
                    </div>
                    <input class="edit" type="text" v-model="todo.title" v-todo-focus="todo == editedTodo" @blur="updateTodo(todo.name, todo.title)" @keyup.enter="updateTodo(todo.name, todo.title)" @keyup.esc="cancelEdit(todo)">
                </li>
            </ul>
        </section>
        <footer class="footer" v-show="totalTodo">
            <span class="todo-count">
                <strong v-text="remaining"></strong> {{pluralize('item', remaining)}} left
            </span>
            <ul class="filters">
                <li><a :class="{selected: visibility == 'all'}" v-on:click="selectAll">All</a></li>
                <li><a :class="{selected: visibility == 'active'}" v-on:click="selectActive">Active</a></li>
                <li><a :class="{selected: visibility == 'completed'}" v-on:click="selectCompleted">Completed</a></li>
            </ul>
            <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
                Clear completed
            </button>
        </footer>
    </section>
    <footer class="info">
        <p>Double-click to edit a todo</p>
    </footer>
    </div>
</template>

<script>
import todoStorage from '../js/store.js';
export default {
    name: 'Todo',

    data: function() {
        return {
			todos: [],
			totalTodo: 0,
            newTodo: '',
            editedTodo: null,
            visibility: 'all',
            remaining: 0
        }
	},

	async created() {
		await this.getAllTodo();
	},

	methods: {

		pluralize: function (word, count) {
			return word + (count === 1 ? '' : 's');
		},

		addTodo: async function () {
			this.visibility = 'all';
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
			this.totalTodo = this.todos.length;
			await this.countRemaining();
		},

		toggleStatus: async function(name) {
			await todoStorage.updateStatus(name);
			await this.countRemaining();
		},

		toggleAllStatus: async function() {
			let status = await todoStorage.checkAllStatus();
			await todoStorage.updateAllStatus(status);
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

		selectAll: async function() {
			this.visibility = 'all';
			this.getAllTodo();
		},
 
		selectActive: async function() {
			this.visibility = 'active';
			this.todos = await todoStorage.selectActive();
		},

		selectCompleted: async function() {
			this.visibility = 'completed'
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
}
</script>