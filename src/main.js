import Vue from 'vue'
import router from './router'
import App from './App.vue'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体文件
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'

Vue.config.productionTip = false
    // 设置axios地址根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 通过axios拦截器预先增加token验证
axios.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios

new Vue({
    render: h => h(App),
    router,
    axios
}).$mount('#app')