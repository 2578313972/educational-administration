export default [
  {
    path: '/BArrange',
    name: 'BArrange',
    component: () => import('../views/back/BArrange.vue')
  }, {
    path: '/BPaper',
    name: 'BPaper',
    component: () => import('../views/back/BPaper.vue')
  }, {
    path: '/BReadover',
    name: 'BReadover',
    component: () => import('../views/back/BReadover.vue')
  }, {
    path: '/BMakePaper',
    name: 'BMakePaper',
    component: () => import('../views/back/BMakePaper.vue')
  }, {
    path: '/BTest',
    name: 'BTest',
    component: () => import('../views/back/BTest.vue')
  }, {
    path: 'BPaperZJ',
    name: 'BPaperZJ',
    component: () => import('../views/back/BPaperZJ.vue')
  }, {
    path: 'BReadoverZJ',
    name: 'BReadoverZJ',
    component: () => import('../views/back/BReadoverZJ.vue')
  }
]
