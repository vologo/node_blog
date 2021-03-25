<template>
  <div class="login_container">
    <div id="particles">
      <vue-particles
        color="#9EDEDE"
        :particle-opacity="0.7"
        :particles-number="80"
        shape-type="star"
        :particle-size="5"
        lines-color="#9EDE5E"
        :lines-width="1"
        :line-linked="true"
        :line-opacity="0.4"
        :lines-distance="150"
        :move-speed="3"
        :hover-effect="true"
        hover-mode="grab"
        :click-effect="true"
        click-mode="remove"
      />
    </div>
    <div
      id="login_box"
      :class=" signUpAction ? 'dowebok' : 'dowebok right-panel-active'"
    >
      <div class="form-container sign-up-container">
        <!-- 注册页面 -->
        <form action="#">
          <el-form
            ref="regFormRef"
            :model="regForm"
            status-icon
            :rules="regRules"
            auto-complete="on"
            class="login_form"
          >
            <h3 class="title">{{ webSiteName }}用户注册</h3>
            <div class="social-container">
              <a
                href="#"
                class="social"
              ><i class="fab fa-facebook-f" /></a>
              <a
                href="#"
                class="social"
              ><i class="fab fa-google-plus-g" /></a>
              <a
                href="#"
                class="social"
              ><i class="fab fa-linkedin-in" /></a>
            </div>
            <el-form-item prop="nickname">
              <el-input
                v-model="regForm.nickname"
                prefix-icon="el-icon-user"
                placeholder="请输入用户名"
                autocomplete="off"
                autofocus
                clearable
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <el-form-item prop="password1">
              <el-input
                v-model="regForm.password1"
                prefix-icon="el-icon-lock"
                placeholder="请输入用户密码"
                type="password"
                show-password
                autocomplete="off"
                clearable
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <el-form-item prop="password2">
              <el-input
                v-model="regForm.password2"
                prefix-icon="el-icon-lock"
                placeholder="请再次输入用户密码"
                type="password"
                show-password
                autocomplete="off"
                clearable
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <el-form-item
              prop="email"
              width="50px"
            >
              <el-input
                v-model="regForm.email"
                type="mail"
                prefix-icon="el-icon-s-promotion"
                placeholder="请输入邮箱地址"
                autocomplete="off"
                clearable
              />
            </el-form-item>
            <el-form-item prop="authCode">
              <el-input
                v-model="regForm.authCode"
                prefix-icon="el-icon-s-check"
                placeholder="发邮箱验证码"
                autocomplete="off"
                style="width:140px"
              />
              <el-button
                size="mini"
                class="emailButton"
                type="primary"
                :loading="emailLoading"
                @click="sendEmail"
              >{{ buttonInfo }}</el-button>
            </el-form-item>
            <el-form-item class="btns">
              <el-button
                size="mini"
                type="success"
                :loading="regLoading"
                @click="handleReg"
              >注册用户</el-button>
            </el-form-item>
          </el-form>
        </form>
      </div>
      <div class="form-container sign-in-container">
        <!-- 登录页面 -->
        <form action="#">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            status-icon
            :rules="loginRules"
            auto-complete="on"
            class="login_form"
          >
            <h3 class="title">{{ webSiteName }}后台管理系统</h3>
            <div class="social-container">
              <a
                href="#"
                class="social"
              ><i class="fab fa-facebook-f" /></a>
              <a
                href="#"
                class="social"
              ><i class="fab fa-google-plus-g" /></a>
              <a
                href="#"
                class="social"
              ><i class="fab fa-linkedin-in" /></a>
            </div>
            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                prefix-icon="el-icon-user"
                placeholder="请输入邮箱地址"
                autocomplete="off"
                autofocus
                clearable
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                prefix-icon="el-icon-lock"
                placeholder="请输入用户密码"
                type="password"
                show-password
                autocomplete="off"
                clearable
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <el-form-item class="btns">
              <el-button
                type="primary"
                :loading="loginLoading"
                @click="handleLogin"
              >登录</el-button>
              <el-button
                type="info"
                class="retrieve"
                @click="resetForm('loginFormRef')"
              >忘记密码</el-button>
            </el-form-item>
          </el-form>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>已有帐号？</h1>
            <p>请使用您的帐号进行登录</p>
            <button
              id="signIn"
              class="ghost"
              @click="signUpAction = !signUpAction"
            >登录</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>没有帐号？</h1>
            <p>立即注册加入我们，和我们一起开始旅程吧</p>
            <!-- 切换注册页面 -->
            <button
              id="signUp"
              class="ghost"
              @click="signUpAction = !signUpAction"
            >注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { login, register } from '@/api/user'
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.regForm.password2 !== '') {
          this.$refs.regFormRef.validateField('password2')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.regForm.password1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      signUpAction: true,
      loginLoading: false,
      regLoading: false,
      emailLoading: false,
      buttonInfo: '发送邮箱验证码',
      time: 10,
      webSiteName: '',
      loginForm: {
        email: 'vologo@msn.com',
        password: 'aita12345'
      },
      regForm: {
        email: '',
        nickname: '',
        password1: '',
        password2: '',
        authCode: ''
      },
      loginRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }]
      },
      regRules: {
        nickname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password1: [
          { validator: validatePass, trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }],
        password2: [
          { validator: validatePass2, trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        authCode: [
          { message: '请输入邮箱验证码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // created，dom还未开始渲染，因此需要使用this.$nextTick 将其放置在下一个dom渲染操作时执行
    // this.$refs.userNameInput.focus()
    // this.getWebName()
  },
  mounted () {
    console.log(process.env.VUE_APP_REQUEST_URL + process.env.VUE_APP_BASE_API)
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleLogin () {
      this.loginLoading = true
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          this.loginLoading = false
          this.$message.error('请输入正确的的登录信息')
          return
        }
        login(this.loginForm).then(res => {
          this.loginLoading = false
          console.log(res)
          window.localStorage.setItem('user', JSON.stringify(res.data.token))
          // this.$ls.set('token', res.data.token)
          this.$router.push('/admin')
          this.$message.success(res.data.msg)
        }).catch(err => {
          this.loginLoading = false
          this.$message.error('登录失败！')
          console.log('登录失败', err)
        })
      })
    },
    handleReg () {
      this.regLoading = true
      this.$refs.regFormRef.validate(valid => {
        if (!valid) {
          this.$message.error('请输入正确的的注册信息')
          this.regLoading = false
          return false
        }
        register(this.regForm).then(res => {
          this.$message.success('注册成功，现在可以登录了')
          this.$router.go(0)
          this.$refs.regFormRef.resetForm()
        }).catch(err => {
          this.regLoading = false
          console.log('登录失败', err.data)
          this.$message.error(err.data.msg)
        })
      })
    },
    sendEmail () {
      const me = this
      me.emailLoading = true
      const interval = window.setInterval(() => {
        me.buttonInfo = me.time + '秒后可重发'
        --me.time
        if (me.time < 0) {
          me.buttonInfo = '重新发送'
          me.time = 10
          me.emailLoading = false
          window.clearInterval(interval)
        }
      }, 1000)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.login_container {
  background-color: #5f9ea0;
  height: 100%;
  width: 100%;
}
// 粒子效果不影响其他布局
#particles {
  background: #5f9ea0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // 让粒子效果铺满页面
  #particles-js {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .el-input {
    width: 280px;
  }
  .el-input__inner {
    background: #fff !important;
  }
  .title {
    margin: 10px 0;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
  .el-button--mini {
    width: 280px;
  }
  .emailButton.el-button--mini {
    width: 130px;
    padding: 12px 0px;
    margin-left: 10px;
  }
  .retrieve {
    padding: 12px 32px;
  }
}
// 注册页面css
h1 {
  font-weight: bold;
  margin: 0;
}
p {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}
span {
  font-size: 12px;
}
a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}
.dowebok {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}
.form-container form {
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.social-container {
  margin: 10px 0;
}
.social-container a {
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}
.social-container a:hover {
  background-color: #eee;
}
.form-container input {
  background: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  outline: none;
}
button {
  border-radius: 20px;
  // border: 1px solid #ff4b2b;
  // background: #ff4b2b;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
}
button.ghost {
  border: 1px solid #ff4b2b;
}
button:active {
  transform: scale(0.95);
}
button:focus {
  outline: none;
}
button.ghost {
  background: transparent;
  border-color: #fff;
}
.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}
.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}
.sign-up-container {
  left: 0;
  width: 50%;
  z-index: 1;
  opacity: 0;
}
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}
.overlay {
  background: #ff416c;
  background: linear-gradient(to right, #ff4b2b, #ff416c) no-repeat 0 0 / cover;
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateY(0);
  transition: transform 0.6s ease-in-out;
}
.overlay-panel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding: 0 40px;
  height: 100%;
  width: 50%;
  text-align: center;
  transform: translateY(0);
  transition: transform 0.6s ease-in-out;
}
.overlay-right {
  right: 0;
  transform: translateY(0);
}
.overlay-left {
  transform: translateY(-20%);
}
/* Move signin to right */
.dowebok.right-panel-active .sign-in-container {
  transform: translateY(100%);
}
/* Move overlay to left */
.dowebok.right-panel-active .overlay-container {
  transform: translateX(-100%);
}
/* Bring signup over signin */
.dowebok.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}
/* Move overlay back to right */
.dowebok.right-panel-active .overlay {
  transform: translateX(50%);
}
/* Bring back the text to center */
.dowebok.right-panel-active .overlay-left {
  transform: translateY(0);
}
/* Same effect for right */
.dowebok.right-panel-active .overlay-right {
  transform: translateY(20%);
}
</style>
