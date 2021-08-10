<template>
    <!--登录容器-->
    <div class="login_container">
      <!--登录盒子-->
      <div class="login_box">
        <!--头像盒子-->
        <div class="avatar_box">
          <!--图片-->
          <img src="../assets/logo.png">
        </div>
        <!--登录表单区域-->
        <el-form ref="loginFormRef" label-width="0px" class="login_form" v-bind:model="loginForm" v-bind:rules="loginFormRules">
          <!--用户名-->
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-vue_learnyonghu" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-vue_learnmima" show-password v-model="loginForm.password"></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item class="btns">
            <el-button type="success" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
          return {
            loginForm: {
              username: 'admin',
              password: '123456'
            },
            loginFormRules: {
              username: [
                { required: true, message: '请输入登录用户名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '请输入登录密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
              ]
            }
          }
        },
        methods: {
          // 点击重置按钮，重置登录表单
          resetLoginForm: function () {
            this.$refs.loginFormRef.resetFields();
          },
          // 登录前表单数据的预验证，验证后会调用表单对象的validate方法
          login: function () {
            this.$refs.loginFormRef.validate((valid, noPassParams) => {
              if (!valid) return;
              this.axios.post('login', this.loginForm)
                .then(response =>{
                  if (response.data.meta.status != 200) return this.$message.error("登录失败");
                  this.$message.success("登录成功");
                  // 1. 将登录成功之后的token,保存到客户端的sessionStorage中（因为token只应该在当前网站打开期间生效）
                  window.sessionStorage.setItem("token", response.data.data.token);
                  // 2. 登录成功后跳转到主页，路由地址是 /home
                  this.$router.push("/home")
                })
                .catch(error => {
                  console.log(error);
                });
            });
          }
        }
    }
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box{ // less时可以这样嵌套
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;// 盒子阴影 10px：向外扩散10像素
      position: absolute;
      left: 50%; // avatar_box距离父容器左边50%
      transform: translate(-50%, -50%); // 相对父容器向左向上移动自身一半距离
      background-color: #fff;
      img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .btns{
    display: flex; // 弹性显示
    justify-content: flex-end; // 调整内容为弹性居末尾
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px; // padding上下0左右20
    box-sizing: border-box; // 设置的边框border和内边距padding包含在width内
  }
</style>
