<template>
  <div>
    <CCard class="mb-4 border-0 bg-transparent">
        <CRow class="align-items-center">
            <CCol md="8" class="mb-3">
                <h4 class="mb-0">Riwayat Pembelian (Stok Masuk)</h4>
            </CCol>
            <CCol md="4">
                <CInputGroup>
                    <CInputGroupText><CIcon icon="cil-search"/></CInputGroupText>
                    <CFormInput 
                        v-model="search" 
                        placeholder="Cari Invoice / Supplier..." 
                    />
                </CInputGroup>
            </CCol>
        </CRow>
    </CCard>

    <div v-if="loading" class="text-center p-5">Memuat Data...</div>

    <CRow v-else>
        <CCol md="12" v-for="pur in filteredPurchases" :key="pur.id" class="mb-3">
            <CCard class="shadow-sm border-start-4 border-start-info">
                <CCardHeader class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{{ pur.invoice_no }}</strong>
                        <span class="ms-2 text-muted small">
                            <CIcon icon="cil-calendar"/> {{ formatDate(pur.created_at) }}
                        </span>
                    </div>
                    <div class="text-end">
                        <small class="text-muted d-block">Total Belanja</small>
                        <strong class="text-danger fs-5">{{ formatRupiah(pur.total_amount) }}</strong>
                    </div>
                </CCardHeader>

                <CCardBody>
                    <div class="row g-3">
                        <div class="col-12 col-md-6 col-lg-4" v-for="item in pur.items" :key="item.id">
                            <CCard class="shadow-sm h-100">
                                <CCardBody>

                                <!-- Nama Produk -->
                                <div class="fw-bold fs-6 mb-1">
                                    {{ item.product_name }}
                                </div>

                                <hr class="my-2">

                                <!-- Qty -->
                                <div class="d-flex justify-content-between small">
                                    <span>Qty</span>
                                    <strong>{{ item.qty }}</strong>
                                </div>

                                <!-- Harga Beli -->
                                <div class="d-flex justify-content-between small">
                                    <span>Harga Beli</span>
                                    <strong>{{ formatRupiah(item.price_buy) }}</strong>
                                </div>

                                <!-- Subtotal -->
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
                        Supplier: <strong class="text-dark">{{ pur.supplier_name }}</strong>
                    </div>
                    <div>
                        Admin: <strong>{{ pur.admin_name }}</strong>
                    </div>
                </CCardFooter>
            </CCard>
        </CCol>

        <CCol v-if="filteredPurchases.length === 0" class="text-center py-5 text-muted">
            Data tidak ditemukan
        </CCol>
    </CRow>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'PurchaseHistory',
    data() {
        return {
        purchases: [],
        search: '',
        loading: false
        };
    },
    computed: {
        filteredPurchases() {
            if (!this.search) return this.purchases;
            const key = this.search.toLowerCase();
            
            return this.purchases.filter(p => 
                p.invoice_no.toLowerCase().includes(key) ||
                (p.supplier_name && p.supplier_name.toLowerCase().includes(key)) ||
                p.created_at.includes(key)
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
                const response = await axios.get('/purchases');
                this.purchases = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>