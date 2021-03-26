<template>
  <div class="">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/admin/comments' }">评论列表</el-breadcrumb-item>
          <el-breadcrumb-item>回复详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 被回复的评论 -->
      <el-table
        :data="commentDetail"
        style="width: 100%"
        stripe
      >
        <el-table-column
          align="center"
          label="有回复的评论"
        >
          <el-table-column
            prop="nickname"
            label="评论人昵称"
            width="180"
          />
          <el-table-column
            prop="email"
            label="评论人邮箱"
            width="180"
          />
          <el-table-column
            prop="content"
            label="评论内容"
          />
          <el-table-column
            prop="id"
            label="评论的ID"
          />
          <el-table-column
            prop="target_id"
            label="文章id"
          />
          <el-table-column
            prop="created_at"
            label="评论时间"
          />
        </el-table-column>
      </el-table>
      <!-- 被回复 -->
      <el-table
        :data="replyList"
        style="width: 100%"
        stripe
      >
        <el-table-column
          label="评论被回复的列表"
          align="center"
        >
          <el-table-column
            prop="nickname"
            label="回复人昵称"
            width="180"
          />
          <el-table-column
            prop="email"
            label="回复人邮箱"
            width="180"
          />
          <el-table-column
            prop="content"
            label="回复内容"
          />
          <el-table-column
            prop="comment_id"
            label="评论的ID"
          />
          <el-table-column
            prop="created_at"
            label="回复时间"
          />
          <el-table-column
            align="right"
            width="180"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editReply(scope.row.id, scope.row)"
              >编辑</el-button>
              <el-button
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="deleteReply(scope.row.id, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 分页模块 -->
      <el-pagination
        background
        :current-page="page"
        layout="total, prev, pager, next, jumper"
        :total="total"
        style="margin-top:20px"
        :disabled="loading"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 新增弹窗 -->
    <el-dialog
      title="新增分类"
      :visible.sync="addCategorDialog"
      width="50%"
      @close="addClose"
    >
      <el-form
        ref="addFormRef"
        label-width="100px"
        :model="addForm"
        :rules="addRules"
      >
        <el-form-item
          label="分类名称"
          prop="name"
        >
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item
          label="分离关键字"
          prop="key"
        >
          <el-input v-model="addForm.key" />
        </el-form-item>
        <el-form-item
          label="分类等级"
          prop="parent_id"
        >
          <el-input v-model="addForm.parent_id" />
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click="addCategorDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addCategor"
          >确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCategorDialog"
      width="50%"
      @close="editClose"
    >
      <el-form
        ref="editFormRef"
        label-width="100px"
        :model="editForm"
        :rules="editRules"
      >
        <el-form-item
          label="分类名称"
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item
          label="分离关键字"
          prop="key"
        >
          <el-input v-model="editForm.key" />
        </el-form-item>
        <el-form-item
          label="分类等级"
          prop="parent_id"
        >
          <el-input v-model="editForm.parent_id" />
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click="editCategorDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editCategor"
          >确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getComment, createComment, deleteComment, getSingleComment, setSingleComment, getReply, deleteReply } from '@/api/comment'
// import { getArticle } from '@/api/article'
export default {
  name: 'Reply',
  components: {},
  props: {},
  data () {
    return {
      commentList: [],
      replyList: [],
      commentDetail: [],
      replyDialog: false,
      total: 0,
      loading: false,
      page: 1,
      addCategorDialog: false,
      editCategorDialog: false,
      addForm: {
        name: '',
        key: '',
        parent_id: 0
      },
      editForm: {
        name: '',
        key: '',
        parent_id: 0
      },
      addRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ], key: [
          { required: true, message: '请输入分类关键字', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ], parent_id: [
          { required: false, message: '请选择父级分类', trigger: 'blur' }
        ]
      },
      editRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ], key: [
          { required: true, message: '请输入分类关键字', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ], parent_id: [
          { required: false, message: '请选择父级分类', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    // 请求首屏数据
    this.handleReplyList()
  },
  mounted () {
  },
  methods: {
    // 首屏数据请求 所有的分类
    // async loadComment () {
    //   const { data: res } = await getComment({ page: this.page })
    //   console.log(res)
    //   this.commentList = res.data.data
    //   this.total = res.data.meta.total
    // },
    // 获取评论被回复的列表
    async handleReplyList () {
      // this.replyDialog = true
      // 这个方法给前台展示用的，传过来的数据
      // created_at: "2021-03-22"
      // id: 3
      // nickname: "image"
      // reply: (2) [{…}, {…}]
      // target_id: 12
      // target_type: "article"
      const { data: res } = await getSingleComment(this.$route.query.id)
      console.log(res)
      this.commentDetail = [res.data]
      this.replyList = res.data.reply
      // this.commentDetail[0].created_at = res.data.created_at
    },
    // 翻页功能
    handleCurrentChange (current) {
      this.page = current
      this.loadComment()
    },
    // 删除评论
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteComment(index)
        console.log(res)
        this.$message.success(res.msg)
        this.loadComment()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 初始化添加的对话框
    addClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加分类请求
    addCategor () {
      this.$refs['addFormRef'].validate(async valid => {
        if (!valid) return this.$message.error('新增信息不正确，重新填写')
        const { data: res } = await createCategory(this.addForm)
        this.$message.success(res.data.msg)
        this.loadCategory()
        this.addCategorDialog = false
      })
    },
    // 初始化编辑对话框
    editClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑分类请求
    editCategor () {
      this.$refs['editFormRef'].validate(async valid => {
        if (!valid) return this.$message.error('编辑的信息不正确，重新填写')
        delete this.editForm.id
        const { data: res } = await setSingleCategory(this.editForm, this.updataId)
        console.log(res)
        this.$message.success(res.msg)
        this.loadCategory()
        this.editCategorDialog = false
      })
    },
    // 删除评论回复
    deleteReply (id, row) {
      this.$confirm('此操作将永久删除该条评论回复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteReply(id)
        this.$message.success(res.msg)
        this.loadComment()
        this.replyDialog = false
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.has-gutter {
  background: #fafafa;
}
</style>
