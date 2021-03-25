<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    background-color="#1f2d3d"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item index="/admin">
      <i class="el-icon-s-home" />
      <span slot="title">首页</span>
    </el-menu-item>
    <!-- 第一级菜单 -->
    <el-menu-item index="/admin/users">
      <i class="el-icon-user" />
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/categories">
      <i class="el-icon-collection-tag" />
      <span slot="title">分类管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/article">
      <i class="el-icon-notebook-1" />
      <span slot="title">文章管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/publish">
      <i class="el-icon-edit-outline" />
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/admin/comments">
      <i class="el-icon-chat-dot-round" />
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/advertise">
      <i class="el-icon-tickets" />
      <span slot="title">广告管理</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  name: 'Aside',
  components: {},
  // 接受父组件传过来中数据isCollapse,
  props: ['is-collapse'],
  data () {
    return {
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () { },
  methods: {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
// // 展开时最小宽度200px
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 400px;
}
.el-menu {
  border: none;
}
</style>
