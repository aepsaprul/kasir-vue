<template>
    <div>
        <CRow>
            <CCol :md="7">
                <CCard class="mb-4" style="height: 85vh;">
                    <CCardHeader>
                        <CRow class="g-2">
                            <CCol md="4">
                                <CFormSelect v-model="selectedCategory" aria-label="Pilih Kategori">
                                    <option value="">Semua Kategori</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </CFormSelect>
                            </CCol>
                            
                            <CCol md="8">
                                <CInputGroup>
                                <CInputGroupText><CIcon icon="cil-search"/></CInputGroupText>
                                <CFormInput 
                                    v-model="searchKeyword" 
                                    placeholder="Scan Barcode / Cari Produk..." 
                                    ref="searchInput"
                                    autofocus
                                />
                                </CInputGroup>
                            </CCol>
                        </CRow>
                    </CCardHeader>

                    <CCardBody style="overflow-y: auto;">
                        <div v-if="loading" class="text-center p-3">Memuat produk...</div>
                        <div class="row" v-else>
                        <div 
                            class="col-lg-3 col-md-4 col-12 mb-3" 
                            v-for="product in filteredProducts" 
                            :key="product.id"
                            @click="addToCart(product)"
                            style="cursor: pointer;"
                        >
                            <div class="card h-100 border shadow-sm" :class="{'bg-light': product.stock <= 0}">
                            <div class="card-body p-2">
                                <img 
                                    v-if="product.image"
                                    :src="this.$fileURL + product.image"
                                    class="card-img-top product-img"
                                />
                                <div v-else class="no-img-box d-flex align-items-center justify-content-center">
                                    No Image
                                </div>
                                <div class="card-title fw-bold text-truncate" style="font-size: 13px;">{{ product.name }}</div>
                                <div class="text-danger fw-bold" style="font-size: 15px;">{{ formatRupiah(product.price_sell) }}</div>
                                <span style="font-size: 12px;">
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
                                placeholder="Ketik nama pelanggan..." 
                                @focus="showCustomerList = true"
                                @blur="closeListDelay"
                                autocomplete="off"
                            />
                            <CButton type="button" color="secondary" variant="outline" @click="resetCustomer" v-if="selectedCustomerId">
                                X
                            </CButton>
                        </CInputGroup>
                        <ul v-if="showCustomerList" class="custom-dropdown-list list-group">
                            <li v-for="cust in filteredCustomers" :key="cust.id" class="list-group-item list-group-item-action py-1" @mousedown.prevent="selectCustomer(cust)">
                                <small>{{ cust.name }}</small>
                            </li>
                        </ul>
                    </div>

                    <CCardBody style="overflow-y: auto; flex: 1;" class="p-0">
                        <div v-if="cart.length === 0" class="text-center text-muted mt-5">
                            <CIcon icon="cil-basket" class="mb-3"/>
                            <p>Keranjang masih kosong</p>
                        </div>

                        <div v-else>
                            <div v-for="(item, index) in cart" :key="index" class="card m-1 position-relative shadow-sm p-2">
                                <div class="d-flex justify-content-between mb-2">
                                    <div><strong>{{ item.name }}</strong></div>
                                    <div>
                                        <!-- Tombol hapus -->
                                        <CButton color="danger" size="sm" variant="ghost" class="position-absolute top-0 end-0 m-1" @click="removeFromCart(index)">
                                            <CIcon icon="cil-x-circle"></CIcon>
                                        </CButton>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between">
                                    
                                    <!-- Bagian kiri: name + harga -->
                                    <div style="width: 40%;">
                                        <small class="text-muted">{{ formatRupiah(item.price) }}</small>
                                    </div>

                                    <!-- Bagian kanan: qty -->
                                    <div style="width: 40%;">
                                        <div class="input-group input-group-sm">
                                            <button class="btn btn-outline-secondary" type="button" @click="decrementQty(index)" :disabled="item.qty <= 1"><CIcon icon="cil-minus"></CIcon></button>

                                            <input type="text" v-model.number="item.qty" min="1" :max="item.maxStock" class="form-control text-center">

                                            <button class="btn btn-outline-secondary" type="button" @click="incrementQty(index)" :disabled="item.qty >= item.maxStock"><CIcon icon="cil-plus"></CIcon></button>
                                        </div>

                                        <!-- Subtotal kanan bawah qty -->
                                        <div class="text-end fw-bold mt-1">
                                            {{ formatRupiah(item.price * item.qty) }}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </CCardBody>

                    <CCardFooter class="border-top bg-light">
                        <div class="d-flex justify-content-between mb-2">
                            <div>Total</div>
                            <div class="text-danger fw-bold">{{ formatRupiah(grandTotal) }}</div>
                        </div>
                        
                        <hr>

                        <div>
                            <label class="form-label fw-bold small">Metode Pembayaran:</label>
                            <div class="d-flex gap-3">
                                <CFormCheck type="radio" name="payment" id="pay1" label="Tunai" value="Tunai" v-model="paymentMethod" />
                                <CFormCheck type="radio" name="payment" id="pay2" label="QRIS" value="QRIS" v-model="paymentMethod" />
                                <CFormCheck type="radio" name="payment" id="pay3" label="Transfer" value="Transfer" v-model="paymentMethod" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold small">Uang Diterima</label>
                            <money3 
                                v-model.number="payAmount" 
                                v-bind="moneyConfig" 
                                class="form-control form-control text-end fw-bold" 
                                placeholder="0"
                                :disabled="paymentMethod !== 'Tunai'" 
                            ></money3>
                        </div>

                        <div class="d-flex justify-content-between mb-3" v-if="payAmount > 0">
                            <span class="">Kembalian:</span>
                            <span class="fw-bold" :class="changeAmount < 0 ? 'text-danger' : 'text-success'">
                                {{ formatRupiah(changeAmount) }}
                            </span>
                        </div>

                        <div class="d-grid gap-2">
                            <CButton 
                                color="success" 
                                class="text-white" 
                                :disabled="cart.length === 0 || payAmount < grandTotal || isProcessing"
                                @click="processTransaction"
                            >
                                <span v-if="isProcessing">Memproses...</span>
                                <span v-else>
                                    <CIcon icon="cil-credit-card" height="15" class="me-1" />
                                    BAYAR SEKARANG
                                </span>
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
import qz from 'qz-tray';

export default {
    name: 'Sales',
    data() {
        return {
            products: [],
            categories: [], // DATA KATEGORI
            customers: [],
            cart: [],
            
            // Filter Produk
            searchKeyword: '',
            selectedCategory: '', // SELECTED KATEGORI

            // Filter Pelanggan
            customerSearch: '',
            selectedCustomerId: null,
            showCustomerList: false,
            
            // Pembayaran
            payAmount: 0,
            paymentMethod: 'Tunai',

            loading: false,
            isProcessing: false,
            moneyConfig: { prefix: 'Rp ', suffix: '', thousands: '.', decimal: ',', precision: 0, disableNegative: true },

            // STRUK
            settings: { store_name: 'TOKO SAYA', address: 'Alamat Toko' },
            userName: 'Kasir',
            
            // NAMA PRINTER ANDA DI WINDOWS (Sangat Penting! Sesuaikan dengan komputer Anda)
            printerName: 'POS-58',
        };
    },
    computed: {
        // LOGIKA FILTER: SEARCH KEYWORD + CATEGORY
        filteredProducts() {
            // 1. Filter dasar (semua produk)
            let result = this.products;

            // 2. Filter berdasarkan Kategori (Jika ada yg dipilih)
            if (this.selectedCategory) {
                result = result.filter(p => Number(p.category_id) === Number(this.selectedCategory));
            }

            // 3. Filter berdasarkan Keyword (Nama / Kode)
            if (this.searchKeyword) {
                const key = this.searchKeyword.toLowerCase();
                result = result.filter(p => 
                    p.name.toLowerCase().includes(key) || 
                    p.code.toLowerCase().includes(key)
                );
            }

            return result;
        },
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

    watch: {
        paymentMethod(newVal) {
            if (newVal === 'QRIS' || newVal === 'Transfer') {
                this.payAmount = this.grandTotal;
            } else {
                this.payAmount = 0;
            }
        },
        grandTotal(newVal) {
            if (this.paymentMethod === 'QRIS' || this.paymentMethod === 'Transfer') {
                this.payAmount = newVal;
            }
        }
    },

    mounted() {
        this.fetchProducts();
        this.fetchCategories();
        this.fetchCustomers();

        // AMBIL DATA TOKO & KASIR UNTUK STRUK
        const savedSettings = localStorage.getItem('app_settings');
        if (savedSettings) this.settings = JSON.parse(savedSettings);
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) this.userName = JSON.parse(savedUser).name;

        // OTOMATIS KONEK KE QZ TRAY SAAT HALAMAN KASIR DIBUKA
        this.connectQZ();
    },

    methods: {
        formatRupiah(val) {
            let formatted = new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR', 
                minimumFractionDigits: 0 
            }).format(val);
            
            // Hapus karakter non-breaking space (\u00A0) dan ganti dengan spasi biasa
            return formatted.replace(/\u00A0/g, ' ').replace(/\u202F/g, ' ');
        },

        async fetchProducts() {
            this.loading = true;
            try {
                const response = await axios.get('/products');
                this.products = response.data;
            } catch (error) { console.error(error); } finally { this.loading = false; }
        },

        // FUNGSI AMBIL KATEGORI
        async fetchCategories() {
            try {
                const response = await axios.get('/categories');
                this.categories = response.data;
            } catch (error) { console.error(error); }
        },

        async fetchCustomers() {
            try { const res = await axios.get('/customers'); this.customers = res.data; } catch (e) {}
        },

        selectCustomer(cust) {
            this.selectedCustomerId = cust.id; this.customerSearch = cust.name; this.showCustomerList = false;
        },

        resetCustomer() {
            this.selectedCustomerId = null; this.customerSearch = '';
        },

        closeListDelay() { setTimeout(() => { this.showCustomerList = false; }, 200); },
        
        addToCart(product) {
            if (product.stock <= 0) return this.$swal.fire({icon: 'error',title: 'Stok Habis!',text: 'Silakan tambah stok terlebih dahulu.'});
            const existingItem = this.cart.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.qty < product.stock) existingItem.qty++;
                else this.$swal.fire({icon: 'error',title: 'Stok tidak mencukupi!',text: 'Silakan tambah stok terlebih dahulu.'});
            } else {
                this.cart.push({ id: product.id, name: product.name, price: product.price_sell, qty: 1, maxStock: product.stock });
            }
        },

        incrementQty(index) {
            if (this.cart[index].qty < this.cart[index].maxStock) {
                this.cart[index].qty++;
            }
        },
        decrementQty(index) {
            if (this.cart[index].qty > 1) {
                this.cart[index].qty--;
            }
        },

        removeFromCart(index) { this.cart.splice(index, 1); },
        
        async processTransaction() {
            const confirmResult = await this.$swal.fire({
                title: 'Proses Transaksi?',
                text: `Total: ${this.formatRupiah(this.payAmount)} via ${this.paymentMethod}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Bayar Sekarang',
                cancelButtonText: 'Batal'
            });

            if (!confirmResult.isConfirmed) return;

            this.isProcessing = true;
            try {
                const payload = {
                    items: this.cart.map(item => ({ id: item.id, qty: item.qty })),
                    paid_amount: this.payAmount,
                    customer_id: this.selectedCustomerId,
                    payment_method: this.paymentMethod
                };

                const response = await axios.post('/sales', payload);
                
                // await this.$swal.fire({
                //     title: 'Transaksi Berhasil!',
                //     icon: 'success',
                //     html: `
                //         <div class="text-start">
                //             <p><strong>No Invoice:</strong> ${response.data.invoice}</p>
                //             <p><strong>Metode:</strong> ${this.paymentMethod}</p>
                //             <hr>
                //             <h3 class="text-success text-center">Kembalian: ${this.formatRupiah(response.data.change)}</h3>
                //         </div>
                //     `,
                //     confirmButtonText: 'Tutup & Transaksi Baru'
                // });
                
                // this.cart = [];
                // this.payAmount = 0;
                // this.paymentMethod = 'Tunai'; 
                // this.resetCustomer();
                // this.fetchProducts();

                // 1. SIAPKAN DATA UNTUK STRUK SEBELUM CART DIRESET
                // this.receiptData = {
                //     invoice: response.data.invoice,
                //     date: new Date().toLocaleString('id-ID'),
                //     items: [...this.cart], // Copy isi keranjang
                //     total: this.grandTotal,
                //     payAmount: this.payAmount,
                //     change: response.data.change,
                //     method: this.paymentMethod
                // };
                
                // // 2. TAMPILKAN POPUP SUKSES & TANYA CETAK STRUK
                // const swalRes = await this.$swal.fire({
                //     title: 'Transaksi Berhasil!',
                //     icon: 'success',
                //     html: `
                //         <div class="text-start mb-3">
                //             <p class="mb-1"><strong>No Invoice:</strong> ${response.data.invoice}</p>
                //             <p class="mb-1"><strong>Metode:</strong> ${this.paymentMethod}</p>
                //             <h3 class="text-success text-center mt-3">Kembalian: ${this.formatRupiah(response.data.change)}</h3>
                //         </div>
                //     `,
                //     showCancelButton: true,
                //     confirmButtonText: '<i class="cil-print"></i> Cetak Struk',
                //     cancelButtonText: 'Tutup (Transaksi Baru)',
                //     confirmButtonColor: '#3085d6',
                //     cancelButtonColor: '#6c757d'
                // });

                // // 3. JIKA KASIR KLIK "CETAK STRUK"
                // if (swalRes.isConfirmed) {
                //     // Beri jeda sedikit agar Vue merender DOM #print-area
                //     setTimeout(() => {
                //         window.print();
                //     }, 500);
                // }
                
                // 4. RESET FORM SEPERTI BIASA
                this.cart = [];
                this.payAmount = 0;
                this.paymentMethod = 'Tunai'; 
                this.resetCustomer();
                this.fetchProducts();
            } catch (error) {
                this.$swal.fire('Gagal', error.response?.data?.message || 'Transaksi Gagal', 'error');
            } finally {
                this.isProcessing = false;
            }
        },

        async connectQZ() {
            try {
                if (!qz.websocket.isActive()) {
                    await qz.websocket.connect();
                    console.log("QZ Tray Terhubung!");
                }
            } catch (error) {
                console.error("Gagal terhubung ke QZ Tray:", error);
            }
        },

        // --- FUNGSI BARU: BANTUAN FORMAT SPASI STRUK 58mm ---
        // Kertas 58mm standarnya muat 32 Karakter per baris
        formatLine(leftText, rightText) {
            const maxLength = 32; 
            let textL = leftText.toString();
            let textR = rightText.toString();
            
            // Jika kepanjangan, potong teks kiri
            if (textL.length + textR.length + 1 > maxLength) {
                textL = textL.substring(0, maxLength - textR.length - 2) + "..";
            }
            
            // Hitung sisa spasi di tengah
            const spaces = maxLength - (textL.length + textR.length);
            return textL + " ".repeat(Math.max(0, spaces)) + textR;
        },

        // --- FUNGSI BARU: CETAK VIA QZ TRAY ---
        async printReceiptQZ(receiptData) {
            try {
                if (!qz.websocket.isActive()) {
                    await qz.websocket.connect();
                }

                // Cari printer
                const config = qz.configs.create(this.printerName);

                // SUSUN DATA ESC/POS (Bahasa Mesin Printer)
                const data = [
                    '\x1B' + '\x40',          // Init printer
                    '\x1B' + '\x61' + '\x31', // Center align (Tengah)
                    this.settings.store_name + '\n',
                    this.settings.address + '\n',
                    "--------------------------------\n", // 32 Karakter strip
                    
                    '\x1B' + '\x61' + '\x30', // Left align (Kiri)
                    `No   : ${receiptData.invoice}\n`,
                    `Kasir: ${this.userName}\n`,
                    `Tgl  : ${receiptData.date}\n`,
                    "--------------------------------\n",
                ];

                // Masukkan Item Belanja
                receiptData.items.forEach(item => {
                    // Baris 1: Nama Produk
                    data.push(item.name + '\n');
                    // Baris 2: Qty x Harga  ................ Subtotal
                    let qtyPrice = `${item.qty}x ${this.formatRupiah(item.price)}`;
                    let subTotal = this.formatRupiah(item.qty * item.price);
                    data.push(this.formatLine(qtyPrice, subTotal) + '\n');
                });

                // Bagian Bawah / Total
                data.push("--------------------------------\n");
                data.push(this.formatLine("Total", this.formatRupiah(receiptData.total)) + '\n');
                data.push(this.formatLine(`Bayar (${receiptData.method})`, this.formatRupiah(receiptData.payAmount)) + '\n');
                data.push(this.formatLine("Kembali", this.formatRupiah(receiptData.change)) + '\n');
                
                data.push("--------------------------------\n");
                data.push('\x1B' + '\x61' + '\x31'); // Center align
                data.push("*** TERIMA KASIH ***\n");
                data.push('\x0A\x0A\x0A\x0A'); // Feed (Gulung) kertas 4 baris agar mudah disobek
                
                // JIKA PUNYA LACI KASIR (Cash Drawer), Buka otomatis dengan kode ini:
                // data.push('\x1B' + '\x70' + '\x00' + '\x19' + '\xFA'); 

                // PERINTAH CETAK
                await qz.print(config, data);
                
            } catch (err) {
                console.error("Print Error:", err);
                this.$swal.fire('Error Printer', 'Gagal mencetak. Pastikan QZ Tray menyala dan nama printer benar.', 'error');
            }
        },

        // --- UPDATE FUNGSI PROSES TRANSAKSI ---
        async processTransaction() {
        // (Validasi sama persis seperti sebelumnya)
        // ... 
        
        this.isProcessing = true;
        try {
            const payload = {
            items: this.cart.map(item => ({ id: item.id, qty: item.qty })),
            paid_amount: this.payAmount,
            customer_id: this.selectedCustomerId,
            payment_method: this.paymentMethod
            };

            const response = await axios.post('/sales', payload);
            
            // 1. SIAPKAN DATA STRUK
            const receiptData = {
                invoice: response.data.invoice,
                date: new Date().toLocaleString('id-ID'),
                items: [...this.cart], 
                total: this.grandTotal,
                payAmount: this.payAmount,
                change: response.data.change,
                method: this.paymentMethod
            };
            
            // 2. TAMPILKAN POPUP KEMBALIAN
            const swalRes = await this.$swal.fire({
                title: 'Transaksi Berhasil!',
                icon: 'success',
                html: `
                    <div class="text-start mb-3">
                        <p class="mb-1"><strong>No Invoice:</strong> ${response.data.invoice}</p>
                        <p class="mb-1"><strong>Metode:</strong> ${this.paymentMethod}</p>
                        <h3 class="text-success text-center mt-3">Kembalian: ${this.formatRupiah(response.data.change)}</h3>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: '<i class="cil-print"></i> Cetak Struk',
                cancelButtonText: 'Tutup',
                confirmButtonColor: '#3085d6',
            });

            // 3. PANGGIL QZ TRAY JIKA KLIK CETAK
            if (swalRes.isConfirmed) {
                await this.printReceiptQZ(receiptData);
            }
            
            // 4. RESET FORM
            this.cart = [];
            this.payAmount = 0;
            this.paymentMethod = 'Tunai'; 
            this.resetCustomer();
            this.fetchProducts(); 
            
        } catch (error) {
            this.$swal.fire('Gagal', error.response?.data?.message || 'Transaksi Gagal', 'error');
        } finally {
            this.isProcessing = false;
        }
        }
    }
};
</script>

<style scoped>
    .custom-dropdown-list {
        position: absolute; top: 100%; left: 15px; right: 15px; z-index: 1000;
        max-height: 200px; overflow-y: auto; border: 1px solid #ddd; background: white;
    }

    @media print {

        /* Garis putus-putus khas struk */
        .dashed-line {
            border-top: 1px dashed #000;
            margin: 5px 0;
        }
    }
</style>
<style>
@media print {
    /* 1. KUNCI UTAMA: Beritahu browser ukuran kertasnya 58mm dan tingginya otomatis */
    @page {
        size: 58mm auto; 
        margin: 0mm;
    }

    /* 2. Reset ukuran layar bawaan */
    html, body {
        width: 58mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
    }

    /* 3. Sembunyikan semua elemen website */
    body * {
        visibility: hidden;
    }

    /* 4. Tampilkan area struk */
    #print-area, #print-area * {
        visibility: visible;
    }

    /* 5. Tarik struk paksa ke pojok kiri atas halaman kertas */
    #print-area {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 55mm !important; /* Sengaja dibuat 55mm agar ada sisa margin aman */
        margin: 0 !important;
        padding: 0 !important;
        color: black !important;
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 11px !important;
    }

    /* Garis putus-putus untuk struk */
    .dashed-line {
        border-top: 1px dashed black !important;
        margin: 5px 0 !important;
    }
}
</style>