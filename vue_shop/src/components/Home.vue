<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/home.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <!--侧边栏菜单区域-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff"
                 :unique-opened="true" :router="true">
          <!--一级菜单  el-submenu可以展开;for的每一项指定唯一的key;-->
          <el-submenu v-bind:index="item.id+''" v-for="item in menuList" :key="item.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="'iconfont icon-vue_learn' + item.id"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单 el-menu-item不能展开-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <!--二级菜单的模板区域-->
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        name: "Home",
        // Home组件创建完成之后执行的钩子
        created(){
          this.getMenuList();
        },
        data(){
          return {
            // 左侧菜单数据
            menuList: []
          }
        },
        methods: {
          // 退出
          logout: function () {
            window.sessionStorage.clear(); // 清空token
            this.$router.push("/login"); // 跳转到登录页
          },
          getMenuList(){
            this.axios.get('/menus')
              .then(response =>{
                if (response.data.meta.status != 200) return this.$message.error(response.data.meta.msg);
                this.menuList = response.data.data;
            }).catch(error =>{
                console.log(error);
                this.$message.error("获取菜单失败");
            });
          }
        }
    }
</script>

<style lang="less" scoped>
  .el-header { // el标签的类名就是class
    background: #373d41;
    display: flex; // 指定为弹性布局
    justify-content: space-between; //flex项目在主轴上的对齐方式：flex项目中间有间隔
    padding-left: 0;
    align-items: center; // 居中对齐弹性盒子的各项
    color: #fff; // 文本颜色
    font-size: 18px; // 文本字体大小
    > div { // less语法 嵌套
      display: flex;
      align-items: center; // div中的文本相对dev居中
      > span {
        margin-left: 15px;
      }
      > img {
        border-radius: 20px;
      }
    }
  }
  .el-aside {
    background: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background: #eaedf1;
  }
  .home-container {
    height: 100%;
  }

</style>
