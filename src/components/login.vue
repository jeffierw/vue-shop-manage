<template>
  <div class="login-container">
      <div class="login-box">
          <!-- 头像部分 -->
          <div class="avatar-box">
              <img src="../assets/logo.png" alt="">
          </div>
          <!-- 表单区域 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules"  label-width="0px" class="login-form">
              <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password"  prefix-icon="iconfont icon-3702mima"></el-input>
            </el-form-item>
            <!-- 登录按钮部分 -->
            <el-form-item class="login-button">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="refreshLogin">重置</el-button>
            </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            // 传递输入值
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单验证对象
            loginFormRules:{
                username: [
                     { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                     { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 重置登录信息
        refreshLogin() {
            this.$refs.loginFormRef.resetFields()
        },
        login() {
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return 
                const {data: res} = await this.$http.post('login',
                    this.loginForm
                ) 
                if (res.meta.status !== 200) return   this.$message.error('登录失败');
                // 登陆成功
                this.$message.success('登陆成功')
                // 存储token
                window.sessionStorage.setItem("token",res.data.token)
                // 编程跳转
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login-container {
    background-color: #2b4b6b;
    height: 100%;
}
 .login-box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        
        .avatar-box {
            width: 130px;
            height: 130px;
            border:1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position:absolute;
            left:50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }

        .login-form {
            position:absolute;
            bottom:0;
            width: 100%;
            padding:0 10px;
            box-sizing: border-box;

            .login-button {
                display:flex;
                justify-content: flex-end;
            }
        }
    }
</style>