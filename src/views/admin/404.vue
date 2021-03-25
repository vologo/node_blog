<template>
  <div class="container">
    <div class="title">404</div>
    <p style="font-size:24px">页面不存在</p>
    <p>
      <el-button
        type="text"
        icon="arrow-return-left"
        @click.native="$router.go(-2)"
      >返 回</el-button>
    </p>
  </div>
</template>
<script>
export default {
  name: 'Artcle',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () { },
  methods: {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.container {
  text-align: center;
  vertical-align: middle;
  width: 100%;
  height: 100%;
}
.title {
  font-size: 100px;
  padding-top: 100px;
}
</style>
