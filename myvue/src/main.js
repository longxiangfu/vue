// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'  // 5.自动扫描里面的默认配置index.js

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // 6.启用路由
  router,
  components: { App },
  template: '<App/>'
})
