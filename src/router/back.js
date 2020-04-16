export default [
    {
        path: '/BArrange',
        name: 'BArrange',
        component: () => import('../views/back/BArrange.vue')
    },{
        path: '/BPaper',
        name: 'BPaper',
        component: () => import('../views/back/BPaper.vue')
    },{
        path: '/BReadover',
        name: 'BReadover',
        component: () => import('../views/back/BReadover.vue')
    },{
        path: '/BTeacher',
        name: 'BTeacher',
        component: () => import('../views/back/BTeacher.vue')
    },{
        path: '/BTest',
        name: 'BTest',
        component: () => import('../views/back/BTest.vue')
    }
]