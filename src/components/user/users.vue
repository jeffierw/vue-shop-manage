<template>
<div>
<!-- 头部面包屑导航 -->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片列表 -->
<el-card>
  <!-- 搜索添加用户 -->
  <el-row :gutter="20">
    <el-col :span="8">
  <el-input v-model="userQuery.query" clearable @clear="getUsersList" placeholder="请输入内容">
    <el-button @click="getUsersList" slot="append" icon="el-icon-search"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
  <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
  </el-col>
  </el-row>
<!-- 表格展示 -->
  <el-table
  border
  stripe
      :data="usersList"
      style="width: 100%">
      <el-table-column
        type=index
        label=""
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="180">
      </el-table-column>
       <el-table-column
        label="状态"
        width="180">
        <template slot-scope="scope">
        <el-switch
          v-model="scope.row.mg_state"
        @change="handleStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
       <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
           icon="el-icon-edit"
          @click="handleEdit(scope.row.id)"></el-button>
        <el-button
          size="mini"
          type="danger"
           icon="el-icon-delete"
          @click="handleDelete(scope.row.id)"></el-button>
          
          <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
      <el-button
          size="mini"
          type="warning"
           icon="el-icon-setting"
          @click="handlePatch(scope.$index, scope.row)"></el-button>
    </el-tooltip>
      </template>
      </el-table-column>
    </el-table>
     <el-pagination
     @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="userQuery.pagesize"
      :current-page="userQuery.pagenum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
<!-- 添加用户弹出框 -->
    <el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%" @close="addFormClosed">
  <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="phone">
    <el-input v-model="addForm.phone"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onSubmitToAdd">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改用户弹出框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%" @close="editFormClosed">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onSubmitToEdit">确 定</el-button>
  </span>
</el-dialog>
</el-card>
</div>
</template>

<script>
export default {
  data() {
    // 自定义验证邮箱
     var checkEmail = (rule, value, callback) => {
          if (value !== '') { 
            var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!reg.test(value)){
              callback(new Error('请输入有效的邮箱'));
            }
          }
          callback();
      };
    // 自定义验证手机号
    var checkPhone = (rule, value, callback) => {
      if (value !== '') { 
            var reg=/^1[3456789]\d{9}$/;
            if(!reg.test(value)){
              callback(new Error('请输入有效的手机号码'));
            }
          }
          callback();

    }
    return {
      // 用户数组
      usersList: [],
      // 用户数据条数
      total: 0,
      // 用户搜索对象
      userQuery: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 添加用户弹出框
      addDialogVisible: false,
      // 修改用户弹出框
      editDialogVisible: false,
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: '',
      },
      // 接收修改用户对象
      editForm: {},
      // 添加表单验证
      addRules: {
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
           { validator: checkEmail, trigger: 'blur' }
        ],
        phone:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
           { validator: checkPhone, trigger: 'blur' }
        ],
      },
      // 修改用户验证
      editFormRules: {
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
           { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
           { validator: checkPhone, trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户信息
    async getUsersList() {
      const {data: res} = await this.$http.get('/users',{params: this.userQuery})
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }else {
        // this.$message.success(res.meta.msg)
        this.usersList = res.data.users
        this.total = res.data.total
      }
    },
    // 列表用户状态监听
    async handleStatus(row) {
      const {data: res} = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        console.log(row.mg_state);
      }
    },
    // 每页个数变化监听
    handleSizeChange(val) {
      this.userQuery.pagesize = val
      // 切换后再次请求列表数据
      this.getUsersList()
    },
    // 页数变化时监听
    handleCurrentChange(val) {
      this.userQuery.pagenum = val
      // 切换后再次请求列表数据
      this.getUsersList()
    },
    // 添加用户事件
    onSubmitToAdd() {
      this.$refs.addFormRef.validate( async valid => {
        if (!valid) return 
        const {data: res} = await this.$http.post('users',this.addForm)
        if (res.meta.status == 201) {
          this.$message.success(res.meta.msg)
          this.addDialogVisible = false
        }
      })
    },
    // 监听添加事件关闭
    addFormClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 触发修改事件
    async handleEdit(id) {
      const {data: res} = await this.$http.get(`users/${id}`)
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res);
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户关闭事件
    editFormClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息事件
    onSubmitToEdit() {
      this.$refs.editFormRef.validate( async valid => {
        if (!valid) return 
        const {data:res} = await this.$http.put(`users/${this.editForm.id}`,{email:this.editForm.email,mobile:this.editForm.mobile})
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('更新用户失败！')
        }else {
          this.editDialogVisible = false
          this.getUsersList()
          this.$message.success('更新用户成功！')
        }
      })
    },
    // 删除用户按钮
    handleDelete(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data: res} = await this.$http.delete(`users/${id}`)
          if ( res.meta.status == 200) {
            this.getUsersList()
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          }else {
            this.$message({
            type: 'info',
            message: '删除失败!'
          });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>

<style lang="less" scoped>

</style>