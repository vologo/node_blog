<template>
  <div class="">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.params.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="articleFormRef"
        :model="articleForm"
        :rules="articleRules"
        label-width="80px"
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input v-model="articleForm.title" />
        </el-form-item>
        <el-form-item
          label="作者"
          prop="author"
        >
          <el-input v-model="articleForm.author" />
        </el-form-item>
        <el-form-item
          label="简介"
          prop="description"
        >
          <el-input v-model="articleForm.description" />
        </el-form-item>
        <el-form-item
          label="关键字"
          prop="keyword"
        >
          <el-input v-model="articleForm.keyword" />
        </el-form-item>
        <el-form-item
          label="分类"
          prop="category_id"
        >
          <el-select
            v-model="articleForm.category_id"
            clearable
            style="width:300px"
            placeholder="请选择分类"
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
        <el-form-item
          label="浏览量"
          prop="browse"
        >
          <el-input-number
            v-model="articleForm.browse"
            :min="0"
            :max="999"
            placeholder="默认为0"
          />
        </el-form-item>
        <el-form-item
          label="上传封面"
          prop="cover"
        >
          <div class="upload_image">
            <el-upload
              class="upload-demo"
              drag
              action="http://up-z2.qiniu.com"
              :data="{token: qnToken}"
              :limit="1"
              :show-file-list="false"
              :on-error="uploadError"
              :on-success="uploadSuccess"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i
                class="el-icon-upload"
                style="color:#409eff"
              />
              <div class="el-upload__text"><em>点击上传</em>或则拖拽上传</div>
            </el-upload>
            <!-- <el-upload
            action="http://up-z2.qiniu.com"
            list-type="picture-card"
            :data="{token: 'dEto3CyrUUqwb78PdCOlFB7Iv_GOxkgAZEMxgPjH:C75HkKlzx4RdmQQ4K_9fRy36tX0=:eyJzY29wZSI6InZvbG9nby1ibG9nLXBpYyIsImRlYWRsaW5lIjoxNjE2MzA1MDIwfQ=='}"
            :limit="1"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img
              width="100%"
              :src="dialogImageUrl"
              alt=""
            >
          </el-dialog> -->
            <div style="margin:0 10px;color:#409eff">右侧为已上传的封面</div>
            <el-image
              style="width: 242px; height: 242px"
              :src="articleForm.cover"
              :preview-src-list="[articleForm.cover]"
              fit="contain"
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
          </div>
        </el-form-item>
        <el-form-item
          label="内容"
          prop="content"
        >
          <!-- <el-tiptap
            placeholder="Write something …"
            :content="articleForm.content"
          /> -->
          <mavon-editor
            ref="md"
            v-model="articleForm.content"
            style="min-height: 600px"
            placeholder="write something"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="publishArticle"
          >{{ $route.params.id ? '更新文章':'发表文章' }}</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { createArticle, getSingleArticle, setSingleArticle, getQnToken } from '@/api/article'
import { getCategory } from '@/api/category'
import { mavonEditor } from 'mavon-editor'
// import { getUploadToken } from '../../../utils/upload'
import 'mavon-editor/dist/css/index.css'
export default {
  name: 'Publish',
  components: {
    'mavon-editor': mavonEditor
  },
  props: {},
  data () {
    return {
      loading: false,
      uploadURL: '#',
      dialogImageUrl: '',
      dialogVisible: false,
      qnToken: '',
      articleForm: {
        title: '',
        author: '',
        description: '',
        keyword: '',
        // eslint-disable-next-line
        content: "# Markdown Demo(Ctrl + A 删除即可)  \n\n- - -\n\n## 一、标题\n\n### 1. 使用 `#` 表示标题，其中 `#` 号必须在行首，例如：  \n\n# 一号标题\n## 二号标题\n### 三号标题\n#### 四号标题\n##### 五号标题\n###### 六号标题\n\n### 2. 使用 `===` 或者 `---` 表示，例如：  \n\n一级标题\n===\n\n二级标题\n---\n\n#### **扩展：如何换行？**\n一般使用 **两个空格** 加 **回车** 换行，不过一些 IDE 也可以直接使用回车换行。  \n\n\n## 二、分割线\n\n使用三个或以上的 `-` 或者 `*`  表示，且这一行只有符号，**注意不要被识别为二级标题即可**，例如中间或者前面可以加空格\n\n- - -\n\n* * *\n\n\n## 三、斜体和粗体\n\n使用 `*` 和 `**` 分别表示斜体和粗体，例如  \n\n*斜体* \n**粗体** \n***又斜又粗***\n\n#### **扩展：**删除线使用两个 `~` 表示，例如  \n\n~~我是要删掉的文字~~\n\n- - -\n\n\n## 四、超链接和图片\n\n超链接和图片的写法类似，图片仅在超链接前多了一个 `!` ，一般是 [文字描述] (链接)  \n两种写法，分别是： [第一种写法](https://www.baidu.com/) 和 [第二种写法][1]  \n图片的话就比如这样： ![Image][2]  \n\n[1]: https://www.baidu.com/  \n[2]: https://www.zybuluo.com/static/img/logo.png  \n\n- - -\n\n\n## 五、无序列表\n\n使用 `-`、`+` 和 `*` 表示无序列表，前后留一行空白，可嵌套，例如\n\n+ 一层\n    - 二层\n    - 二层\n        * 三层\n            + 四层\n+ 一层\n\n- - -\n\n\n## 六、有序列表\n\n使用 `1. ` （点号后面有个空格）表示有序列表，可嵌套，例如\n\n1. 一层\n    1. 二层\n    2. 二层\n2. 一层\n\n- - -\n\n\n## 七、文字引用\n\n使用 `>` 表示，可以有多个 `>`，表示层级更深，例如\n\n> 第一层\n>>第二层\n>这样是跳不出去的\n>>> 还可以更深\n\n> 这样就跳出去了  \n\n- - -\n\n\n## 八、行内代码块\n\n其实上面已经用过很多次了，即使用 \\` 表示，例如\n\n`行内代码块`\n\n### 扩展：很多字符是需要转义，使用反斜杠 `\\` 进行转义\n\n- - -\n\n\n## 九、代码块\n\n使用四个空格缩进表示代码块，例如\n\n    public class HelloWorld\n    {\n        public static void main(String[] args)\n        { \n            System.out.println( \"Hello, World!\" );\n        }\n    }\n\n一些 IDE 支持行数提示和着色，一般使用三个 \\` 表示，例如\n\n```\npublic class HelloWorld\n{\n    public static void main(String[] args)\n    { \n        System.out.println( \"Hello, World!\" );\n    }\n}\n```\n\n- - -\n\n\n## 十、表格\n\n直接看例子吧，第二行的 `---:` 表示了对齐方式，默认**左对齐**，还有**右对齐**和**居中**  \n\n|商品|数量|单价|\n|---|---:|:---:|\n|苹果苹果苹果|10|\\$1|\n|电脑|1|\\$1999|\n\n- - -\n\n\n## 十一、数学公式\n\n使用 `$` 表示，其中一个 \\$ 表示在行内，两个 \\$ 表示独占一行。\n例如质量守恒公式：$$E=mc^2$$\n支持 **LaTeX** 编辑显示支持，例如：$\\sum_{i=1}^n a_i=0$， 访问 [MathJax][2] 参考更多使用方法。\n\n推荐一个常用的数学公式在线编译网站： [https://www.codecogs.com/latex/eqneditor.php][3]  \n\n[2]: http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference  \n\n[3]: https://www.codecogs.com/latex/eqneditor.php  \n\n- - -\n\n\n## 十二、支持HTML标签\n\n### 1. 例如想要段落的缩进，可以如下：\n\n&nbsp;&nbsp;不断行的空白格&nbsp;或&#160;  \n&ensp;&ensp;半方大的空白&ensp;或&#8194;  \n&emsp;&emsp;全方大的空白&emsp;或&#8195;  \n\n\n- - -\n\n## 十三、其它\n1. markdown 各个 IDE 的使用可能存在大同小异，一般可以参考各个 IDE 的介绍文档\n2. 本文档介绍的内容基本适用于大部分的 IDE\n3. 其它一些类似 **流程图** 之类的功能，需要看 IDE 是否支持。\n\n\n查看原始数据：[https://gitee.com/afei_/MarkdownDemo/raw/master/README.md](https://gitee.com/afei_/MarkdownDemo/raw/master/README.md)\n\n博客：[https://blog.csdn.net/afei__/article/details/80717153](https://blog.csdn.net/afei__/article/details/80717153)",
        cover: '',
        category_id: '',
        browse: 0
      },
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入文章作者', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入文章简介', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '请输入文章关键词', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator: (rule, value, callback) => {
              console.log('文章验证开始')
              if (this.articleForm.content.length === 0) {
                // 验证失败
                console.log('文章验证失败')
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        cover: [
          {
            validator: (rule, value, callback) => {
              console.log('图片验证开始')
              if (this.articleForm.cover.length === 0) {
                // 验证失败
                console.log('图片验证失败')
                callback(new Error('请上传封面'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请上传封面', trigger: 'change' }
        ]
      },
      categoryList: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadCategory()
    this.loadQnToken()
    // 由于我们让发布和修改使用的同一个组件
    // 所以这里要判断
    // 如果路由路径参数中有 id，则请求展示文章内容
    if (this.$route.params.id) {
      this.loadArticle()
    }
  },
  categoryList: [],
  mounted () { },
  methods: {
    // 首屏数据请求 所有的分类
    async loadCategory () {
      const { data: res } = await getCategory()
      this.categoryList = res.data
    },
    // 发布文章
    publishArticle () {
      this.loading = true
      this.$refs['articleFormRef'].validate(async valid => {
        if (!valid) {
          this.$message.error('请填写正确的文章信息')
          this.loading = false
          return
        }
        if (this.$route.params.id) {
          console.log('更新文章')
          const { data: res } = await setSingleArticle(this.articleForm)
          this.$message.success(res.msg)
          this.loading = false
          this.$router.push('/admin/article')
        } else {
          const { data: res } = await createArticle(this.articleForm)
          console.log(res)
          this.$message.success(res.msg)
          this.loading = false
          this.$router.push('/admin/article')
        }
      })
    },
    // 重置表单
    resetForm () {
      this.$confirm('此操作将永久重置已填写的文章表单信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['articleFormRef'].resetFields()
        this.articleForm.content = ''
        this.$message.success('重置成功!')
      }).catch(() => {
        this.$message.info('取消重置!')
      })
    },
    // 图片上传完成后的狗子
    uploadSuccess (res) {
      console.log('我是上传钩子', res)
      console.log(res)
      const url = `http://cdn.vologo.cn/${res.key}`
      console.log(url)
      this.articleForm.cover = url
      this.$message.success('上传成功!')
    },
    // 上传失败时的钩子
    uploadError (err) {
      // 解析七牛云返回的错误信息
      let myError = err.toString()// 转字符串
      myError = myError.replace('Error: ', '')// 去掉前面的
      myError = JSON.parse(myError)// 转对象
      console.log(myError)
      this.$message.error(`图片上传失败${myError.error}`)
    },
    // 移除图片的钩子
    handleRemove (file, fileList) {
      console.log(file, fileList)
      this.articleForm.cover = ''
      console.log('移除了照片')
    },
    // 图片预览的钩子
    handlePictureCardPreview (file) {
      console.log('预览了照片')
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 限制上传一个的钩子
    handleExceed (files, fileList) {
      this.$message.warning('当前限制上传 1 个文件')
    },
    async loadArticle () {
      const { data: res } = await getSingleArticle(this.$route.params.id)
      this.$message.warning('当前为文章编辑模式')
      console.log(res.data)
      this.articleForm = res.data
    },
    async loadQnToken () {
      try {
        const { data: res } = await getQnToken()
        console.log(res)
        this.qnToken = res.data.token
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.upload_image {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .el-icon-picture-outline {
    font-size: 222px;
  }
}
</style>
