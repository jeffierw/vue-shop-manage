<template>
  <div>
       <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
    methods: {
        logout() {
            // 清除本地缓存信息token
            window.sessionStorage.clear()
            // 退出 跳转至登录页
            this.$router.push('/login')
        }
    }
}
</script>

<style>

</style>