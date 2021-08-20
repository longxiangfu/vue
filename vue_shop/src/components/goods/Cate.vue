<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          </el-col>
        </el-row>
        <!--表格-->
        <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false"
          :expand-type="false" show-index index-text="#" border :show-row-hover="false">
          <!--是否有效-->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" style="color: lightgreen;" v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error" style="color: red;" v-else></i>
          </template>
          <!--排序-->
          <template slot="order", slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!--操作-->
          <template slot="opt" slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>
        <!--分页区域-->
        <el-pagination class="el-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.queryInfo.pagenum"
          :page-sizes="[3, 5, 10]"
          :page-size="this.queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!--添加分类对话框-->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
        <!--内容主体区域-->
        <el-form ref="addCateFormRef" label-width="100px" v-bind:model="addCateForm"
                 v-bind:rules="addCateFormRules">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!--级联选择器-->
            <!--options 指定数据源-->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged" clearable change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      name: "Cate",
      data() {
        return {
          // 获取商品分类列表查询参数
          queryInfo: {
            type: 3,
            pagenum: 1,
            pagesize: 5
          },
          // 商品分类列表
          cateList: [],
          // 商品分类数据总条数
          total: 0,
          // 属性表格各列的配置
          columns: [
            {
              // 列标题名称
              label: '分类名称',
              // 列内容属性名
              prop: 'cat_name'
            },
            {
              label: '是否有效',
              // 当前列的类型为模板列
              type: 'template',
              // 模板的名称是isok
              template: 'isok'
            },
            {
              label: '排序',
              type: 'template',
              template: 'order'
            },
            {
              label: '操作',
              type: 'template',
              template: 'opt'
            }
          ],
          // 控制添加分类对话框的显示隐藏
          addCateDialogVisible: false,
          // 添加分类表单数据对象
          addCateForm: {
            // 分类名称
            cat_name: '',
            // 分类的父id，父级为一级时为0
            cat_pid: 0,
            // 分类等级，默认为一级分类0
            cat_level: 0
          },
          // 添加分类数据规则验证对象
          addCateFormRules: {
            cat_name: [
              {required: true, message: '请输入分类名称', trigger: 'blur'}
            ]
          },
          // 父级分类列表
          parentCateList: [],
          // 级联选择器的配置对象
          cascaderProps: {
            // 次级菜单的展开方式:悬浮展开
            expandTrigger: 'hover',
            // 显示字段
            label: 'cat_name',
            // 真正选中的字段
            value: 'cat_id',
            // 父子关联字段
            children: 'children'
          },
          // 级联选择器选中的字段集合。选中项和selectedKey进行双向绑定
          selectedKeys: []

        }
      },
      created() {
        // 获取商品分类列表
        this.getCateList();
      },
      methods: {
        // 获取商品分类列表
        getCateList() {
          this.axios.get("categories", {params: this.queryInfo})
            .then(response => {
              console.log(response);
              if (response.data.meta.status != 200) return this.$message.error("获取商品分类列表失败");
              this.cateList = response.data.data.result;
              this.total = response.data.data.total;
            })
            .catch(error => {
              this.$message.error("获取商品分类列表 异常");
              console.log(error);
            });
        },
        // 监听 pagesize 改变
        handleSizeChange(newSize) {
          this.queryInfo.pagesize = newSize; // 赋值
          this.getCateList(); // 重新请求
        },
        // 监听pagenum 改变
        handleCurrentChange(newPage) {
          this.queryInfo.pagenum = newPage; // 赋值
          this.getCateList(); // 重新请求
        },
        // 显示添加分类对话框
        showAddCateDialog() {
          // 获取父级分类
          this.getParentCateList();
          // 显示
          this.addCateDialogVisible = true;
        },
        // 获取父级分类列表
        getParentCateList(){
          this.axios.get("categories", {params: {type: 2}})
            .then(response => {
              console.log(response);
              if (response.data.meta.status != 200) return this.$message.error("获取父级分类列表失败");
              this.parentCateList = response.data.data;
            })
            .catch(error => {
              this.$message.error("获取父级分类列表 异常");
              console.log(error);
            });

        },
        // 选择项发生改变后触发的函数
        parentCateChanged(){
          console.log(this.selectedKeys)
        }

      }
    }
</script>

<style lang="less" scoped>
  .treeTable{
    margin-top: 15px;
  }
  .el-pagination{
    margin-top: 15px;
  }
  .el-cascader{
    width: 100%;
  }
</style>
