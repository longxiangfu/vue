<template>
  <div>
    <h1>首页</h1>
    <div>
      <router-link to="/user/list">用户列表</router-link>
      <!--参数传递1.将对象绑定到组件router-link的to属性上，name组件名  params传递参数-->
      <router-link :to="{name:'UserProfile', params:{id:1}}">用户信息</router-link>
      <!--重定向2-->
      <router-link to="/goHome">返回首页</router-link>
      <span>用户名：{{userName}}</span>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Main",
        props: ['userName']
    }
</script>

<style scoped>

</style>
