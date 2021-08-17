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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单区域-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff"
                 :unique-opened="true" :router="true" :collapse="isCollapse" :collapse-transition="false"
                 :default-active="activePath">
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
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)">
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
          // 组件创建完成后直接获取菜单列表
          this.getMenuList();
          // 组件创建完成后或刷新后，从sessionStorage中获取二级菜单的激活路径，并赋值给变量activePath
          this.activePath = window.sessionStorage.getItem("activePath");
        },
        data(){
          return {
            // 左侧菜单数据
            menuList: [],
            // 是否折叠
            isCollapse: false,
            // 激活的菜单路径
            activePath: ''
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
                console.error(error);
                this.$message.error("获取菜单 异常");
            });
          },
          // 切换菜单的折叠与展开
          toggleCollapse() {
            this.isCollapse = !this.isCollapse;
          },
          // 保存导航状态。点击二级菜单，将index赋值给变量，并且将变量保存到sessionStorage中
          saveNavState(activePath){
            this.activePath = activePath;
            window.sessionStorage.setItem("activePath", activePath);
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
  .toggle-button {
    background-color: #4a5064;
    line-height: 24px; // 行高
    text-align: center; // 文本居中
    font-size: 10px; // 字体大小
    color: #fff; // 字体颜色
    letter-spacing: 0.2em; // 字母间隔
    cursor: pointer; // 光标为手指
  }

</style>
