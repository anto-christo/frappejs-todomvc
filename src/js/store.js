module.exports = {
	fetch: async function() {
		return await frappe.db.getAll({ doctype:'ToDo', fields:["*"] });
	},

	insert: async function(todo) {
		const doc = frappe.newDoc({
			doctype: 'ToDo',
			title: todo,
			completed: false
		});
		await doc.insert();
	},

	remove: async function(name) {
		let todo = await frappe.getDoc('ToDo', name);
		await todo.delete();
	},

	removeCompleted: async function() {
		let todos = await this.selectCompleted();
		for(let todo of todos) {
			let doc = await frappe.getDoc('ToDo', todo.name);
			await doc.delete();
		}
	},

	update: async function(name, value) {
		let todo = await frappe.getDoc('ToDo', name);
		todo.title = value;
		await todo.update();
	},

	updateStatus: async function(name) {
		let todo = await frappe.getDoc('ToDo', name);
		todo.completed = 1 - todo.completed;
		await todo.update();
	},

	updateAllStatus: async function() {
		let status;
		let todos = await this.selectActive();
		if(todos.length > 0) {
			status = 1;
		} else {
			status = 0;
		}
		let allTodos = await this.fetch();
		for(let todo of allTodos) {
			let doc = await frappe.getDoc('ToDo', todo.name);
			doc.completed = status;
			await doc.update();
		}
	},

	selectActive: async function() {
		return await frappe.db.getAll({doctype:'ToDo', fields:['*'], filters: {completed: 0}});
	},

	selectCompleted: async function() {
		return await frappe.db.getAll({doctype:'ToDo', fields:['*'], filters: {completed: 1}});
	},

	countRemaining: async function() {
		let todos = await this.selectActive();
		return todos.length;
	}
}
