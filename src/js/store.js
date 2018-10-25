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
		let status;
		let todos = await this.selectActive();
		if(todos.length > 0) {
			status = 1;
		} else {
			status = 0;
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
