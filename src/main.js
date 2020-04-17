import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入Element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入axios
import axios from '@/axios/api.js'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import Base64 from '@/plug-in/Base64.js'
import Cookie from '@/plug-in/Cookie.js'
// import Http from '@/axios/api.js'
// Vue.use(Http)
Vue.config.productionTip = false

Vue.prototype.Base64 = Base64
Vue.prototype.Cookie = Cookie
// Vue.prototype.Http = Http

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
