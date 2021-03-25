import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueParticles from 'vue-particles'
import ElementUI from 'element-ui'
import Storage from 'vue-ls'
import '@/styles/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(VueParticles)
Vue.use(ElementUI)
Vue.use(Storage, {
  namespace: 'vologo__', // key键前缀 比如abc存的数据 为 vologo_abc
  name: 'ls', // 命名Vue变量.[ls]或this.[$ls],
  storage: 'local' // 存储名称: session, local=》localSession, memory
})
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
