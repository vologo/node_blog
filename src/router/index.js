import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '@/api/user'
import { Message } from 'element-ui'
// import Login from '../views/admin/login/'
// import Article from '../views/admin/article/'
// import Home from '../views/admin/home'
// import Layout from '../views/admin/layout'
import { Base64 } from 'js-base64'
// import { _encode } from '../utils/auth'
// 在 VueCLI 创建的项目中 @ 表示 src 目录
// 它是 src 目录的路径别名
// 好处：它不受当前文件路径影响
// 注意：@ 就是 src 路径，后面别忘了写那个斜杠
// 使用建议：如果加载的资源路径就在当前目录下，那就正常写
//       如果需要进行父级路径查找的都使用 @
Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    name: 'Login',
    // component: (Login)
    component: () => import('@/views/admin/login/')
  },
  {
    path: '/admin',
    // 命名路由 layout 有一个默认子路由，这个名字没有意义，所以警告
    // 正确的做法是：如果有默认子路由，就不要给父路由起名字了
    // name: 'layout',
    component: () => import('@/views/admin/layout/'),
    children: [
      {
        // 我们通常会把根路径 / 设置为网站的首页
        // 为啥呢？因为我们在手动输入网址访问网站的时候，可以省略 /
        // 如果你是别的名称，则必须加上
        path: '', // path 为空，会作为默认子路由渲染
        // 路由的名字是干啥的？
        // 参考：https://gitee.com/lipengzhou/toutiao-publish-admin/issues/I1F1BA
        name: 'home',
        component: () => import('@/views/admin/home/')
      },
      {
        path: '/admin/advertise',
        name: 'Advertise',
        // 按需加载
        component: () => import('@/views/admin/advertise/')
      },
      {
        path: '/admin/article',
        name: 'Article',
        component: () => import('@/views/admin/articles/')
      },
      {
        path: '/admin/publish',
        name: 'Publish',
        component: () => import('@/views/admin/publish/')
      },
      {
        path: '/admin/categories',
        name: 'Categories',
        component: () => import('@/views/admin/categories/')
      },
      {
        path: '/admin/comments',
        name: 'Comments',
        component: () => import('@/views/admin/comments/')
      },
      {
        path: '/admin/replies',
        name: 'Replies',
        component: () => import('@/views/admin/replies/')
      },
      {
        path: '/admin/secitons',
        name: 'Secitons',
        component: () => import('@/views/admin/sections/')
      },
      {
        path: '/admin/users',
        name: 'Users',
        component: () => import('@/views/admin/users/')
      },
      {
        path: '/admin/test',
        name: 'Test',
        component: () => import('@/views/admin/categories/test')
      }
    ]
  }]
// 路由配置
const router = new VueRouter({
  // h5模式，去掉#号
  mode: 'history',
  routes,
  // 可以在每次路由跳转后使滚动条回到上一次位置
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
// 路由导航守卫（拦截器）的作用就是控制页面的访问状态
// beforeEach 是全局前置守卫，任何页面的访问都要经过这里
// 路由导航守卫：说白了所有页面的导航都会经过这里
// 守卫页面的导航的
// to：要去的路由信息
// from：来自哪里的路由信息
// next：放行方法
// 配置路有守卫
// const _encode = () => {
//   // vue-ls插件获取localSession
//   const token = Vue.ls.get('token')
//   // base64编码码 添加Basic抬头
//   return 'Basic' + Base64.encode(token + ':')
// }
router.beforeEach(async (to, from, next) => {
  // 如果要访问的页面不是 /login，校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过
  // 允许通过
  // next()
  // 校验非登录页面的登录状态
  const user = JSON.parse(window.localStorage.getItem('user'))
  console.log(to)
  console.log(from)
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      // 如果客户端有token 则验证 token是否有效
      auth().then(() => {
        next()
      }).catch(error => {
        Message.error(error.data.msg || '未授权，请重新登录')
        setTimeout(() => {
          next('/login')
        }, 1500)
      })
    } else {
      // 没有登录，跳转到登录页面
      Message.error('未授权，请重新登录')
      setTimeout(() => {
        next('/login')
      }, 1500)
    }
  } else {
    // 如果已经登录就不能到登录页面
    if (user) {
      next('/admin')
      Message.info('已登录')
    } else {
      // 没有登录可以到登录页面
      next()
    }
  }
})
export default router
// 我们在组件中使用的 this.$router 其实就是这个模块中的 router
