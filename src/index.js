require('todomvc-common/base.css');
require('todomvc-app-css/index.css');
require('todomvc-common/base.js');
require('./js/store.js');
require('./js/routes.js');

import Vue from 'vue/dist/vue.js';
import App from './App.vue';

new Vue({
	el: '#todoapp',
	template: '<App/>',
	components: {App},
});