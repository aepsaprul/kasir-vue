import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import Categories from '../views/master/Categories.vue'
import Units from '../views/master/Units.vue'
import Products from '../views/master/Products.vue'
import Sales from '../views/transaction/Sales.vue'
import Suppliers from '../views/master/Suppliers.vue'
import Customers from '../views/master/Customers.vue'
import Purchases from '../views/transaction/Purchases.vue'
import ProfitLoss from '../views/reports/ProfitLoss.vue'
import StockOpname from '../views/inventory/StockOpname.vue'
import Profile from '../views/pages/Profile.vue'
import Settings from '../views/pages/Settings.vue'

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
        component: () => Categories
      },
      {
        path: '/master/units',
        name: 'Units',
        component: () => Units
      },
      {
        path: '/master/products',
        name: 'Products',
        component: () => Products
      },
      {
        path: '/master/suppliers',
        name: 'Suppliers',
        component: () => Suppliers
      },
      {
        path: '/master/customers',
        name: 'Customers',
        component: () => Customers
      },
      {
        path: '/transaction/purchases',
        name: 'Purchases',
        component: () => Purchases
      },
      {
        path: '/transaction/sales',
        name: 'Sales',
        component: () => Sales
      },
      {
        path: '/inventory/stock-opname',
        name: 'StockOpname',
        component: () => StockOpname
      },
      {
        path: '/reports/profit-loss',
        name: 'ProfitLoss',
        component: () => ProfitLoss
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => Profile
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => Settings
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
