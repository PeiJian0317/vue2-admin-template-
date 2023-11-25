import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import departmentRouter from './modules/department'
import approvalRouter from './modules/approval'
import attendanceRouter from './modules/attendance'
import employeeRouter from './modules/employee'
import permissionRouter from './modules/permission'
import roleRouter from './modules/role'
import salaryRouter from './modules/salary'
import socialRouter from './modules/social'


//静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 404 page must be placed at the end !!!
]

//动态路由
export const asyncRoutes = [
  departmentRouter,
  approvalRouter,
  attendanceRouter,
  employeeRouter,
  permissionRouter,
  roleRouter,
  salaryRouter,
  socialRouter,
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes //默认引入静态路由
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router
