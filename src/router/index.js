import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const context = require.context(".", false, /[^index]\.js$/)
let routerArr = []
context.keys().map(context).forEach(item=>{
  routerArr.push(...item.default)
})

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
})

router.addRoutes([
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children:[
      ...routerArr
    ]
  },{
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },{
    path:'*',
    component:()=> import('../views/404.vue')
  }
])

import Cookie from '@/plug-in/Cookie.js'

// 全局导航守卫
router.beforeEach((to, from, next) => {
  if(!Cookie.getCookie("token")&&to.fullPath!=="/login"){
    return next('/login')
  }
  next()
})

export default router;