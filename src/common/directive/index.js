import Vue from 'vue'
// 注册一个全局自定义指令 `v-has`
Vue.directive('has', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, val) {
    switch (val.value) {
      case 1:
        break;
      default:
        // el.style.display = 'none'
        el.remove();
        break;
    }
  }
});