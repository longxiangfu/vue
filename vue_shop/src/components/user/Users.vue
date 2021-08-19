<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <!--搜索与添加区域  layout布局-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="185px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!--分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form ref="addFormRef" label-width="70px" v-bind:model="addForm" v-bind:rules="addFormRules">
        <!--用户名-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="addForm.password"></el-input>
        </el-form-item>
        <!--邮箱-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!--手机-->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!--内容主体区域-->
      <el-form ref="editFormRef" label-width="70px" v-bind:model="editForm" v-bind:rules="editFormRules">
        <!--用户名-->
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!--邮箱-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!--手机-->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色对话框-->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <!--内容主体区域-->
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Users",
    data() {
      // 验证邮箱的规则
      var checkEmail = (rule, value, callback) => {
        const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (regEmail.test(value)) return callback();
        callback(new Error('请输入合法的邮箱'));
      };
      // 验证手机号的规则
      var checkMobile = (rule, value, callback) => {
        const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (regMobile.test(value)) return callback();
        callback(new Error('请输入合法的手机号'));
      };
      return {
        // 获取用户列表参数实体
        queryInfo: {
          query: '',
          pagenum: 1, // 当前第几页
          pagesize: 10 // 每页多少条数据
        },
        // 获取用户列表响应接收
        userList: [],
        total: 0, //总共多少条数据
        // 控制添加用户对话框的显示隐藏
        addDialogVisible: false,
        // 添加用户的表单数据对象
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 添加用户的表单数据的规则验证对象
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符之间', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符之间', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // 自定义校验规则
            { validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur'}
          ]
        },
        // 控制编辑用户对话框的显示隐藏
        editDialogVisible: false,
        // 修改用户的表单数据对象,由根据用户id查询的结果赋值而来
        editForm: {},
        // 修改用户的表单数据的规则验证对象
        editFormRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // 自定义校验规则
            { validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur'}
          ]
        },
        // 控制分配角色对话框的显示和隐藏
        setRoleDialogVisible: false,
        // 需要被分配角色的用户信息
        userInfo: {},
        // 角色列表
        rolesList: [],
        // 选中的角色id值
        selectedRoleId: ''
      }
    },
    created() {
      this.getUserList();
    },
    methods: {
      getUserList() {
        this.axios.get("users", {params: this.queryInfo})
          .then(response => {
            console.log(response);
            if (response.data.meta.status != 200) return this.$message.error("获取用户列表失败");
            this.$message.success("获取用户列表成功");
            this.userList = response.data.data.users;
            this.total = response.data.data.total;
          })
          .catch(error => {
            this.$message.error("获取用户列表 异常");
            console.log(error);
          });
      },
      // 监听 pagesize 改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize; // 赋值
        this.getUserList(); // 重新请求
      },
      // 监听pagenum 改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage; // 赋值
        this.getUserList(); // 重新请求
      },
      // switch开关状态发生改变的回调
      userStateChanged(userInfo) {
        this.axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
          .then(response => {
            if (response.data.meta.status != 200) {
              userInfo.mg_state = !userInfo.mg_state;
              return this.$message.error("更新用户状态失败");
            }
            this.$message.success("更新用户状态成功");
          })
          .catch(error => {
            console.error(error);
            this.$message.error("更新用户状态 异常");
          });
      },
      // 添加用户dialog关闭时的回调
      addDialogClosed() {
        // 重置添加用户表单
        this.$refs.addFormRef.resetFields();
      },
      // 添加用户
      addUser() {
        this.$refs.addFormRef.validate((valid, noPassParams) => {
          // 没通过表单的预校验，直接返回
          if (!valid) return;
          // 通过表单的预校验，可以发起网络请求
          this.axios.post('users', this.addForm)
            .then(response => {
              if (response.data.meta.status != 201) return this.$message.error("添加用户失败");
              this.$message.success("添加用户成功");
              // 隐藏添加用户对话框
              this.addDialogVisible = false;
              // 重新获取用户列表数据
              this.getUserList();
            })
            .catch(error => {
              console.error(error);
              this.$message.error("添加用户 异常");
            });
        });
      },
      // 显示编辑用户对话框
      showEditDialog(id) {
        this.axios.get('users/' + id)
          .then(response => {
            if (response.data.meta.status != 200) return this.$message.error("查询用户信息失败");
            this.$message.success("查询用户信息成功");
            this.editForm = response.data.data; // 将响应赋值给修改用户的表单数据对象
            console.log(this.editForm);
            this.editDialogVisible = true; // 显示编辑用户对话框
          })
          .catch(error => {
            console.error(error);
            this.$message.error("查询用户信息 异常")
          });
      },
      // 编辑用户dialog关闭时的回调
      editDialogClosed() {
        // 重置编辑用户表单
        this.$refs.editFormRef.resetFields();
      },
      // 编辑用户
      editUser() {
        this.$refs.editFormRef.validate((valid, noPassParams) => {
          // 没通过表单的预校验，直接返回
          if (!valid) return;
          // 通过表单的预校验，可以发起网络请求。请求体
          this.axios.put('users/'+ this.editForm.id,
            {email: this.editForm.email, mobile: this.editForm.mobile})
            .then(response => {
              if (response.data.meta.status != 200) return this.$message.error("编辑用户失败");
              this.$message.success("编辑用户成功");
              // 隐藏编辑用户对话框
              this.editDialogVisible = false;
              // 重新获取用户列表数据
              this.getUserList();
            })
            .catch(error => {
              console.error(error);
              this.$message.error("编辑用户 异常");
            });
        });
      },
      // 根据用户id删除用户
      removeUserById(id) {
        // 弹框提示用户是否删除
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('users/' + id)
            .then(response => {
              if (response.data.meta.status != 200) return this.$message.error('删除用户失败');
              this.$message.success('删除用户成功');
              this.getUserList(); // 刷新用户列表
            })
            .catch(error => {
              console.error(error);
              this.$message.error('删除用户 异常');
            });
        }).catch(() => {
          // noting to do
        });
      },
      // 分配角色
      setRole(userInfo) {
        // 分配角色的用户信息
        this.userInfo = userInfo;
        // 获取角色列表
        this.axios.get("roles")
          .then(response => {
            if (response.data.meta.status != 200) return this.$message.error("获取角色列表失败");
            this.rolesList = response.data.data;
            console.log(this.rolesList);
          })
          .catch(error => {
            this.$message.error("获取角色列表 异常");
            console.log(error);
          });
        // 显示分配角色对话框
        this.setRoleDialogVisible = true;
      },
      // 确认分配角色
      saveRoleInfo() {
        if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色！')
        this.axios.put(`users/${this.userInfo.id}/role`,
          {rid: this.selectedRoleId})
          .then(response => {
            if (response.data.meta.status != 200) return this.$message.error("更新角色失败");
            this.$message.success('更新角色成功')
            this.getUserList(); // 刷新用户列表
            this.setRoleDialogVisible = false; // 隐藏设置角色对话框
          })
          .catch(error => {
            console.error(error);
            this.$message.error("更新角色 异常");
          });
      },
      // 监听分配角色对话框关闭
      setRoleDialogClosed() {
        this.selectedRoleId = '';
        this.userInfo = {};
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
