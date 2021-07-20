<template>
  <div id="app">
    <h1>Vue-Router</h1>
    <!--7.使用路由-->
    <router-link to="/main">首页</router-link>
    <router-link to="/content">内容页</router-link>
    <!--展示组件-->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
