import Vue from 'vue'
import App from './App'
import router from './router'
//导入全局样式表
import './assets/css/global.css'
// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入iconfont的css
import './assets/icon/iconfont.css'
// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'


// 使用element-ui
Vue.use(ElementUI);
// 使用axios
Vue.use(VueAxios, axios);


// 设置axios请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
// 请求拦截   request表示请求的整个对象
axios.interceptors.request.use(request =>{
  // 向请求头中添加字段Authorization
  request.headers.Authorization = window.sessionStorage.getItem('token');
  return request;
});


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
