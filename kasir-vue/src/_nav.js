export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavTitle',
    name: 'Master Data',
  },
  {
    component: 'CNavItem',
    name: 'Kategori',
    to: '/master/categories',
    icon: 'cil-list',
  },
  {
    component: 'CNavItem',
    name: 'Unit',
    to: '/master/units',
    icon: 'cil-align-left',
  },
  {
    component: 'CNavItem',
    name: 'Produk',
    to: '/master/products',
    icon: 'cil-basket',
  },
  {
    component: 'CNavItem',
    name: 'Supplier',
    to: '/master/suppliers',
    icon: 'cil-truck',
  },
  {
    component: 'CNavItem',
    name: 'Pelanggan',
    to: '/master/customers',
    icon: 'cil-user',
  },
  {
    component: 'CNavTitle',
    name: 'Inventori',
  },
  {
    component: 'CNavItem',
    name: 'Stok Opname',
    to: '/inventory/stock-opname',
    icon: 'cil-clipboard',
  },
  {
    component: 'CNavTitle',
    name: 'Transaksi',
  },
  {
    component: 'CNavGroup',
    name: 'Transaksi',
    icon: 'cil-money',
    items: [
      {
        component: 'CNavItem',
        name: 'Kasir / Penjualan',
        to: '/transaction/sales',
      },
      {
        component: 'CNavItem',
        name: 'Riwayat Penjualan',
        to: '/transaction/sales-history',
      },
      {
        component: 'CNavItem',
        name: 'Restock / Pembelian',
        to: '/transaction/purchases',
      },
      {
        component: 'CNavItem',
        name: 'Riwayat Pembelian',
        to: '/transaction/purchase-history',
      },
    ],
  },
  {
    component: 'CNavTitle',
    name: 'Laporan',
  },
  {
    component: 'CNavItem',
    name: 'Laba & Rugi',
    to: '/reports/profit-loss',
    icon: 'cil-chart-pie',
  },
  {
    component: 'CNavTitle',
    name: 'Setting',
  },
  {
    component: 'CNavItem',
    name: 'Pengaturan Toko',
    to: '/settings',
    icon: 'cil-settings', 
  },
]
