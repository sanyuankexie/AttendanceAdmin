import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import AddMember from '@/views/AddMember.vue'
import SubMember from '@/views/SubMember.vue'
import SignTimeManager from '@/views/SignTimeManager.vue'
import Appeal from '@/views/Appeal.vue'


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'manage',
        component: SignTimeManager,
        meta: {title: '签到时长管理'}
      },
      {
        path: 'appeal',
        name: 'appeal',
        component: Appeal,
        meta: {title: '申诉处理'}
      },
      {
        path: 'add',
        name: 'add',
        component: AddMember,
        meta: {title: '增加新成员'}
      },
      {
        path: 'sub',
        name: 'sub',
        component: SubMember,
        meta: {title: '移除成员'}
      },
    ],
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('id')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
