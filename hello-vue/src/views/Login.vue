<template>
  <div>
    <h1>登录页</h1>
    <input type="text" v-model="userName"></input>
    <button v-on:click="toMain">去往首页</button>
  </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
          return{
            userName: ""
          }
        },
        methods: {
          toMain: function () {
            // this.$alert("去往首页");
            this.$router.push("/main/" + this.userName); //跳转首页  this.$router：访问路由器
          }
        }
    }
</script>

<style scoped>

</style>
