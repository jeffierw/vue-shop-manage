<template>
  <div>
      <!-- 头部面包屑导航 -->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
    <!-- 添加角色 -->
    <el-row>
        <el-col :span="4">
            <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
        </el-col>
    </el-row>
    <!-- 角色列表 -->
    <el-table
  border
  stripe
      :data="rolesList"
      style="width: 100%">
      <el-table-column
        type=index>
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        >
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        >
      </el-table-column>
      <el-table-column
        label="操作"
        >
        <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" >删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" >分配权限</el-button>
        </template>
      </el-table-column>
</el-table>
    <!-- 添加角色弹出框 -->
    <el-dialog
  title="添加角色"
  :visible.sync="addRolesDialogVisible"
  width="50%" @close="addRolesFormClosed">
  <el-form :model="addRolesForm" :rules="addRolesRules" ref="addRolesFormRef" label-width="70px">
  <el-form-item label="角色名称" prop="roleName" label-width="100px">
    <el-input v-model="addRolesForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
    <el-input v-model="addRolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onSubmitToAddRoles">确 定</el-button>
  </span>
</el-dialog>
</el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [], // 角色列表
            addRolesDialogVisible: false, // 打开添加角色
            addRolesForm: { // 添加角色表单
                roleName: '',
                roleDesc: ''
            },
            addRolesRules: {// 验证规则
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                ]
            }
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList() {
            const {data: res} = await this.$http.get('roles')
            if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
            this.rolesList = res.data
        },

        addRolesFormClosed() {
            this.$refs.addRolesFormRef.resetFields()
        },
        onSubmitToAddRoles() {
            this.$refs.addRolesFormRef.validate(async valid => {
                if(!valid) return 
                const {data: res} = await this.$http.post('roles',this.addRolesForm)
                if(res.meta.status !== 201) return this.$message.error('添加角色失败')
                this.addRolesDialogVisible = false
                return this.$message.success('添加角色成功')
            })
        }
    }
}
</script>

<style>

</style>