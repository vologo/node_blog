<template>
  <el-container class="layout_container">
    <el-aside
      class="layout_aside"
      width="auto"
    >
      <!-- 绑定子组件的属性，通过子组件props 接收值，父传子通信 -->
      <Aside
        :is-collapse="isCollapse"
        class="aside-menu"
      />
    </el-aside>
    <el-container>
      <el-header class="layout_header">
        <div class="header">
          <!-- 对象传值法 类似:class=" isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"-->
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse
            }"
            @click="isCollapse = !isCollapse"
          /><span>博客后台管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="el-dropdown-link">
              {{ userInfo.nickname }}<i class="el-icon-arrow-down el-icon--right" />
            </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">个人设置</el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-plus"
              @click.native="logout"
            >退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="layout_main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Aside from './components/Aside'
// import { auth } from '@/api/user'
import { mapState } from 'vuex'
export default {
  name: 'LayouIndex',
  components: {
    Aside
  },
  props: {},
  data () {
    return {
      isCollapse: false,
      // userInfo: {},
      // 屏幕宽度
      screenWidth: document.body.clientWidth
      // 屏幕高度
      // screenHeight: document.body.clientHeight
    }
  },
  computed: {
    // screen () {
    //   const { screenWidth, screenHeight } = this
    //   return { screenWidth, screenHeight }
    // }
    ...mapState('user', ['userInfo'])
  },
  watch: {
    screenWidth (val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val
        // this.screenHeight = val.screenHeight
        this.timer = true
        const that = this
        setTimeout(() => {
          // 打印screenWidth变化的值
          // console.log(that.screenHeight)
          console.log(that.screenWidth)
          // console.log(that)
          if (that.screenWidth <= 666) {
            that.isCollapse = true
          } else {
            that.isCollapse = false
          }
          that.timer = false
        }, 400)
      }
    }
  },
  created () {
    // this.loadUserInfo()
  },
  mounted () {
    const that = this
    window.onresize = () => (() => {
      window.screenWidth = document.body.clientWidth
      that.screenWidth = window.screenWidth
    })()
  },
  methods: {
    // 载入管理员信息
    // async loadUserInfo () {
    //   const { data: res } = await auth()
    //   this.userInfo = res.data
    // },
    // 退出功能
    logout () {
      this.$confirm('确定退出管理系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // window.localStorage.removeItem('user')
        this.$store.commit('user/DEL_TOKEN')
        this.$router.replace('/login')
        this.$message.success('已退出管理系统')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.layout_container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  .layout_aside {
    background: #1f2d3d;
    height: 100%;
    .aside-menu {
      height: 100%;
    }
  }
  .layout_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .avatar-wrap {
      display: flex;
      align-items: center;
      .el-avatar {
        margin-right: 10px;
      }
    }
  }
  .layout_main {
    background: #e8edf2;
  }
}
</style>
