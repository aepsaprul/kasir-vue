<template>
    <div>
        <CCard class="mb-4 border-0 bg-transparent">
            <CRow class="align-items-center">
                <CCol md="8">
                    <h4 class="mb-0">Riwayat Penjualan (Kasir)</h4>
                </CCol>
                <CCol md="4">
                    <CInputGroup>
                        <CInputGroupText><CIcon icon="cil-search"/></CInputGroupText>
                        <CFormInput 
                            v-model="search" 
                            placeholder="Cari Invoice / Pelanggan / Tanggal..." 
                        />
                    </CInputGroup>
                </CCol>
            </CRow>
        </CCard>

        <div v-if="loading" class="text-center p-5">Memuat Data...</div>

        <CRow v-else>
            <CCol md="12" v-for="sale in filteredSales" :key="sale.id" class="mb-3">
                <CCard class="shadow-sm border-start-4 border-start-info">
                    <CCardHeader class="d-flex justify-content-between align-items-center bg-light">
                        <div>
                            <strong>{{ sale.invoice_no }}</strong>
                            <span class="ms-2 text-muted small">
                                <CIcon icon="cil-calendar"/> {{ formatDate(sale.created_at) }}
                            </span>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-success me-2">Lunas</span>
                            <strong class="text-primary fs-5">{{ formatRupiah(sale.final_amount) }}</strong>
                        </div>
                    </CCardHeader>

                    <CCardBody>
                        <div class="row g-3">
                            <div class="col-12 col-md-6 col-lg-4" v-for="item in sale.items" :key="item.id">
                                <CCard class="shadow-sm h-100">
                                    <CCardBody>
                                    
                                    <!-- Nama Produk -->
                                    <div class="fw-bold fs-6">
                                        {{ item.product_name }}
                                    </div>
                                    <small class="text-muted">
                                        Kode: {{ item.code }}
                                    </small>

                                    <hr class="my-2">

                                    <!-- Detail -->
                                    <div class="d-flex justify-content-between small">
                                        <span>Qty</span>
                                        <strong>{{ item.qty }}</strong>
                                    </div>

                                    <div class="d-flex justify-content-between small">
                                        <span>Harga</span>
                                        <strong>{{ formatRupiah(item.price) }}</strong>
                                    </div>

                                    <div class="d-flex justify-content-between mt-2">
                                        <span class="fw-bold">Subtotal</span>
                                        <span class="fw-bold text-primary">
                                        {{ formatRupiah(item.subtotal) }}
                                        </span>
                                    </div>

                                    </CCardBody>
                                </CCard>
                            </div>
                        </div>
                    </CCardBody>

                    <CCardFooter class="d-flex justify-content-between small text-muted">
                        <div>
                            Pelanggan: <strong>{{ sale.customer_name || 'Umum' }}</strong>
                        </div>
                        <div>
                            Kasir: <strong>{{ sale.cashier_name }}</strong>
                        </div>
                        <div v-if="sale.discount_amount > 0" class="text-danger">
                            Diskon: -{{ formatRupiah(sale.discount_amount) }}
                        </div>
                    </CCardFooter>
                </CCard>
            </CCol>

            <CCol v-if="filteredSales.length === 0" class="text-center py-5 text-muted">
                Data tidak ditemukan
            </CCol>
        </CRow>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SalesHistory',
    data() {
        return {
        sales: [],
        search: '',
        loading: false
        };
    },
    computed: {
        // Logic Filter Pencarian
        filteredSales() {
            if (!this.search) return this.sales;
            const key = this.search.toLowerCase();
            
            return this.sales.filter(s => 
                s.invoice_no.toLowerCase().includes(key) ||
                (s.customer_name && s.customer_name.toLowerCase().includes(key)) ||
                s.created_at.includes(key)
            );
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        formatRupiah(val) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
        },
        formatDate(date) {
            return new Date(date).toLocaleString('id-ID');
        },
        async fetchData() {
            this.loading = true;
            try {
                const response = await axios.get('/sales'); // GET History
                this.sales = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>