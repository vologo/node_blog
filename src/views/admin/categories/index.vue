<template>
  <div class="">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button
          type="primary"
          style="margin-bottom:20px"
          icon="el-icon-circle-plus"
          @click="addCategorDialog = true"
        >新增分类</el-button>
      </div>
      <el-table
        :data="categoryList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID号"
          fit
          sortable
        />
        <el-table-column
          prop="name"
          label="分类名称"
          fit
          sortable
        />
        <el-table-column
          prop="key"
          label="分类关键词"
          fit
          sortable
        />
        <el-table-column
          prop="parent_id"
          label="分类等级"
          fit
          sortable
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
import { getCategory, createCategory, deleteCategory, getSingleCategory, setSingleCategory } from '@/api/category'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Categories',
  components: {},
  props: {},
  data () {
    return {
      search: '',
      // categoryList: [],
      addCategorDialog: false,
      editCategorDialog: false,
      updataId: -1,
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
  computed: {
    ...mapState('category', ['categoryList'])
  },
  watch: {},
  created () {
    // 请求首屏数据
    this.LoadCategory()
  },
  mounted () {
  },
  methods: {
    // 首屏数据请求 所有的分类
    // async LoadCategory () {
    //   const { data: res } = await getCategory()
    //   this.categoryList = res.data
    // },
    ...mapActions('category', ['LoadCategory']),
    // 获取所编辑的分类数据
    async handleEdit (id, row) {
      this.editCategorDialog = true
      const { data: res } = await getSingleCategory(id)
      this.editForm = res.data
      this.updataId = res.data.id
      console.log(this.updataId)
    },
    // 删除分类
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteCategory(index)
        console.log(res)
        this.$message.success(res.msg)
        this.LoadCategory()
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
        this.LoadCategory()
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
        this.LoadCategory()
        this.editCategorDialog = false
      })
    },
    handleSearch (scope) {
      console.log(scope)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.has-gutter {
  background: #fafafa;
}
</style>
