require('todomvc-common/base.css');
require('todomvc-app-css/index.css');
require('todomvc-common/base.js');
require('./js/store.js');

import Vue from 'vue/dist/vue.js';
import App from './App.vue';

new Vue({
	el: '#todo',
	template: '<App/>',
	components: {App},
});