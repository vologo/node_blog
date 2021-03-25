<template>
  <div class="article">
    <el-card
      class="query-card"
      style="margin-bottom:20px"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-form
          ref="queryFormRef"
          label-position="left"
          :model="queryForm"
          label-width="100px"
        >
          <el-form-item label="分类">
            <el-select
              v-model="queryForm.category_id"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.key }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序方式">
            <el-radio
              v-model="queryForm.desc"
              label="created_at"
            >最新发布</el-radio>
            <el-radio
              v-model="queryForm.desc"
              label="browse"
            >浏览次数</el-radio>
          </el-form-item>
          <el-form-item label="关键字搜索">
            <el-input
              v-model="queryForm.keyword"
              style="width:217px"
            />
          </el-form-item>
          <el-form-item label="">
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="handleQuery"
              >查询</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="article-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>根据筛选条件共查询到 <el-tag type="success">{{ total }}</el-tag> 条结果</span>
      </div>
      <div>
        <el-table
          v-loading="loading"
          :data="articleList.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
          stripe
          style="width: 100%"
        >
          <!-- 默认排序 -->
          <!-- :default-sort="{prop: 'created_at', order: 'descending'}" -->
          <el-table-column
            prop="date"
            label="文章封面"
            header-align="center"
            align="center"
            fit
          >
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]"
                fit="cover"
                lazy
              >
                <!-- :preview-src-list="[scope.row.cover]" 快速包装成数组 -->
                <!-- 图片加载中的占位符 -->
                <div
                  slot="placeholder"
                  class="image-slot"
                >
                  加载中<span class="dot">...</span>
                </div>
                <!-- 加载失败的占位符 -->
                <div
                  slot="error"
                  class="image-slot"
                >
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="category"
            label="文章分类"
            header-align="center"
            align="center"
            sortable
            fit
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.category">{{ scope.row.category.name }}</el-tag>
              <el-tag
                v-else-if="!scope.row.category"
                type="warning"
              >暂无分类</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="文章标题"
            header-align="center"
            align="center"
            sortable
            fit
          />
          <el-table-column
            prop="author"
            label="文章作者"
            header-align="center"
            align="center"
            fit
            sortable
          />
          <el-table-column
            prop="browse"
            label="浏览次数"
            header-align="center"
            align="center"
            fit
            sortable
          />
          <el-table-column
            prop="created_at"
            label="发布时间"
            header-align="center"
            align="center"
            sortable
            fit
          />
          <el-table-column
            align="right"
            width="180"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-input
                v-model="search"
                clearable
                size="mini"
                placeholder="文章标题搜索"
                @input="handleSearch(scope.row)"
              />
            </template>
            <template slot-scope="scope">
              <!-- this.$router.push({ name: 'Publish', params: { scope.row.id.toString() } }) -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="$router.push({ name: 'Publish', params: { id:scope.row.id.toString()} })"
              >编辑</el-button>
              <el-button
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页模块 -->
      <el-pagination
        background
        :current-page="queryForm.page"
        layout="total, prev, pager, next, jumper"
        :total="total"
        style="margin-top:20px"
        :disabled="loading"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>
<script>
import { getArticle, deleteArticle, queryArticle } from '@/api/article'
import { getCategory } from '@/api/category'
export default {
  name: 'Article',
  // components: { ElImageViewer },
  props: {},
  data () {
    return {
      articleList: [],
      categoryList: [],
      loading: true,
      // 表头搜索
      search: '',
      // 总页数
      total: 0,
      showViewer: false, // 显示查看器
      queryForm: {
        page: 1, // 查询第一页
        category_id: '', // 按分类id来查询
        desc: 'created_at', // 排序，默认最新：created_at，浏览次数：browse
        keyword: '' // 按关键字搜索
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
    this.loadCategory()
  },
  mounted () { },
  methods: {
    // 首屏数据请求 所有的分类
    async loadCategory () {
      const { data: res } = await getCategory()
      this.categoryList = res.data
    },
    // 获取所有的文章
    async loadArticle () {
      console.log(this.queryForm)
      this.loading = true
      const { data: res } = await getArticle(this.queryForm)
      console.log(res)
      console.log(res.data.data)
      this.articleList = res.data.data
      this.total = res.data.meta.total
      this.loading = false
    },
    // 搜索功能
    async handleQuery () {
      // if (!this.queryForm.keyword) {
      this.loadArticle()
      // } else {
      //   console.log(this.queryForm)
      //   const { data: res } = await queryArticle(this.queryForm)
      //   this.categoryList = res.data
      // }
    },
    // 翻页功能
    handleCurrentChange (current) {
      this.queryForm.page = current
      this.loadArticle()
    },
    // 删除功能
    handleDelete (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteArticle(id)
        console.log(res)
        this.$message.success(res.msg)
        this.loadArticle()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 防止scope 报错的
    async handleSearch (row) {
      // const { data: res } = await queryArticle(this.search)
      // console.log(res)
      //   this.categoryList = res.data
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
