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
                        + Tambah ke List
                    </CButton>
                </CCol>
            </CRow>

            <CTable hover bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Produk</CTableHeaderCell>
                        <CTableHeaderCell>Harga Beli</CTableHeaderCell>
                        <CTableHeaderCell>Qty</CTableHeaderCell>
                        <CTableHeaderCell>Subtotal</CTableHeaderCell>
                        <CTableHeaderCell>Aksi</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow v-for="(item, idx) in cart" :key="idx">
                        <CTableDataCell>{{ item.name }}</CTableDataCell>
                        <CTableDataCell>{{ formatRupiah(item.price_buy) }}</CTableDataCell>
                        <CTableDataCell>{{ item.qty }}</CTableDataCell>
                        <CTableDataCell>{{ formatRupiah(item.price_buy * item.qty) }}</CTableDataCell>
                        <CTableDataCell>
                            <CButton color="danger" size="sm" class="text-white" @click="removeItem(idx)">Hapus</CButton>
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow v-if="cart.length === 0">
                        <CTableDataCell colspan="5" class="text-center text-muted">Belum ada barang yang ditambahkan</CTableDataCell>
                    </CTableRow>
                </CTableBody>
                <CTableFoot>
                    <CTableRow>
                        <CTableHeaderCell colspan="3" class="text-end fw-bold">Total Pembelian:</CTableHeaderCell>
                        <CTableHeaderCell colspan="2" class="fw-bold fs-5">{{ formatRupiah(grandTotal) }}</CTableHeaderCell>
                    </CTableRow>
                </CTableFoot>
            </CTable>

            <div class="d-grid gap-2 mt-4">
                <CButton color="success" size="lg" class="text-white" :disabled="cart.length === 0" @click="submitPurchase">
                    SIMPAN PEMBELIAN
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
        if (!this.tempForm.id) return alert("Pilih produk dulu");
        if (this.tempForm.qty <= 0) return alert("Qty minimal 1");

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
        this.$refs.inputProduct.focus(); // Balik fokus ke input
    },
    removeItem(idx) {
        this.cart.splice(idx, 1);
    },

    async submitPurchase() {
        if(!this.selectedSupplierId) return alert("Pilih Supplier dulu!");
        if(!confirm("Simpan Data Pembelian? Stok akan bertambah.")) return;

        try {
            await axios.post('/purchases', {
                supplier_id: this.selectedSupplierId,
                invoice_no: this.invoiceNo,
                items: this.cart
            });

            alert("Pembelian Berhasil Disimpan!");
            // Reset Semua
            this.cart = [];
            this.invoiceNo = '';
            this.supplierSearch = '';
            this.selectedSupplierId = null;
            this.fetchData(); // Refresh data produk (stok baru)
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan pembelian");
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