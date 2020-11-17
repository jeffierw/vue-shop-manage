<template>
  <el-container>
      <!-- 头部 -->
  <el-header>
      <div>
          <img src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
      </el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 伸缩菜单按钮 -->
        <div class="toggle_menu" @click="toggleMenu">
            |||
        </div>
        <!-- 菜单 -->
        <el-menu
        :default-active="activePath"
        unique-opened
        router
        :collapse-transition="false"
        :collapse="isCollapse"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#329bf2">
    <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
          <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="getMenuState('/' + subItem.path)">
              <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menuList: [],
            // 左侧图标数据
            iconObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-lock_fill',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            // 是否展开菜单
            isCollapse: false,
            // 菜单活跃项
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        // 每次打开首页 将上次点击的菜单活跃项加载出来
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            // 清除本地缓存信息token
            window.sessionStorage.clear()
            // 退出 跳转至登录页
            this.$router.push('/login')
        },
        // 获取aside菜单
        async getMenuList() {
            const {data: res} = await this.$http.get('menus')
            if (res.meta.status !== 200 ) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.menuList = res.data
        },
        // 是否折叠左侧菜单
        toggleMenu() {
            this.isCollapse = !this.isCollapse
        },
        // 获取菜单活跃项保持高亮
        getMenuState(activePath) {
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath = activePath
        }

    }
}
</script>

<style lang="less" scoped>
    .el-container {
        height: 100%;
    }
    .el-header {
        background-color: #333744;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 10px;
        > div {
            display: flex;
            img {   
                width:60px;
                height: 60px;
            }
            span {
                font-size: 18px;
                color: #fff;
                margin-left: 5px;
                line-height: 18px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }
    }
    .el-aside {
        background-color: #333744;
    }
    .el-main {
        background-color: #eaedf1;
    }
    .el-menu {
        border-right:0;
    }
    .el-submenu {
        span{
            margin-left: 5px
        }
    }
    .toggle_menu {
        background-color: #485164;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        letter-spacing: .3em;
        text-align: center;
        cursor: pointer;
    }
</style>