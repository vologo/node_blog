<template>
  <div>
    <div>欢迎您</div>
    <div>管理员：{{ userInfo.nickname }}</div>
    <div>邮箱号：{{ userInfo.email }}</div>
    <div>ID编号：{{ userInfo.id }}</div>
  </div>
</template>
<script>
import { auth } from '@/api/user'
export default {
  // 指定 name 选项的另一个好处是便于调试。
  // 有名字的组件有更友好的警告信息。
  // 另外，当在有 vue-devtools，未命名组件将显示成 <AnonymousComponent>，这很没有语义。通过提供 name 选项，可以获得更有语义信息的组件树。
  // 结论：给一个组件起个名字是非常有意义的，尽量不要让组件的名字重复
  name: 'Home',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserInfo()
  },
  mounted () { },
  methods: {
    // 载入管理员信息
    async loadUserInfo () {
      const { data: res } = await auth()
      console.log(res)
      this.userInfo = res.data
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
