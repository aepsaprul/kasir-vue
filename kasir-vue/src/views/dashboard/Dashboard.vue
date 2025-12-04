<template>
  <div>
    <CRow>
      <CCol :xs="12" :sm="6" :lg="3">
        <CWidgetStatsF class="mb-3" color="primary" title="Penjualan Hari Ini">
            <template #value>{{ formatRupiah(stats.today_sales) }}</template>
            <template #icon><CIcon icon="cil-money" height="24"/></template>
        </CWidgetStatsF>
      </CCol>
      <CCol :xs="12" :sm="6" :lg="3">
        <CWidgetStatsF class="mb-3" color="success" title="Penjualan Bulan Ini">
            <template #value>{{ formatRupiah(stats.month_sales) }}</template>
            <template #icon><CIcon icon="cil-calendar" height="24"/></template>
        </CWidgetStatsF>
      </CCol>
      <CCol :xs="12" :sm="6" :lg="3">
        <CWidgetStatsF class="mb-3" color="warning" title="Total Produk">
            <template #value>{{ stats.total_products }} Item</template>
            <template #icon><CIcon icon="cil-basket" height="24"/></template>
        </CWidgetStatsF>
      </CCol>
      <CCol :xs="12" :sm="6" :lg="3">
        <CWidgetStatsF class="mb-3" color="info" title="Pelanggan Terdaftar">
            <template #value>{{ stats.total_customers }} Orang</template>
            <template #icon><CIcon icon="cil-people" height="24"/></template>
        </CWidgetStatsF>
      </CCol>
    </CRow>

    <CRow>
      <CCol :md="8" class="mb-4">
        <CCard class="h-100">
          <CCardHeader>Tren Penjualan (7 Hari Terakhir)</CCardHeader>
          <CCardBody>
             <CChart 
                type="line" 
                :data="chartData" 
                :options="{ maintainAspectRatio: false }"
                style="height: 300px"
             />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol :md="4" class="mb-4">
        <CCard class="h-100 border-danger">
          <CCardHeader class="bg-danger text-white">
            <CIcon icon="cil-warning" /> Stok Menipis (Segera Restock!)
          </CCardHeader>
          <CCardBody>
            <ul class="list-group list-group-flush" v-if="lowStock.length > 0">
                <li class="list-group-item d-flex justify-content-between align-items-center"
                    v-for="item in lowStock" :key="item.name">
                    <div>
                        {{ item.name }}
                        <div class="small text-muted">Batas Min: {{ item.min_stock }}</div>
                    </div>
                    <span class="badge bg-danger rounded-pill">{{ item.stock }}</span>
                </li>
            </ul>
            <div v-else class="text-center text-success mt-4">
                <CIcon icon="cil-check-circle" size="3xl" />
                <p class="mt-2">Semua stok aman!</p>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>5 Transaksi Terakhir</CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Invoice</CTableHeaderCell>
                  <CTableHeaderCell>Waktu</CTableHeaderCell>
                  <CTableHeaderCell>Kasir</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="sale in recentSales" :key="sale.invoice_no">
                  <CTableDataCell>#{{ sale.invoice_no }}</CTableDataCell>
                  <CTableDataCell>{{ formatDate(sale.created_at) }}</CTableDataCell>
                  <CTableDataCell>{{ sale.cashier }}</CTableDataCell>
                  <CTableDataCell class="fw-bold">{{ formatRupiah(sale.final_amount) }}</CTableDataCell>
                  <CTableDataCell><span class="badge bg-success">Lunas</span></CTableDataCell>
                </CTableRow>
                <CTableRow v-if="recentSales.length === 0">
                    <CTableDataCell colspan="5" class="text-center">Belum ada transaksi</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import axios from 'axios';
import { CChart } from '@coreui/vue-chartjs'; // Import Chart CoreUI

export default {
  name: 'Dashboard',
  components: { CChart },
  data() {
    return {
      stats: { today_sales: 0, month_sales: 0, total_products: 0, total_customers: 0 },
      lowStock: [],
      recentSales: [],
      
      // Data Default Chart (Kosong)
      chartData: {
        labels: [],
        datasets: [{
            label: 'Omset Harian',
            backgroundColor: 'rgba(50, 31, 219, 0.2)', // Warna area
            borderColor: 'rgba(50, 31, 219, 1)', // Warna garis
            pointBackgroundColor: 'rgba(50, 31, 219, 1)',
            data: []
        }]
      }
    };
  },
  mounted() {
    this.fetchDashboard();
  },
  methods: {
    formatRupiah(val) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('id-ID');
    },
    async fetchDashboard() {
      try {
        const response = await axios.get('/dashboard');
        const data = response.data;

        // 1. Isi Data Statistik
        this.stats = data.stats;
        this.lowStock = data.low_stock;
        this.recentSales = data.recent_sales;

        // 2. Format Data untuk Grafik (ChartJS)
        if (data.chart && data.chart.length > 0) {
            // Ambil label tanggal (misal: "2023-10-01")
            const labels = data.chart.map(item => {
                const d = new Date(item.date);
                return `${d.getDate()}/${d.getMonth()+1}`; // Format dd/mm
            });
            // Ambil data total uang
            const totals = data.chart.map(item => item.total);

            this.chartData = {
                labels: labels,
                datasets: [{
                    label: 'Omset Harian',
                    backgroundColor: 'rgba(50, 31, 219, 0.2)',
                    borderColor: 'rgba(50, 31, 219, 1)',
                    pointBackgroundColor: 'rgba(50, 31, 219, 1)',
                    data: totals,
                    fill: true
                }]
            };
        }

      } catch (error) {
        console.error('Gagal memuat dashboard', error);
      }
    }
  }
};
</script>