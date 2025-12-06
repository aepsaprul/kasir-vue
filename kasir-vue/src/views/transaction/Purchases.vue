<template>
    <div>
        <CRow>
            <CCol :md="12">
                <CCard class="mb-4">
                    <CCardHeader><strong>Transaksi Pembelian (Stok Masuk)</strong></CCardHeader>
                    <CCardBody>
                        <CRow class="mb-4">
                            <CCol md="6" class="position-relative">
                                <label class="form-label">Supplier</label>
                                <CFormInput 
                                    v-model="supplierSearch" 
                                    placeholder="Cari Supplier..." 
                                    @focus="showSupplierList = true"
                                    @blur="closeListDelay('supp')"
                                />
                                <ul v-if="showSupplierList" class="custom-dropdown-list list-group">
                                    <li v-for="s in filteredSuppliers" :key="s.id" class="list-group-item list-group-item-action" 
                                        @mousedown.prevent="selectSupplier(s)">
                                        {{ s.name }}
                                    </li>
                                </ul>
                            </CCol>
                            <CCol md="6">
                                <label class="form-label">No. Nota (Opsional)</label>
                                <CFormInput v-model="invoiceNo" placeholder="Nomor faktur dari supplier" />
                            </CCol>
                        </CRow>

                        <hr>

                        <CRow class="g-3 align-items-end mb-4 bg-light p-3 border rounded">
                            <CCol md="4" class="position-relative">
                                <label class="form-label">Cari Produk</label>
                                <CFormInput 
                                    v-model="productSearch" 
                                    placeholder="Nama Produk..." 
                                    @focus="showProductList = true"
                                    @blur="closeListDelay('prod')"
                                    ref="inputProduct"
                                />
                                <ul v-if="showProductList" class="custom-dropdown-list list-group">
                                    <li v-for="p in filteredProducts" :key="p.id" class="list-group-item list-group-item-action" 
                                        @mousedown.prevent="selectProduct(p)">
                                        {{ p.name }}
                                    </li>
                                </ul>
                            </CCol>
                            <CCol md="3">
                                <label class="form-label">Harga Beli (Per Unit)</label>
                                <money3 v-model.number="tempForm.price_buy" v-bind="moneyConfig" class="form-control"></money3>
                            </CCol>
                            <CCol md="2">
                                <label class="form-label">Jumlah (Qty)</label>
                                <CFormInput type="number" v-model="tempForm.qty" min="1" />
                            </CCol>
                            <CCol md="3">
                                <CButton color="primary" class="w-100" @click="addItemToCart">
                                    <CIcon icon="cil-plus" height="15"/> Tambah ke List
                                </CButton>
                            </CCol>
                        </CRow>

                        <div>
                            <!-- Jika kosong -->
                            <div v-if="cart.length === 0" class="text-center text-muted py-4">
                                Belum ada barang yang ditambahkan
                            </div>

                            <!-- List Cart -->
                            <div v-else class="d-flex flex-column gap-1">
                                <CCard v-for="(item, idx) in cart" :key="idx" class="shadow-sm">
                                <CCardBody>
                                    <div class="d-flex justify-content-between">
                                        <!-- Nama Produk -->
                                        <div class="fw-bold fs-5 mb-1">{{ item.name }}</div>
    
                                        <!-- Tombol Hapus -->
                                        <div class="d-flex justify-content-end">
                                            <CButton color="danger" variant="ghost" @click="removeItem(idx)">
                                                <CIcon icon="cil-x-circle" height="20"></CIcon>
                                            </CButton>
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-between">
                                        <!-- Harga, Qty, Subtotal -->
                                        <div class="text-muted small mb-1"><span class="fw-semibold">{{ formatRupiah(item.price_buy) }}</span></div>
                                        <div class="text-muted small mb-1"><span class="fw-semibold">x{{ item.qty }}</span></div>
                                        <div class="text-muted small mb-3"><span class="fw-bold text-dark">{{ formatRupiah(item.price_buy * item.qty) }}</span></div>
                                    </div>

                                </CCardBody>
                                </CCard>

                            </div>

                            <!-- Total Pembelian -->
                            <div v-if="cart.length > 0" class="mt-4 p-3 bg-light rounded shadow-sm">
                                <div class="d-flex justify-content-between align-items-center">
                                <div class="fw-bold fs-5">Total Pembelian:</div>
                                <div class="fw-bold fs-4">{{ formatRupiah(grandTotal) }}</div>
                                </div>
                            </div>
                        </div>


                        <div class="d-grid gap-2 mt-4">
                            <CButton color="success" class="text-white" :disabled="cart.length === 0" @click="submitPurchase">
                                <CIcon icon="cil-cart" height="18"/> SIMPAN PEMBELIAN
                            </CButton>
                        </div>

                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Purchases',
    data() {
        return {
            suppliers: [],
            products: [],
            cart: [],
            
            // Form Header
            supplierSearch: '',
            selectedSupplierId: null,
            invoiceNo: '',
            
            // Form Item Sementara
            productSearch: '',
            tempForm: { id: null, name: '', price_buy: 0, qty: 1 },
            
            // Kontrol Dropdown
            showSupplierList: false,
            showProductList: false,
            
            moneyConfig: {
                prefix: 'Rp ', suffix: '', thousands: '.', decimal: ',', precision: 0, disableNegative: true,
            }
        };
    },

    computed: {
        filteredSuppliers() {
            return this.suppliers.filter(s => s.name.toLowerCase().includes(this.supplierSearch.toLowerCase()));
        },
        filteredProducts() {
            return this.products.filter(p => p.name.toLowerCase().includes(this.productSearch.toLowerCase()));
        },
        grandTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price_buy * item.qty), 0);
        }
    },

    mounted() {
        this.fetchData();
    },

    methods: {
        formatRupiah(val) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
        },
        async fetchData() {
            try {
                const [reqSupp, reqProd] = await Promise.all([
                    axios.get('/suppliers'),
                    axios.get('/products')
                ]);
                this.suppliers = reqSupp.data;
                this.products = reqProd.data;
            } catch (error) { console.error(error); }
        },
        
        // Autocomplete Logic
        selectSupplier(s) {
            this.selectedSupplierId = s.id;
            this.supplierSearch = s.name;
            this.showSupplierList = false;
        },

        selectProduct(p) {
            this.tempForm.id = p.id;
            this.tempForm.name = p.name;
            this.tempForm.price_buy = p.price_buy; // Load harga beli terakhir
            this.productSearch = p.name;
            this.showProductList = false;
        },
        
        closeListDelay(type) {
            setTimeout(() => {
                if(type === 'supp') this.showSupplierList = false;
                if(type === 'prod') this.showProductList = false;
            }, 200);
        },

        addItemToCart() {
            if (!this.tempForm.id) return this.$swal.fire({icon: 'error',title: 'Gagal!',text: 'Pilih produk dulu.',timer: 1500,showConfirmButton: false});
            if (this.tempForm.qty <= 0) return this.$swal.fire({icon: 'error',title: 'Gagal!',text: 'Qty minimal 1',timer: 1500,showConfirmButton: false});

            // Cek apakah barang sudah ada di list, kalau ada update qty dan harga baru
            const existing = this.cart.find(item => item.id === this.tempForm.id);
            if(existing) {
                existing.qty += parseInt(this.tempForm.qty);
                existing.price_buy = this.tempForm.price_buy; // Update harga jika berubah
            } else {
                this.cart.push({ ...this.tempForm, qty: parseInt(this.tempForm.qty) });
            }

            // Reset Form Item
            this.productSearch = '';
            this.tempForm = { id: null, name: '', price_buy: 0, qty: 1 };
        },

        removeItem(idx) {
            this.cart.splice(idx, 1);
        },

        async submitPurchase() {
            if(!this.selectedSupplierId) return this.$swal.fire({icon: 'error',title: 'Gagal!',text: 'Pilih supplier dulu.',timer: 1500,showConfirmButton: false});
            // if(!confirm("Simpan Data Pembelian? Stok akan bertambah.")) return;

            const result = await this.$swal.fire({
                title: 'Simpan Data Pembelian?',
                text: "Stok akan bertambah.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                cancelButtonText: 'Batal',
                reverseButtons: true
            });

            if (result.isConfirmed) {
                try {
                    await axios.post('/purchases', {
                        supplier_id: this.selectedSupplierId,
                        invoice_no: this.invoiceNo,
                        items: this.cart
                    });

                    // Reset Semua
                    this.cart = [];
                    this.invoiceNo = '';
                    this.supplierSearch = '';
                    this.selectedSupplierId = null;
                    this.fetchData();

                    this.$swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Pembelian Berhasil Disimpan.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    // console.error(error);
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Gagal menyimpan pembelian.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            }
        }
    }
};
</script>

<style scoped>
    .custom-dropdown-list {
        position: absolute; top: 100%; left: 12px; right: 12px; z-index: 1000;
        max-height: 200px; overflow-y: auto; background: white; border: 1px solid #ddd;
    }
    .list-group-item { cursor: pointer; }
    .list-group-item:hover { background-color: #f0f3f5; }
</style>