import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入Element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入axios
import axios from 'axios'
import api from '@/axios/apiDatas' // 改变了原始的axios路径  添加了  拦截器
import VueAxios from 'vue-axios'
Vue.use(VueAxios,axios)

Vue.prototype.api = new api

import Base64 from '@/plug-in/Base64.js'
import Cookie from '@/plug-in/Cookie.js'

Vue.config.productionTip = false

Vue.prototype.Base64 = Base64
Vue.prototype.Cookie = Cookie

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')