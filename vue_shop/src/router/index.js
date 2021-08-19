import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/login', component: Login},
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',component: Welcome
        },
        {
          path: '/users', component: Users
        },
        {
          path: '/rights', component: Rights
        },
        {
          path: '/roles', component: Roles
        }
      ]
    },
    //当路径是/时重定向到登录路径
    {path: '/', redirect: '/login'}
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) =>{
  // to要访问的路径 form从哪个路径跳转而来
  // next 是一个函数 表示放行
  //    next()放行   next('')强制跳转
  if (to.path === '/login') return next(); // 如果路径是'/login'直接放行
  const tokenStr = window.sessionStorage.getItem('token'); // 如果路径不是'login',那么获取存储的token
  if (!tokenStr) return next('/login'); // 如果token不存在，则强制跳转
  next() // 如果token存在，放行
})

export default router
