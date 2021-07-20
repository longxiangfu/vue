import Vue from 'vue'
import VueRouter from 'vue-router'

import Content from '../components/Content'
import Main from '../components/Main'

// 1.安装路由
Vue.use(VueRouter);

// 2.配置 导出路由
export default new VueRouter({
  routes: [
    {
      // 3.路由路径
      path: '/content',
      // 4.跳转的组件
      component: Content
    },
    {
      // 路由路径
      path: '/main',
      // 跳转的组件
      component: Main
    }
  ]
});

