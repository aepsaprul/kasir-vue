<template>
    <div>
        <CRow>
            <CCol :md="7">
                <CCard class="mb-4" style="height: 85vh;">
                    <CCardHeader>
                        <CInputGroup>
                            <CInputGroupText><CIcon icon="cil-search"/></CInputGroupText>
                            <CFormInput 
                                v-model="searchKeyword" 
                                placeholder="Scan Barcode atau Cari Nama Produk..." 
                                ref="searchInput"
                                autofocus
                            />
                        </CInputGroup>
                    </CCardHeader>
                    <CCardBody style="overflow-y: auto;">
                        <div v-if="loading" class="text-center p-3">Memuat produk...</div>
                        
                        <div class="row" v-else>
                            <div 
                                class="col-md-4 mb-3" 
                                v-for="product in filteredProducts" 
                                :key="product.id"
                                @click="addToCart(product)"
                                style="cursor: pointer;"
                            >
                                <div class="card h-100 border-primary" :class="{'bg-light': product.stock <= 0}">
                                <div class="card-body p-2 text-center">
                                    <h6 class="card-title text-truncate">{{ product.name }}</h6>
                                    <p class="card-text text-muted mb-1 small">{{ product.code }}</p>
                                    <h5 class="text-primary">{{ formatRupiah(product.price_sell) }}</h5>
                                    <span class="badge" :class="product.stock > 0 ? 'bg-success' : 'bg-danger'">
                                    Stok: {{ product.stock }}
                                    </span>
                                </div>
                                </div>
                            </div>
                            <div v-if="filteredProducts.length === 0" class="col-12 text-center text-muted mt-5">
                                Produk tidak ditemukan
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>

            <CCol :md="5">
                <CCard class="mb-4" style="height: 85vh;">
                    <CCardHeader class="bg-primary text-white">
                        <strong>Keranjang Belanja</strong>
                    </CCardHeader>
                    
                    <div class="p-3 bg-light border-bottom position-relative">
                        <label class="form-label small text-muted mb-1">Pelanggan:</label>
                        <CInputGroup size="sm">
                            <CInputGroupText><CIcon icon="cil-user"/></CInputGroupText>
                            <CFormInput 
                                v-model="customerSearch" 
                                placeholder="Ketik nama pelanggan (Kosongkan untuk Umum)" 
                                @focus="showCustomerList = true"
                                @blur="closeListDelay"
                                autocomplete="off"
                            />
                            <CButton type="button" color="secondary" variant="outline" @click="resetCustomer" v-if="selectedCustomerId">
                                X
                            </CButton>
                        </CInputGroup>

                        <ul v-if="showCustomerList" class="custom-dropdown-list list-group">
                            <li 
                                v-for="cust in filteredCustomers" 
                                :key="cust.id" 
                                class="list-group-item list-group-item-action py-1"
                                @mousedown.prevent="selectCustomer(cust)"
                            >
                                <small>{{ cust.name }} - {{ cust.phone }}</small>
                            </li>
                            <li v-if="filteredCustomers.length === 0" class="list-group-item text-muted py-1">
                                <small>Tidak ditemukan</small>
                            </li>
                        </ul>
                    </div>

                    <CCardBody style="overflow-y: auto; flex: 1;">
                        <div v-if="cart.length === 0" class="text-center text-muted mt-5">
                        <CIcon icon="cil-basket" size="4xl" class="mb-3"/>
                        <p>Keranjang masih kosong</p>
                        </div>
                        
                        <table v-else class="table table-sm table-borderless align-middle">
                        <thead>
                            <tr class="border-bottom">
                            <th>Item</th>
                            <th width="15%">Qty</th>
                            <th class="text-end">Subtotal</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cart" :key="index" class="border-bottom">
                            <td>
                                {{ item.name }}<br>
                                <small class="text-muted">{{ formatRupiah(item.price) }}</small>
                            </td>
                            <td>
                                <input 
                                type="number" 
                                v-model.number="item.qty" 
                                min="1" 
                                :max="item.maxStock" 
                                class="form-control form-control-sm text-center"
                                >
                            </td>
                            <td class="text-end fw-bold">{{ formatRupiah(item.price * item.qty) }}</td>
                            <td class="text-end">
                                <CButton color="danger" size="sm" variant="ghost" @click="removeFromCart(index)">
                                x
                                </CButton>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </CCardBody>

                    <CCardFooter class="border-top bg-light">
                        <div class="d-flex justify-content-between mb-2">
                            <h4>Total</h4>
                            <h4 class="text-primary">{{ formatRupiah(grandTotal) }}</h4>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Uang Diterima</label>
                            <money3 
                                v-model.number="payAmount" 
                                v-bind="moneyConfig" 
                                class="form-control form-control-lg text-end fw-bold" 
                                placeholder="0"
                            ></money3>
                        </div>

                        <div class="d-flex justify-content-between mb-3" v-if="payAmount > 0">
                            <span class="fs-5">Kembalian:</span>
                            <span class="fs-5 fw-bold" :class="changeAmount < 0 ? 'text-danger' : 'text-success'">
                                {{ formatRupiah(changeAmount) }}
                            </span>
                        </div>

                        <div class="d-grid gap-2">
                            <CButton 
                                color="success" 
                                size="lg" 
                                class="text-white" 
                                :disabled="cart.length === 0 || payAmount < grandTotal || isProcessing"
                                @click="processTransaction"
                            >
                                {{ isProcessing ? 'Memproses...' : 'BAYAR SEKARANG' }}
                            </CButton>
                        </div>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Sales',
    data() {
        return {
            products: [],
            customers: [], // Data Pelanggan
            cart: [],
            
            // Pencarian Produk
            searchKeyword: '',
            
            // Pencarian Pelanggan
            customerSearch: '',
            selectedCustomerId: null, // ID Pelanggan yang dipilih (null = umum)
            showCustomerList: false,

            payAmount: 0,
            loading: false,
            isProcessing: false,
            
            moneyConfig: {
                prefix: 'Rp ', suffix: '', thousands: '.', decimal: ',', precision: 0, disableNegative: true,
            }
        };
    },
    computed: {
        // Filter produk
        filteredProducts() {
            if (!this.searchKeyword) return this.products;
            const key = this.searchKeyword.toLowerCase();
            return this.products.filter(p => 
                p.name.toLowerCase().includes(key) || 
                p.code.toLowerCase().includes(key)
            );
        },
        // Filter pelanggan (BARU)
        filteredCustomers() {
            if (!this.customerSearch && !this.selectedCustomerId) return this.customers;
            const key = this.customerSearch.toLowerCase();
            return this.customers.filter(c => c.name.toLowerCase().includes(key));
        },
        grandTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        },
        changeAmount() {
            return this.payAmount - this.grandTotal;
        }
    },
    mounted() {
        this.fetchProducts();
        this.fetchCustomers(); // Ambil data pelanggan saat load
    },
    methods: {
        formatRupiah(val) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
        },
        async fetchProducts() {
            this.loading = true;
            try {
                const response = await axios.get('/products');
                this.products = response.data;
            } catch (error) { console.error(error); } 
            finally { this.loading = false; }
        },
        // (BARU) Ambil data pelanggan
        async fetchCustomers() {
            try {
                const response = await axios.get('/customers');
                this.customers = response.data;
            } catch (error) { console.error('Gagal load pelanggan', error); }
        },
        // (BARU) Pilih Pelanggan dari dropdown
        selectCustomer(cust) {
            this.selectedCustomerId = cust.id;
            this.customerSearch = cust.name;
            this.showCustomerList = false;
        },
        // (BARU) Reset Pelanggan jadi Umum
        resetCustomer() {
            this.selectedCustomerId = null;
            this.customerSearch = '';
        },
        // (BARU) Tutup dropdown delay
        closeListDelay() {
            setTimeout(() => { this.showCustomerList = false; }, 200);
        },

        addToCart(product) {
        if (product.stock <= 0) return alert('Stok Habis!');
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.qty < product.stock) existingItem.qty++;
            else alert('Stok tidak mencukupi!');
        } else {
            this.cart.push({
            id: product.id, name: product.name, price: product.price_sell, qty: 1, maxStock: product.stock
            });
        }
        },
        removeFromCart(index) {
            this.cart.splice(index, 1);
        },
        async processTransaction() {
            if (!confirm('Proses transaksi ini?')) return;

            this.isProcessing = true;
            try {
                const payload = {
                items: this.cart.map(item => ({ id: item.id, qty: item.qty })),
                paid_amount: this.payAmount,
                customer_id: this.selectedCustomerId // Kirim ID Pelanggan (atau null)
                };

                const response = await axios.post('/sales', payload);
                
                alert(`Transaksi Berhasil!\nInvoice: ${response.data.invoice}\nKembalian: ${this.formatRupiah(response.data.change)}`);
                
                // Reset Form
                this.cart = [];
                this.payAmount = 0;
                this.resetCustomer(); // Reset pelanggan
                this.fetchProducts(); 
                
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || 'Transaksi Gagal');
            } finally {
                this.isProcessing = false;
            }
        }
    }
};
</script>

<style scoped>
    /* CSS Dropdown Autocomplete */
    .custom-dropdown-list {
        position: absolute;
        top: 100%;
        left: 15px; /* Sesuaikan padding */
        right: 15px;
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #ddd;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        background: white;
    }
    .list-group-item { cursor: pointer; }
    .list-group-item:hover { background-color: #f0f3f5; }
</style>