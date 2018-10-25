<template>
	<Todo/>
</template>
<script>
import frappe from 'frappejs';
import common from 'frappejs/common';
import models from '../models';
import HTTPClient from 'frappejs/backends/http';
import Observable from 'frappejs/utils/observable';
import Todo from './components/Todo.vue'

const server = 'localhost:8000';
window.frappe = frappe;
frappe.init();
frappe.registerLibs(common);
frappe.registerModels(models);
frappe.fetch = window.fetch.bind();
frappe.db = new HTTPClient({ server });
frappe.docs = new Observable();

export default {
    components: {
		Todo
	}
}
</script>