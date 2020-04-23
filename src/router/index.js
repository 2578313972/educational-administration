import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Front from './front';
import Back from './back';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children:[
      ...Front,
      ...Back
    ]
  },{
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// import Cookie from '@/plug-in/Cookie.js'
// 全局导航守卫
// router.beforeEach((to, from, next) => {
//   if(!Cookie.getCookie("token")&&to.fullPath!=="/login"){
//     return next('/login')
//   }
//   next()
// })


export default router
