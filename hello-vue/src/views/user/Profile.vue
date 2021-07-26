<template>
  <div>
    <h1>用户信息</h1>
    <!--参数传递3.接收参数    this.$route:访问当前路由-->
    <!--{{this.$route.params.id}}-->
    <!--参数传递6.第二种参数传递方法，获取参数-->
    {{id}}
    <!--axios 5.展示响应结果-->
    <div>{{dataInfo.name}}</div>
  </div>
</template>

<script>
    export default {
        // 参数传递5.第二种参数传递方法,在该组件中用props接收参数
        props: ['id'],
        name: "UserProfile",
        beforeRouteEnter: function (to, from, next) {
          console.log("进入路由之前");
          //axios 3. 钩子函数中利用vm，调用vm的方法。vm指的是vue实例
          next(vm => {
            vm.getData();
          });
        },
        beforeRouteLeave:(to, from, next)=>{
          console.log("离开路由之前");
          next();
        },
        data(){
          return{
            dataInfo: {
              name: ''
            }
          }
        },
        methods: {
          getData: function () {
            // axios 4.请求
            this.axios({
              method: 'get',
              url: 'http://localhost:8080/static/mock/axios.json', // 模拟请求，获取数据
            }).then(response => {
              console.log(response);
              this.dataInfo = response.data; // 将响应数据赋值给变量dataInfo
            });
          }
        }
    }
</script>

<style scoped>

</style>
