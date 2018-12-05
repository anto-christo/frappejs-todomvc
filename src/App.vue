<template>
	<Todo/>
</template>
<script>
import frappe from 'frappejs';
import common from 'frappejs/common';
import models from '../models';
import SQLite from 'frappejs/backends/sqlite';
import Observable from 'frappejs/utils/observable';
import Todo from './components/Todo.vue'
import path from 'path';

window.frappe = frappe;
frappe.init();
frappe.registerLibs(common);
frappe.registerModels(models);
frappe.fetch = window.fetch.bind();
frappe.docs = new Observable();

async function connectToDatabase() {
    const dbPath = path.resolve(process.cwd(),'test.db');
    frappe.isServer = true;
    frappe.login('Administrator');
    frappe.db = new SQLite({ dbPath: dbPath });
    await frappe.db.connect();
    await frappe.db.migrate();
}

connectToDatabase();

export default {
    components: {
		Todo
	}
}
</script>