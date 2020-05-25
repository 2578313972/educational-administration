import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Front from './front';
import Back from './back';

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: () => import('../views/Home.vue'),
//     children:[
//       ...Front,
//       ...Back
//     ]
//   },{
//     path: '/login',
//     name: 'login',
//     component: () => import('../views/Login.vue')
//   },{
//     path:'*',
//     component:()=> import('../views/404.vue')
//   }
// ]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // routes
})

router.addRoutes([
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

export default router
