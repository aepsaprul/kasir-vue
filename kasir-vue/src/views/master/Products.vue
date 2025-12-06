<template>
    <div>
        <CRow>
            <CCol :md="12">
                <CCard class="mb-4">
                    <CCardHeader>
                        <CRow>
                            <CCol>
                                <strong>Data Produk</strong>
                            </CCol>
                            <CCol class="text-end">
                                <CButton color="primary" size="sm" @click="openModal"><CIcon icon="cil-plus" height="15"/> Tambah Produk</CButton>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CInputGroup size="sm">
                            <CInputGroupText><CIcon icon="cil-search"/></CInputGroupText>
                            <CFormInput v-model="searchKeyword" placeholder="Cari Kode, Nama, Kategori..."/>
                        </CInputGroup>
                    </CCardBody>
                </CCard>

                <div class="row g-3">
                            <div 
                                class="col-12" 
                                v-for="item in filteredProducts" 
                                :key="item.id"
                            >
                                <div class="card h-100 shadow-sm product-card">
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex justify-content-center align-items-center" style="width: 20%;">
                                            <!-- Gambar Produk -->
                                            <img 
                                                v-if="item.image"
                                                :src="this.$fileURL + item.image"
                                                class="card-img-top product-img p-3"
                                            />
                                            <div v-else class="no-img-box d-flex align-items-center justify-content-center">
                                                No Image
                                            </div>
                                        </div>
                                        <div style="width: 80%;">
                                            <div class="card-body p-3">
                                                <h6 class="fw-bold mb-1">{{ item.name }}</h6>
        
                                                <div class="text-muted small mb-2 d-flex justify-content-between">
                                                    <div><span class="fw-bold">{{ item.code }}</span> <span class="badge bg-light text-dark border">{{ item.category_name }}</span></div>
                                                    <div class="text-end"><span class="fw-bold">{{ formatRupiah(item.price_sell) }}</span></div>
                                                </div>
        
                                                <div class="d-flex justify-content-between align-items-end mb-2">
                                                    <div>
                                                        <small class="text-muted">Stok</small><br>
                                                        <span :class="item.stock <= item.min_stock ? 'text-danger fw-bold' : 'text-success fw-bold'">
                                                            {{ item.stock }}
                                                        </span>
                                                        <small class="text-muted"> / Min {{ item.min_stock }} {{ item.unit_name }}</small>
                                                    </div>
                                                    <div>
                                                        <CButton color="warning" size="sm" class="me-1 text-white" @click="editItem(item)"><CIcon icon="cil-pencil" height="18"/></CButton>
                                                        <CButton color="danger" size="sm" class="text-white" @click="deleteItem(item.id)"><CIcon icon="cil-trash" height="18"/></CButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="filteredProducts.length === 0" class="col-12 text-center py-4 text-muted">
                                {{ searchKeyword ? 'Produk tidak ditemukan' : 'Belum ada data produk' }}
                            </div>
                        </div>
            </CCol>
        </CRow>

        <CModal :visible="showModal" @close="showModal = false" size="lg" backdrop="static">
            <CModalHeader>
                <CModalTitle>{{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm class="row g-3">
                    
                    <CCol md="12" class="d-flex align-items-center mb-3">
                        <div class="me-3 border p-1 rounded">
                            <img :src="imagePreview || this.$fileURL + `broken-image.png`" 
                                style="width: 100px; height: 100px; object-fit: cover;" />
                        </div>
                        <div class="flex-grow-1">
                            <label class="form-label">Foto Produk</label>
                            <input type="file" @change="handleFileChange" class="form-control" accept="image/*">
                            <div class="form-text">Biarkan kosong jika tidak ingin mengubah gambar.</div>
                        </div>
                    </CCol>

                    <CCol md="4">
                        <CFormLabel>Kode Barang</CFormLabel>
                        <CFormInput v-model="form.code" placeholder="Scan..." />
                    </CCol>
                    <CCol md="8">
                        <CFormLabel>Nama Produk</CFormLabel>
                        <CFormInput v-model="form.name" />
                    </CCol>

                    <CCol md="6" class="position-relative">
                        <CFormLabel>Kategori</CFormLabel>
                        <CFormInput 
                            type="text" v-model="categorySearch" placeholder="Cari kategori..." 
                            @focus="showCategoryList = true" @blur="closeListDelay('cat')" autocomplete="off"
                        />
                        <input type="hidden" v-model="form.category_id">
                        <ul v-if="showCategoryList" class="custom-dropdown-list list-group">
                            <li v-for="cat in filteredCategories" :key="cat.id" class="list-group-item list-group-item-action" @mousedown.prevent="selectCategory(cat)">
                                {{ cat.name }}
                            </li>
                        </ul>
                    </CCol>
                    <CCol md="6" class="position-relative">
                        <CFormLabel>Satuan</CFormLabel>
                        <CFormInput 
                            type="text" v-model="unitSearch" placeholder="Cari satuan..." 
                            @focus="showUnitList = true" @blur="closeListDelay('unit')" autocomplete="off"
                        />
                        <input type="hidden" v-model="form.unit_id">
                        <ul v-if="showUnitList" class="custom-dropdown-list list-group">
                            <li v-for="unit in filteredUnits" :key="unit.id" class="list-group-item list-group-item-action" @mousedown.prevent="selectUnit(unit)">
                                {{ unit.name }}
                            </li>
                        </ul>
                    </CCol>

                    <CCol md="12"><hr class="my-2"/></CCol>

                    <CCol md="6">
                        <CFormLabel>Harga Beli</CFormLabel>
                        <money3 v-model.number="form.price_buy" v-bind="moneyConfig" class="form-control"></money3>
                    </CCol>
                    <CCol md="6">
                        <CFormLabel>Harga Jual</CFormLabel>
                        <money3 v-model.number="form.price_sell" v-bind="moneyConfig" class="form-control"></money3>
                    </CCol>
                    
                    <CCol md="6">
                        <CFormLabel>Stok Awal</CFormLabel>
                        <CFormInput type="number" v-model="form.stock" />
                    </CCol>
                    <CCol md="6">
                        <CFormLabel class="text-danger">Min Stok Alert</CFormLabel>
                        <CFormInput type="number" v-model="form.min_stock" />
                    </CCol>

                    <CCol md="12"><hr class="my-2"/></CCol>
                    
                    <CCol md="6">
                        <CFormLabel>Harga Grosir</CFormLabel>
                        <money3 v-model.number="form.price_wholesale" v-bind="moneyConfig" class="form-control"></money3>
                    </CCol>
                    <CCol md="6">
                        <CFormLabel>Min Qty Grosir</CFormLabel>
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
        
        // LOGIC PENCARIAN PRODUK BARU
        searchKeyword: '', 

        // Data Form
        form: {
            id: null, code: '', name: '', category_id: null, unit_id: null,
            price_buy: 0, price_sell: 0, price_wholesale: 0, min_wholesale_qty: 0, 
            stock: 0, min_stock: 5
        },
        selectedFile: null,
        imagePreview: null,

        // Autocomplete Kategori/Satuan
        categorySearch: '', showCategoryList: false,
        unitSearch: '', showUnitList: false,
        
        moneyConfig: { prefix: 'Rp ', suffix: '', thousands: '.', decimal: ',', precision: 0, disableNegative: true }
        };
    },
    computed: {
        // --- COMPUTED PROPERTY BARU UNTUK FILTER PRODUK ---
        filteredProducts() {
            if (!this.searchKeyword) return this.products;
            
            const key = this.searchKeyword.toLowerCase();
            return this.products.filter(item => 
                item.name.toLowerCase().includes(key) || // Cari Nama
                item.code.toLowerCase().includes(key) || // Cari Kode Barcode
                (item.category_name && item.category_name.toLowerCase().includes(key)) // Cari Nama Kategori
            );
        },
        // --------------------------------------------------

        filteredCategories() {
            return this.categories.filter(c => c.name.toLowerCase().includes(this.categorySearch.toLowerCase()));
        },
        filteredUnits() {
            return this.units.filter(u => u.name.toLowerCase().includes(this.unitSearch.toLowerCase()));
        }
    },
    mounted() {
        this.fetchProducts();
        this.fetchDropdowns();
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
                const [cat, unit] = await Promise.all([axios.get('/categories'), axios.get('/units')]);
                this.categories = cat.data;
                this.units = unit.data; 
            } catch (error) { console.error(error); }
        },
        
        // Autocomplete Handlers
        selectCategory(item) {
            this.form.category_id = item.id; this.categorySearch = item.name; this.showCategoryList = false;
        },
        selectUnit(item) {
            this.form.unit_id = item.id; this.unitSearch = item.name; this.showUnitList = false;
        },
        closeListDelay(type) {
            setTimeout(() => {
                if(type === 'cat') this.showCategoryList = false;
                if(type === 'unit') this.showUnitList = false;
            }, 200);
        },

        // File Handler
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedFile = file;
                this.imagePreview = URL.createObjectURL(file);
            }
        },

        openModal() {
            this.isEdit = false;
            this.form = { 
                id: null, code: '', name: '', category_id: null, unit_id: null,
                price_buy: 0, price_sell: 0, price_wholesale: 0, min_wholesale_qty: 0, 
                stock: 0, min_stock: 5 
            };
            this.categorySearch = '';
            this.unitSearch = '';
            this.selectedFile = null;
            this.imagePreview = null;
            this.showModal = true;
        },

        editItem(item) {
            this.isEdit = true;
            this.form = { ...item };
            this.categorySearch = item.category_name || ''; 
            this.unitSearch = item.unit_name || '';
            this.selectedFile = null;
            
            if(item.image) {
                this.imagePreview = this.$fileURL + item.image;
            } else {
                this.imagePreview = null;
            }
            this.showModal = true;
        },

        async saveData() {
            if(!this.form.name || !this.form.category_id) return alert("Lengkapi data!");
            
            const formData = new FormData();
            Object.keys(this.form).forEach(key => {
                if (this.form[key] !== null) {
                    formData.append(key, this.form[key]);
                }
            });

            if (this.selectedFile) {
                formData.append('image', this.selectedFile);
            }

            try {
                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                if (this.isEdit) {
                    await axios.put(`/products/${this.form.id}`, formData, config);
                } else {
                    await axios.post('/products', formData, config);
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
    .custom-dropdown-list {
        position: absolute; top: 100%; left: 12px; right: 12px; z-index: 1055;
        max-height: 200px; overflow-y: auto; background: white; border: 1px solid #ddd;
    }
    .list-group-item { cursor: pointer; }
    .list-group-item:hover { background-color: #f0f3f5; }
</style>