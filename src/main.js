import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Base64 from '@/plug-in/Base64.js'
import Cookie from '@/plug-in/Cookie.js'
import SaveTraffic from '@/plug-in/SaveTraffic'

import Print from 'vue-print-nb'

import i18n from './common/lang/i18n'
Vue.use(ElementUI)

require('default-passive-events')
Vue.use(Print)

require('./common/directive')

// Vue.config.productionTip = false

Vue.prototype.Base64 = Base64
Vue.prototype.Cookie = Cookie
Vue.prototype.SaveTraffic = SaveTraffic

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
