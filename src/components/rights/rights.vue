<template>
  <div>
      <!-- 头部面包屑导航 -->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 权限表格 -->
<el-card>
  <el-table
  border
  stripe
      :data="rightsList"
      style="width: 100%">
      <el-table-column
        type=index>
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        >
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        >
      </el-table-column>
      <el-table-column
        prop="level"
        label="权限等级"
        >
        <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
            <el-tag type="warn" v-else>三级</el-tag>
        </template>
      </el-table-column>
</el-table>
</el-card>

  </div>
</template>

<script>
export default {
    data() {
        return {
            rightsList: [] // 权限列表
        }
    },
    created() {
        this.getRightsList()
    },
    methods: {
        async getRightsList() {
            const {data: res} = await this.$http.get('rights/list')
            if(res.meta.status !== 200) return this.$message.error('请求权限列表失败！')
            this.rightsList = res.data
            console.log(res);
        }
    }
}
</script>

<style lang="less" scoped>

</style>

