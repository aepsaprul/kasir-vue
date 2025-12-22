import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'
          ),
      },
      {
        path: '/master/categories',
        name: 'Categories',
        component: () => import('@/views/master/Categories.vue')
      },
      {
        path: '/master/units',
        name: 'Units',
        component: () => import('@/views/master/Units.vue')
      },
      {
        path: '/master/products',
        name: 'Products',
        component: () => import('@/views/master/Products.vue')
      },
      {
        path: '/master/suppliers',
        name: 'Suppliers',
        component: () => import('@/views/master/Suppliers.vue')
      },
      {
        path: '/master/customers',
        name: 'Customers',
        component: () => import('@/views/master/Customers.vue')
      },
      {
        path: '/transaction/purchases',
        name: 'Purchases',
        component: () => import('@/views/transaction/Purchases.vue')
      },
      {
        path: '/transaction/sales',
        name: 'Sales',
        component: () => import('@/views/transaction/Sales.vue')
      },
      {
        path: '/transaction/sales-history',
        name: 'SalesHistory',
        component: () => import('@/views/transaction/SalesHistory.vue')
      },
      {
        path: '/transaction/purchase-history',
        name: 'PurchaseHistory',
        component: () => import('@/views/transaction/PurchaseHistory.vue')
      },
      {
        path: '/inventory/stock-opname',
        name: 'StockOpname',
        component: () => import('@/views/inventory/StockOpname.vue')
      },
      {
        path: '/reports/profit-loss',
        name: 'ProfitLoss',
        component: () => import('@/views/reports/ProfitLoss.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/pages/Profile.vue')
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/pages/Settings.vue')
      },
      {
        path: '/settings/roles',
        name: 'Roles',
        component: () => import('@/views/settings/Roles.vue')
      },
      {
        path: '/settings/users',
        name: 'Users',
        component: () => import('@/views/settings/Users.vue')
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
        meta: { guest: true },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  // 1. Jika halaman butuh login (requiresAuth) TAPI tidak ada token
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/pages/login'); // Tendang ke login
  } 
  // 2. Jika halaman khusus tamu (guest) TAPI sudah punya token (sudah login)
  else if (to.matched.some(record => record.meta.guest) && token) {
    next('/dashboard'); // Alihkan ke dashboard
  } 
  // 3. Lanjut normal
  else {
    next(); 
  }
});

export default router
