<template>
    <div>
        <CRow>
            <CCol :md="12">
                <CCard class="mb-4">
                <CCardHeader class="d-flex justify-content-between align-items-center">
                    <strong>Data Produk</strong>
                    <CButton color="primary" size="sm" @click="openModal">
                    + Tambah Produk
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    <CTable hover responsive bordered>
                        <CTableHead>
                            <CTableRow>
                            <CTableHeaderCell>Kode</CTableHeaderCell>
                            <CTableHeaderCell>Nama Produk</CTableHeaderCell>
                            <CTableHeaderCell>Kategori</CTableHeaderCell>
                            <CTableHeaderCell>Stok</CTableHeaderCell>
                            <CTableHeaderCell>Harga Jual</CTableHeaderCell>
                            <CTableHeaderCell>Aksi</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in products" :key="item.id">
                            <CTableDataCell>{{ item.code }}</CTableDataCell>
                            <CTableDataCell>
                                {{ item.name }} <br>
                                <small class="text-muted">Unit: {{ item.unit_name }}</small>
                            </CTableDataCell>
                            <CTableDataCell>{{ item.category_name }}</CTableDataCell>
                            <CTableDataCell>
                                <span :class="item.stock <= item.min_stock ? 'text-danger fw-bold' : 'text-success'">
                                    {{ item.stock }}
                                </span>
                                <br>
                                <small class="text-muted" style="font-size: 0.7rem;">Min: {{ item.min_stock }}</small>
                            </CTableDataCell>
                            <CTableDataCell>{{ formatRupiah(item.price_sell) }}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="warning" size="sm" class="me-1 text-white" @click="editItem(item)">Edit</CButton>
                                <CButton color="danger" size="sm" class="text-white" @click="deleteItem(item.id)">Hapus</CButton>
                            </CTableDataCell>
                            </CTableRow>
                            <CTableRow v-if="products.length === 0">
                                <CTableDataCell colspan="6" class="text-center">Belum ada data produk</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
                </CCard>
            </CCol>
        </CRow>

        <CModal :visible="showModal" @close="showModal = false" size="lg" backdrop="static">
        <CModalHeader>
            <CModalTitle>{{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CForm class="row g-3">
                <CCol md="4">
                    <CFormLabel>Kode Barang / Barcode</CFormLabel>
                    <CFormInput v-model="form.code" placeholder="Scan atau ketik..." />
                </CCol>
                <CCol md="8">
                    <CFormLabel>Nama Produk</CFormLabel>
                    <CFormInput v-model="form.name" placeholder="Nama lengkap produk" />
                </CCol>

                <CCol md="6" class="mb-3 position-relative">
                    <CFormLabel>Kategori</CFormLabel>

                    <CFormInput
                        type="text"
                        placeholder="Ketik nama kategori..."
                        v-model="categorySearch"
                        @focus="showCategoryDropdown = true"
                        @input="filterCategories"
                        autocomplete="off"
                    />

                    <ul 
                        v-if="showCategoryDropdown" 
                        class="list-group position-absolute w-100 shadow mt-1"
                        style="z-index: 1050; max-height: 200px; overflow-y: auto;"
                    >
                        <li 
                            v-for="cat in filteredCategories" 
                            :key="cat.id"
                            class="list-group-item list-group-item-action cursor-pointer"
                            @click="selectCategory(cat)"
                        >
                            <strong>{{ cat.name }}</strong>
                        </li>

                        <li v-if="filteredCategories.length === 0" class="list-group-item text-muted">
                            Kategori tidak ditemukan
                        </li>
                    </ul>
                </CCol>

                <CCol md="6" class="mb-3 position-relative">
                    <CFormLabel>Satuan (Unit)</CFormLabel>

                    <CFormInput
                        type="text"
                        placeholder="Ketik nama satuan..."
                        v-model="unitSearch"
                        @focus="showUnitDropdown = true"
                        @input="filterUnits"
                        autocomplete="off"
                    />

                    <ul 
                        v-if="showUnitDropdown" 
                        class="list-group position-absolute w-100 shadow mt-1"
                        style="z-index: 1050; max-height: 200px; overflow-y: auto;"
                    >
                        <li 
                            v-for="unit in filteredUnits" 
                            :key="unit.id"
                            class="list-group-item list-group-item-action cursor-pointer"
                            @click="selectUnit(unit)"
                        >
                            <strong>{{ unit.name }}</strong>
                        </li>

                        <li v-if="filteredUnits.length === 0" class="list-group-item text-muted">
                            Satuan tidak ditemukan
                        </li>
                    </ul>
                </CCol>

                <CCol md="12"><hr/></CCol>

                <CCol md="4">
                    <CFormLabel>Harga Beli (Modal)</CFormLabel>
                    <money3 v-model.number="form.price_buy" v-bind="moneyConfig" class="form-control"></money3>
                </CCol>
                <CCol md="4">
                    <CFormLabel>Harga Jual (Eceran)</CFormLabel>
                    <money3 v-model.number="form.price_sell" v-bind="moneyConfig" class="form-control"></money3>
                </CCol>
                <!-- <CCol md="4">
                    <CFormLabel>Stok Awal</CFormLabel>
                    <CFormInput type="number" v-model="form.stock" />
                </CCol> -->
                <CCol md="12"><hr class="my-2"/></CCol>

                <CCol md="6">
                    <CFormLabel>Stok Saat Ini</CFormLabel>
                    <CFormInput type="number" v-model="form.stock" placeholder="0" />
                </CCol>
                <CCol md="6">
                    <CFormLabel class="text-danger fw-bold">Minimal Stok (Alert)</CFormLabel>
                    <CFormInput type="number" v-model="form.min_stock" placeholder="Batas aman stok (misal: 5)" />
                    <div class="form-text">Peringatan muncul jika stok mencapai angka ini.</div>
                </CCol>

                <CCol md="12"><hr/></CCol>
                
                <CCol md="6">
                    <CFormLabel>Harga Grosir</CFormLabel>
                    <money3 v-model.number="form.price_wholesale" v-bind="moneyConfig" class="form-control"></money3>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Min. Beli (Qty Grosir)</CFormLabel>
                    <CFormInput type="number" v-model="form.min_wholesale_qty" />
                </CCol>

            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="showModal = false">Batal</CButton>
            <CButton color="primary" @click="saveData">Simpan Produk</CButton>
        </CModalFooter>
        </CModal>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Products',
    data() {
        return {
            products: [],
            categories: [],
            units: [],
            showModal: false,
            isEdit: false,
            
            // Form Data
            form: {
                id: null, code: '', name: '', category_id: null, unit_id: null,
                price_buy: 0, price_sell: 0, price_wholesale: 0, min_wholesale_qty: 0, stock: 0,
                min_stock: 5
            },

        // ========= Dropdown Kategori =========
            categorySearch: "",
            showCategoryDropdown: false,
            filteredCategories: [],

            // ========= Dropdown Unit =========
            unitSearch: "",
            showUnitDropdown: false,
            filteredUnits: [],

            moneyConfig: {
                prefix: 'Rp ', suffix: '', thousands: '.', decimal: ',', precision: 0, disableNegative: true,
            }
        };
    },

    mounted() {
        this.fetchProducts();
        this.fetchDropdowns();

        // Tutup dropdown jika klik di luar elemen
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.position-relative')) {
                this.showCategoryDropdown = false;
                this.showUnitDropdown = false;
            }
        });
    },

    methods: {
        formatRupiah(val) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
        },
        async fetchProducts() {
        try {
            const response = await axios.get('/products');
            this.products = response.data;
        } catch (error) { console.error(error); }
        },
        async fetchDropdowns() {
            try {
                const reqCat = await axios.get('/categories');
                const reqUnit = await axios.get('/units');
                this.categories = reqCat.data;
                this.units = reqUnit.data; 
            } catch (error) { console.error('Gagal load dropdown', error); }
        },

        // ==================== KATEGORI ==================== //
        filterCategories() {
            const query = this.categorySearch.toLowerCase();
            this.filteredCategories = this.categories.filter(c => 
                c.name.toLowerCase().includes(query)
            );
        },

        selectCategory(cat) {
            this.form.category_id = cat.id;
            this.categorySearch = cat.name;
            this.showCategoryDropdown = false;
        },

        // ==================== UNIT ==================== //
        filterUnits() {
            const query = this.unitSearch.toLowerCase();
            this.filteredUnits = this.units.filter(u => 
                u.name.toLowerCase().includes(query)
            );
        },

        selectUnit(unit) {
            this.form.unit_id = unit.id;
            this.unitSearch = unit.name;
            this.showUnitDropdown = false;
        },

        // Delay penutupan list agar klik sempat tereksekusi
        closeListDelay(type) {
            setTimeout(() => {
                if(type === 'cat') this.showCategoryList = false;
                if(type === 'unit') this.showUnitList = false;
            }, 200);
        },
        // ----------------------------------

        openModal() {
            this.isEdit = false;
            this.form = { 
                id: null, code: '', name: '', category_id: null, unit_id: null,
                price_buy: 0, price_sell: 0, price_wholesale: 0, min_wholesale_qty: 0, stock: 0,
                min_stock: 5
            };
            // Reset input pencarian
            this.categorySearch = '';
            this.unitSearch = '';
            this.showModal = true;
        },
        editItem(item) {
            this.isEdit = true;
            this.form = { ...item };
            
            // Isi input pencarian dengan nama yang sudah ada (biar user tau isinya apa)
            this.categorySearch = item.category_name || ''; 
            this.unitSearch = item.unit_name || '';
            
            this.showModal = true;
        },
        async saveData() {
            if(!this.form.name || !this.form.category_id) return alert("Lengkapi data!");
            
            try {
                if (this.isEdit) {
                    await axios.put(`/products/${this.form.id}`, this.form);
                } else {
                    await axios.post('/products', this.form);
                }
                this.showModal = false;
                this.fetchProducts();
                alert('Berhasil disimpan!');
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || 'Gagal menyimpan');
            }
        },
        async deleteItem(id) {
            if(confirm('Hapus produk ini?')) {
                try {
                    await axios.delete(`/products/${id}`);
                    this.fetchProducts();
                } catch (error) { alert('Gagal hapus'); }
            }
        }
    }
};
</script>

<style scoped>
/* CSS untuk Custom Dropdown List */
.custom-dropdown-list {
    position: absolute;
    top: 100%; /* Muncul persis di bawah input */
    left: 12px; /* Menyesuaikan padding kolom bootstrap */
    right: 12px;
    z-index: 1055; /* Di atas modal (modal bootstrap biasanya z-index 1050) */
    max-height: 200px; /* Batasi tinggi agar bisa discroll */
    overflow-y: auto;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    background: white;
    border-radius: 0 0 5px 5px;
}
.list-group-item {
    cursor: pointer;
}
.list-group-item:hover {
    background-color: #f0f3f5;
}
</style>