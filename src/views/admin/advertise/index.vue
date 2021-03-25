<template>
  <div class="">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>广告管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button
          type="primary"
          style="margin-bottom:20px"
          icon="el-icon-circle-plus"
          @click="addAdvertiseDialog = true"
        >新增广告</el-button>
      </div>
      <el-table
        :data="advertiseList.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID号"
          width="80"
          sortable
        />
        <el-table-column
          prop="title"
          label="标题"
          sortable
        />
        <el-table-column
          prop="link"
          label="链接"
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
              size="mini"
              placeholder="标题搜索"
              @click="handleSearch(scope)"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row.id, scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id, scope.row)"
            >删除</el-button>
          </template>
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
      title="新增广告"
      :visible.sync="addAdvertiseDialog"
      width="50%"
      @close="addClose"
    >
      <el-form
        ref="addAdvertiseFormRef"
        label-width="100px"
        :model="addAdvertiseForm"
        :rules="addRules"
      >
        <el-form-item
          label="广告标题"
          prop="title"
        >
          <el-input v-model="addAdvertiseForm.title" />
        </el-form-item>
        <el-form-item
          label="广告链接"
          prop="link"
        >
          <el-input v-model="addAdvertiseForm.link" />
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click="addAdvertiseDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addAdvertise"
          >确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑广告"
      :visible.sync="editAdvertiseDialog"
      width="50%"
      @close="editClose"
    >
      <el-form
        ref="editAdvertiseFormRef"
        label-width="100px"
        :model="editAdvertiseForm"
        :rules="editRules"
      >
        <el-form-item
          label="广告标题"
          prop="title"
        >
          <el-input v-model="editAdvertiseForm.title" />
        </el-form-item>
        <el-form-item
          label="广告链接"
          prop="link"
        >
          <el-input v-model="editAdvertiseForm.link" />
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click="editAdvertiseDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editAdvertise"
          >确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { createAdvertise, getSingleAdvertise, getAdvertise, setSingleAdvertise, deleteAdvertise } from '@/api/advertise'
export default {
  name: 'Advertise',
  components: {},
  props: {},
  data () {
    return {
      search: '',
      updataId: -1,
      total: 0,
      loading: false,
      page: 1,
      addAdvertiseDialog: false,
      editAdvertiseDialog: false,
      // 广告列表
      advertiseList: [],
      // 添加广告
      addAdvertiseForm: {
        title: '',
        link: ''
      },
      // 编辑广告
      editAdvertiseForm: {
        title: '',
        link: ''
      },
      addRules: {
        title: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入广告链接', trigger: 'blur' },
          { type: 'url', message: '请输入正确的链接地址', trigger: ['blur', 'change'] }
        ]
      },
      editRules: {
        title: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入广告链接', trigger: 'blur' },
          { type: 'url', message: '请输入正确的链接地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadAdvertise()
  },
  mounted () { },
  methods: {
    async loadAdvertise () {
      const { data: res } = await getAdvertise({ page: this.page })
      console.log(res)
      this.advertiseList = res.data.data
      this.total = res.data.meta.total
    },
    handleSearch (scope) {
      console.log(scope)
    },
    // 删除分类
    handleDelete (id, row) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteAdvertise(id)
        this.$message.success(res.msg)
        this.loadAdvertise()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 添加分类请求
    addAdvertise () {
      this.$refs['addAdvertiseFormRef'].validate(async valid => {
        if (!valid) return this.$message.error('新增信息不正确，重新填写')
        const { data: res } = await createAdvertise(this.addAdvertiseForm)
        console.log(res)
        this.$message.success(`添加广告成功${res.msg}`)
        this.loadAdvertise()
        this.addAdvertiseDialog = false
      })
    },
    // 初始化添加的对话框
    addClose () {
      this.$refs.addAdvertiseFormRef.resetFields()
    },
    // 获取所编辑的分类数据
    async handleEdit (id, row) {
      this.editAdvertiseDialog = true
      console.log(id)
      const { data: res } = await getSingleAdvertise(id)
      console.log(res)
      this.editAdvertiseForm = res.data
      this.updataId = res.data.id
      console.log(this.updataId)
    },
    // 初始化编辑对话框
    editClose () {
      this.$refs.editAdvertiseFormRef.resetFields()
    },
    // 编辑分类请求
    editAdvertise () {
      this.$refs['editAdvertiseFormRef'].validate(async valid => {
        if (!valid) return this.$message.error('编辑的信息不正确，重新填写')
        const { data: res } = await setSingleAdvertise(this.editAdvertiseForm, this.updataId)
        console.log(res)
        this.$message.success(res.msg)
        this.loadAdvertise()
        this.editAdvertiseDialog = false
      })
    },
    handleCurrentChange (current) {
      console.log(current)
      this.page = current
      this.loadAdvertise()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
