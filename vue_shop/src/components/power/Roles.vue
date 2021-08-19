<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card>
        <!--添加角色按钮区域-->
        <el-row>
          <el-col>
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <!--角色列表区域-->
        <el-table :data="rolesList" border stripe>
          <!--展开列-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbuttom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                <!--渲染一级权限-->
                <el-col :span="5">
                  <!--权限名被标签包裹-->
                  <el-tag closable @close="removeRightById(scope.row, item1.id)">
                    {{item1.authName}}
                  </el-tag>
                  <!--图标-->
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--渲染二级权限和三级权限-->
                <el-col :span="19">
                  <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                        {{item2.authName}}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!--pre标签格式化数据-->
              <!--<pre>{{scope.row}}</pre>-->
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="185px">
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <!--删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <!--分配权限按钮-->
              <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

      </el-card>
      <!--分配权限对话框-->
      <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!--内容主体区域-->
        <!--树型控件-->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id"
                 default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      name: "Roles",
      data() {
        return{
          // 角色列表
          rolesList: [],
          // 控制分配权限对话框的显示隐藏
          setRightDialogVisible: false,
          // 权限列表
          rightsList: [],
          // 树形控件属性绑定对象
          treeProps: {
            label: 'authName', // 显示用的的字段
            children: 'children' // 父子结构用的字段
          },
          // 默认选中的节点id值数组
          defKeys: [],
          // 点击“分配角色”按钮后当前点击的角色id
          roleId: ''
        }
      },
      created() {
        // 获取角色列表
        this.getRolesList();
      },
      methods:{
        // 获取角色列表
        getRolesList() {
          this.axios.get("roles")
            .then(response => {
              console.log(response);
              if (response.data.meta.status != 200) return this.$message.error("获取角色列表失败");
              this.rolesList = response.data.data;
            })
            .catch(error => {
              this.$message.error("获取角色列表 异常");
              console.log(error);
            });
        },
        removeRightById(role, rightId) {
          this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.info("确定删除权限");
            this.axios.delete(`roles/${role.id}/rights/${rightId}`)
              .then(response => {
                if (response.data.meta.status != 200) return this.$message.error('删除权限失败');
                role.children = response.data.data; // 赋值最新的权限
              })
              .catch(error => {
                console.error(error);
                this.$message.error('删除权限 异常');
              });
          }).catch(() => {
            console.info("取消删除权限")
          });
        },
        showSetRightDialog(role) {
           this.roleId = role.id;
          // 获取所有权限
          this.axios.get('rights/tree')
            .then(response => {
              if (response.data.meta.status != 200) return this.$message.error('获取权限列表失败');
              this.rightsList = response.data.data;
              console.log(this.rightsList);

              // 获取所有的三级节点id值，并将id值放入数组中
              this.getLeafKeys(role, this.defKeys);

              // 设置分配权限对话框显示
              this.setRightDialogVisible = true;
            })
            .catch(error => {
              console.error(error);
              this.$message.error('获取权限列表 异常');
            });
        },
        // 获取所有的三级节点id值，并将id值放入数组中
        getLeafKeys(node, arr) {
          var childNode = node.children;
          if (!childNode) {
            arr.push(node.id);
          }else {
            childNode.forEach(item => {
              this.getLeafKeys(item, arr);
            });
          }
        },
        // 监听分配权限对话框关闭事件
        setRightDialogClosed() {
          // 清空
          this.defKeys = [];
        },
        // 确认分配权限
        allotRights() {
          //...表示扩展运算符，将一个数组变为参数序列
          const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
          ];
          const idStr = keys.join(',');
          this.axios.post(`roles/${this.roleId}/rights`, {rids: idStr})
            .then(response => {
              if (response.data.meta.status != 200) return this.$message.error('分配权限失败');
              this.$message.success('分配权限成功');
              this.getRolesList(); // 刷新角色列表
              this.setRightDialogVisible = false; // 隐藏设置权限对话框
            });
        }
      }

    }
</script>

<style lang="less" scoped>
  /*tag标签margin*/
  .el-tag {
    margin: 7px;
  }
  /*顶部实线*/
  .bdtop {
    border-top: 1px solid #eee;
  }
  /*底部实线*/
  .bdbuttom {
    border-bottom: 1px solid #eee;
  }
  /*居中对齐*/
  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
