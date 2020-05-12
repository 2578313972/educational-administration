import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入Element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import Base64 from '@/plug-in/Base64.js'
import Cookie from '@/plug-in/Cookie.js'
import SaveTraffic from '@/plug-in/SaveTraffic'
import deepClone from '@/plug-in/deepClone'

Vue.config.productionTip = false

Vue.prototype.Base64 = Base64
Vue.prototype.Cookie = Cookie
Vue.prototype.SaveTraffic = SaveTraffic
Vue.prototype.DeepClone = deepClone

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')