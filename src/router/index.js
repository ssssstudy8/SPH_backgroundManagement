import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)


//常量路由（所有角色都可以访问） 登录 404 首页
export const constantRoutes = [{
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
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    }]
  }
]

//异步路由 需要通过不同角色的权限筛选
export const asyncRoutes = [{
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'el-icon-goods'
    },
    children: [{
        path: 'trademark',
        name: 'Trademark',
        component: () => import('@/views/product/tradeMark'),
        meta: {
          title: '品牌管理'
        }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        meta: {
          title: '平台属性管理'
        }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: {
          title: 'Sku管理'
        }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: {
          title: 'Spu管理'
        }
      }
    ]
  },

  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [{
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
]

//任意路由  路径错误重定向到404
export const anyRoutes = [{
  path: '*',
  redirect: '/404',
  hidden: true
}]

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()


export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
