import Vue from 'vue'
import Router from 'vue-router'

import Main from "../views/Main";
import Login from "../views/Login";

import UserList from '../views/user/List'
import UserProfile from '../views/user/Profile'
import NotFound from '../views/NotFound'

Vue.use(Router);


export default new Router({
  // export type RouterMode = 'hash' | 'history' | 'abstract'
  // 模式history：去掉中间的#
  mode: 'history',
  routes: [
    {
      path: '/main/:userName',
      props: true,
      component: Main,
      children: [ // 嵌套路由，即路由中嵌套路由，在路由组件中跳转到别的路由组件
        {path: '/user/list', component: UserList, name: 'UserList'},
        // 参数传递2.路径后面接收
        // {path: '/user/profile/:id', component: UserProfile, name: 'UserProfile'},
        // 参数传递4.第二种参数传递方法:设置props: true
        {
          path: '/user/profile',
          component: UserProfile,
          name: 'UserProfile',
          props: true
        },
      ]
    },
    {
      path: '/login',
      component: Login
    },
    // 重定向1
    {
      path: '/goHome',
      redirect: '/main'
    },
    // 404
    {
      path: '*',
      component: NotFound
    }
  ]
});
