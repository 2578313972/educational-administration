import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh', //使用localStorage缓存到本地，当下次使用时可默认当前使用语言
  messages: {
    'zh': require('@/common/lang/zh'),
    'en': require('@/common/lang/en')
  }
})
export default i18n