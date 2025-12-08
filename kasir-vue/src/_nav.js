export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    permissionKey: 'dashboard',
  },
  {
    component: 'CNavGroup',
    name: 'Master Data',
    icon: 'cil-layers',
    permissionKey: 'master_data',
    items: [
      {
        component: 'CNavItem',
        name: 'Kategori',
        to: '/master/categories',
        permissionKey: 'categories',
      },
      {
        component: 'CNavItem',
        name: 'Unit',
        to: '/master/units',
        permissionKey: 'units',
      },
      {
        component: 'CNavItem',
        name: 'Produk',
        to: '/master/products',
        permissionKey: 'products',
      },
      {
        component: 'CNavItem',
        name: 'Supplier',
        to: '/master/suppliers',
        permissionKey: 'suppliers',
      },
      {
        component: 'CNavItem',
        name: 'Pelanggan',
        to: '/master/customers',
        permissionKey: 'customers',
      },
    ]
  },
  {
    component: 'CNavItem',
    name: 'Stok Opname',
    to: '/inventory/stock-opname',
    icon: 'cil-clipboard',
    permissionKey: 'stock_opname',
  },
  {
    component: 'CNavGroup',
    name: 'Transaksi',
    icon: 'cil-money',
    permissionKey: 'transactions',
    items: [
      {
        component: 'CNavItem',
        name: 'Kasir / Penjualan',
        to: '/transaction/sales',
        permissionKey: 'pos',
      },
      {
        component: 'CNavItem',
        name: 'Riwayat Penjualan',
        to: '/transaction/sales-history',
        permissionKey: 'pos_history',
      },
      {
        component: 'CNavItem',
        name: 'Restock / Pembelian',
        to: '/transaction/purchases',
        permissionKey: 'purchase',
      },
      {
        component: 'CNavItem',
        name: 'Riwayat Pembelian',
        to: '/transaction/purchase-history',
        permissionKey: 'purchase_history',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Laba & Rugi',
    to: '/reports/profit-loss',
    icon: 'cil-chart-pie',
    permissionKey: 'profit_loss',
  },
  {
    component: 'CNavItem',
    name: 'Pengaturan Toko',
    to: '/settings',
    icon: 'cil-settings', 
    permissionKey: 'settings_store', 
  },
  {
    component: 'CNavItem',
    name: 'Roles',
    to: '/settings/roles',
    icon: 'cil-settings', 
    permissionKey: 'settings_roles', 
  },
  {
    component: 'CNavItem',
    name: 'Users',
    to: '/settings/users',
    icon: 'cil-settings', 
    permissionKey: 'settings_users', 
  },
]
