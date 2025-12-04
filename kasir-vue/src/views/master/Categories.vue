<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Data Kategori Produk</strong>
            <CButton color="primary" size="sm" @click="openModal">
              + Tambah Kategori
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nama Kategori</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(item, index) in categories" :key="item.id">
                  <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                  <CTableDataCell>{{ item.name }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" size="sm" class="me-2 text-white" @click="editItem(item)">
                      Edit
                    </CButton>
                    <CButton color="danger" size="sm" class="text-white" @click="deleteItem(item.id)">
                      Hapus
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-if="categories.length === 0">
                    <CTableDataCell colspan="3" class="text-center">Belum ada data</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CModal :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>{{ isEdit ? 'Edit Kategori' : 'Tambah Kategori' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="mb-3">
            <CFormLabel>Nama Kategori</CFormLabel>
            <CFormInput v-model="form.name" placeholder="Contoh: Makanan Ringan" />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Batal</CButton>
        <CButton color="primary" @click="saveData">Simpan</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Categories',
    data() {
        return {
        categories: [],
        showModal: false,
        isEdit: false,
        form: {
            id: null,
            name: ''
        }
        };
    },
    mounted() {
        this.fetchCategories();
    },
    methods: {
        // Ambil data dari Backend
        async fetchCategories() {
            try {
                const response = await axios.get('/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Gagal mengambil data');
            }
        },
        // Buka Modal Tambah
        openModal() {
            this.isEdit = false;
            this.form = { id: null, name: '' };
            this.showModal = true;
        },
        // Buka Modal Edit
        editItem(item) {
            this.isEdit = true;
            this.form = { id: item.id, name: item.name };
            this.showModal = true;
        },
        // Simpan Data (Create/Update)
        async saveData() {
            if(!this.form.name) return alert("Nama kategori harus diisi!");

            try {
                if (this.isEdit) {
                    // Update
                    await axios.put(`/categories/${this.form.id}`, { name: this.form.name });
                } else {
                    // Create
                    await axios.post('/categories', { name: this.form.name });
                }
                this.showModal = false;
                this.fetchCategories(); // Refresh tabel
            } catch (error) {
                console.error(error);
                alert('Gagal menyimpan data');
            }
        },
        // Hapus Data
        async deleteItem(id) {
            if(confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
                try {
                    await axios.delete(`/categories/${id}`);
                    this.fetchCategories();
                } catch (error) {
                    console.error(error);
                    alert('Gagal menghapus data');
                }
            }
        }
    }
};
</script>