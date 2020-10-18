import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: login },
        {
            path: '/home',
            component: home
        }
    ]
})

router.beforeEach((to, from, next) => {
    // 如果访问的就是登录页 直接放行
    if (to.path === '/login') return next()
        // token不存在 跳转至登录页面
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})

export default router