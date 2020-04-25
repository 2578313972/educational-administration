export default [
    {
        path: '/FClass',
        name: 'FClass',
        component: () => import('../views/front/FClass.vue')
    },{
        path: '/FPassword',
        name: 'FPassword',
        component: () => import('../views/front/FPassword.vue')
    },{
        path: '/FStudent',
        name: 'FStudent',
        component: () => import('../views/front/FStudent.vue')
    },{
        path: '/FTeacher',
        name: 'FTeacher',
        component: () => import('../views/front/FTeacher.vue')
    },{
        path: '/FRole',
        name: 'FRole',
        component: () => import('../views/front/FRole.vue')
    }
]