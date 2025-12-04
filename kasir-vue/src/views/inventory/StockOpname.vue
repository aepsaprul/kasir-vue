<template>
  <div>
    <CRow>
      <CCol :md="4">
        <CCard class="mb-4">
          <CCardHeader><strong>Input Stok Fisik</strong></CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitOpname">
                
                <div class="mb-3 position-relative">
                    <label class="form-label">Cari Produk</label>
                    <CFormInput 
                        v-model="productSearch" 
                        placeholder="Scan atau ketik nama..." 
                        @focus="showProductList = true"
                        @blur="closeListDelay"
                        autocomplete="off"
                    />
                    <ul v-if="showProductList" class="custom-dropdown-list list-group">
                        <li 
                            v-for="p in filteredProducts" :key="p.id" 
                            class="list-group-item list-group-item-action"
                            @mousedown.prevent="selectProduct(p)"
                        >
                            {{ p.name }} <br>
                            <small class="text-muted">Stok Sistem: {{ p.stock }}</small>
                        </li>
                    </ul>
                </div>

                <div class="mb-3">
                    <label class="form-label">Stok di Sistem (Komputer)</label>
                    <CFormInput type="text" :value="form.system_stock" disabled class="bg-light fw-bold"/>
                </div>

                <div class="mb-3">
                    <label class="form-label">Stok Fisik (Nyata)</label>
                    <CFormInput type="number" v-model="form.real_stock" required placeholder="Jumlah hitungan manual"/>
                </div>

                <div class="mb-3" v-if="form.product_id">
                    <label class="form-label">Selisih</label>
                    <div :class="differenceClass" class="form-control fw-bold">
                        {{ difference > 0 ? '+' : '' }}{{ difference }}
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Catatan / Alasan</label>
                    <CFormTextarea v-model="form.note" rows="2" placeholder="Contoh: Barang rusak, Hilang, dll"></CFormTextarea>
                </div>

                <div class="d-grid">
                    <CButton color="primary" type="submit" :disabled="!form.product_id">
                        Sesuaikan Stok
                    </CButton>
                </div>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol :md="8">
        <CCard class="mb-4">
          <CCardHeader>Riwayat Penyesuaian Stok</CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Waktu</CTableHeaderCell>
                  <CTableHeaderCell>Produk</CTableHeaderCell>
                  <CTableHeaderCell>Sistem</CTableHeaderCell>
                  <CTableHeaderCell>Fisik</CTableHeaderCell>
                  <CTableHeaderCell>Selisih</CTableHeaderCell>
                  <CTableHeaderCell>Admin</CTableHeaderCell>
                  <CTableHeaderCell>Ket</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="item in history" :key="item.id">
                  <CTableDataCell>{{ formatDate(item.created_at) }}</CTableDataCell>
                  <CTableDataCell>
                      {{ item.product_name }}<br>
                      <small class="text-muted">{{ item.code }}</small>
                  </CTableDataCell>
                  <CTableDataCell>{{ item.system_stock }}</CTableDataCell>
                  <CTableDataCell class="fw-bold">{{ item.real_stock }}</CTableDataCell>
                  <CTableDataCell :class="item.difference < 0 ? 'text-danger' : 'text-success'">
                      {{ item.difference > 0 ? '+' : '' }}{{ item.difference }}
                  </CTableDataCell>
                  <CTableDataCell>{{ item.admin_name }}</CTableDataCell>
                  <CTableDataCell class="small">{{ item.note }}</CTableDataCell>
                </CTableRow>
                 <CTableRow v-if="history.length === 0">
                    <CTableDataCell colspan="7" class="text-center">Belum ada data</CTableDataCell>
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
  name: 'StockOpname',
  data() {
    return {
      products: [], // Semua data produk untuk pencarian
      history: [],  // Data tabel kanan
      
      // Form Input
      productSearch: '',
      showProductList: false,
      form: {
        product_id: null,
        system_stock: 0,
        real_stock: '',
        note: ''
      }
    };
  },
  computed: {
    // Filter Pencarian
    filteredProducts() {
        if(!this.productSearch) return [];
        return this.products.filter(p => p.name.toLowerCase().includes(this.productSearch.toLowerCase()));
    },
    // Hitung Selisih Realtime
    difference() {
        if (this.form.real_stock === '') return 0;
        return parseInt(this.form.real_stock) - this.form.system_stock;
    },
    // Styling warna selisih
    differenceClass() {
        if(this.difference < 0) return 'text-danger';
        if(this.difference > 0) return 'text-success';
        return 'text-muted';
    }
  },
  mounted() {
    this.fetchProducts();
    this.fetchHistory();
  },
  methods: {
    formatDate(date) {
        return new Date(date).toLocaleString('id-ID');
    },
    async fetchProducts() {
        try {
            const res = await axios.get('/products');
            this.products = res.data;
        } catch (e) { console.error(e); }
    },
    async fetchHistory() {
        try {
            const res = await axios.get('/stock-opname');
            this.history = res.data;
        } catch (e) { console.error(e); }
    },
    
    // Logic Autocomplete
    selectProduct(p) {
        this.form.product_id = p.id;
        this.form.system_stock = p.stock;
        this.form.real_stock = ''; // Reset input fisik
        this.productSearch = p.name;
        this.showProductList = false;
    },
    closeListDelay() {
        setTimeout(() => { this.showProductList = false; }, 200);
    },

    async submitOpname() {
        if(!confirm(`Yakin mengubah stok menjadi ${this.form.real_stock}?`)) return;

        try {
            await axios.post('/stock-opname', {
                product_id: this.form.product_id,
                real_stock: this.form.real_stock,
                note: this.form.note
            });
            
            alert('Stok berhasil disesuaikan!');
            
            // Refresh Data
            this.fetchHistory();
            this.fetchProducts(); // Refresh master produk biar stok sistem update
            
            // Reset Form
            this.form = { product_id: null, system_stock: 0, real_stock: '', note: '' };
            this.productSearch = '';

        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan data');
        }
    }
  }
};
</script>

<style scoped>
.custom-dropdown-list {
    position: absolute; top: 100%; left: 0; right: 0; z-index: 1000;
    max-height: 200px; overflow-y: auto; background: white; border: 1px solid #ddd;
}
.list-group-item { cursor: pointer; }
.list-group-item:hover { background-color: #f0f3f5; }
</style>