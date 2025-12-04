<template>
  <div>
    <CCard class="mb-4">
      <CCardBody>
        <CRow class="align-items-end">
          <CCol md="4">
            <label class="form-label">Dari Tanggal</label>
            <CFormInput type="date" v-model="filter.startDate" />
          </CCol>
          <CCol md="4">
            <label class="form-label">Sampai Tanggal</label>
            <CFormInput type="date" v-model="filter.endDate" />
          </CCol>
          <CCol md="4">
            <CButton color="primary" class="w-100 text-white" @click="fetchReport">
              <CIcon icon="cil-filter" class="me-2"/> Tampilkan Laporan
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CRow class="mb-4">
      <CCol sm="6" lg="3">
        <CCard class="mb-4 text-white bg-success">
          <CCardBody>
            <div class="fs-4 fw-semibold">{{ formatRupiah(summary.sales) }}</div>
            <div>Total Penjualan</div>
            <small class="text-white-50">Uang Masuk (Gross)</small>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol sm="6" lg="3">
        <CCard class="mb-4 text-white bg-info">
          <CCardBody>
            <div class="fs-4 fw-semibold">{{ formatRupiah(summary.profit) }}</div>
            <div>Laba Kotor</div>
            <small class="text-white-50">Penjualan - Modal Barang</small>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol sm="6" lg="3">
        <CCard class="mb-4 text-white bg-danger">
          <CCardBody>
            <div class="fs-4 fw-semibold">{{ formatRupiah(summary.purchases) }}</div>
            <div>Total Pembelian</div>
            <small class="text-white-50">Uang Keluar (Restock)</small>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol sm="6" lg="3">
        <CCard class="mb-4 text-white" :class="summary.cash_flow >= 0 ? 'bg-primary' : 'bg-warning'">
          <CCardBody>
            <div class="fs-4 fw-semibold">{{ formatRupiah(summary.cash_flow) }}</div>
            <div>Arus Kas Bersih</div>
            <small class="text-white-50">Masuk - Keluar</small>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>5 Transaksi Penjualan Terakhir</CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No Invoice</CTableHeaderCell>
                  <CTableHeaderCell>Tanggal</CTableHeaderCell>
                  <CTableHeaderCell>Kasir</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="sale in recentSales" :key="sale.invoice_no">
                  <CTableDataCell>{{ sale.invoice_no }}</CTableDataCell>
                  <CTableDataCell>{{ formatDate(sale.created_at) }}</CTableDataCell>
                  <CTableDataCell>{{ sale.cashier_name }}</CTableDataCell>
                  <CTableDataCell class="fw-bold text-success">{{ formatRupiah(sale.final_amount) }}</CTableDataCell>
                </CTableRow>
                 <CTableRow v-if="recentSales.length === 0">
                    <CTableDataCell colspan="4" class="text-center">Belum ada data</CTableDataCell>
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

export default {
  name: 'ProfitLoss',
  data() {
    return {
      filter: {
        startDate: '',
        endDate: ''
      },
      summary: {
        sales: 0,
        purchases: 0,
        profit: 0,
        cash_flow: 0
      },
      recentSales: []
    };
  },
  mounted() {
    // Default tanggal: Awal bulan ini sampai hari ini
    const date = new Date();
    this.filter.endDate = date.toLocaleDateString('en-CA');
    this.filter.startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
    
    this.fetchReport();
  },
  methods: {
    formatRupiah(val) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('id-ID');
    },
    async fetchReport() {
      try {
        const response = await axios.get('/reports/dashboard', {
          params: {
            start_date: this.filter.startDate,
            end_date: this.filter.endDate
          }
        });
        
        this.summary = response.data.summary;
        this.recentSales = response.data.recent_sales;
        
      } catch (error) {
        console.error(error);
        alert('Gagal memuat laporan');
      }
    }
  }
};
</script>