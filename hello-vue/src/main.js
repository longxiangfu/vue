// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 导入router,此处是首字母小写，避免与router/index.js中重复
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// axios 1.引入
import axios from 'axios'
import VueAxios from 'vue-axios'


// 使用
Vue.use(router);
Vue.use(ElementUI);
Vue.use(VueAxios, axios); // axios 2.使用


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
