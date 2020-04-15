import Vue from 'vue'
import VueRouter from 'vue-router'

import front from './front'
import queen from './queen'
import Home from '../views/home.vue'
import Login from '../views/login.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      ...front,
      ...queen,
      {path:"/",name: 'Login',component: Login,}
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
