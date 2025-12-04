<template>
    <div>
        <CRow>
            <CCol :md="12">
                <CCard class="mb-4">
                <CCardHeader class="d-flex justify-content-between align-items-center">
                    <strong>Data Unit</strong>
                    <CButton color="primary" size="sm" @click="openModal">
                    + Tambah Unit
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    <CTable hover responsive>
                        <CTableHead>
                            <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Nama Unit</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="(item, index) in units" :key="item.id">
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
                            <CTableRow v-if="units.length === 0">
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
                <CModalTitle>{{ isEdit ? 'Edit Unit' : 'Tambah Unit' }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm>
                <div class="mb-3">
                    <CFormLabel>Nama Unit</CFormLabel>
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
    name: 'Units',
    data() {
        return {
        units: [],
        showModal: false,
        isEdit: false,
        form: {
            id: null,
            name: ''
        }
        };
    },
    mounted() {
        this.fetchUnits();
    },
    methods: {
        // Ambil data dari Backend
        async fetchUnits() {
            try {
                const response = await axios.get('/units');
                this.units = response.data;
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
            if(!this.form.name) return alert("Nama unit harus diisi!");

            try {
                if (this.isEdit) {
                    // Update
                    await axios.put(`/units/${this.form.id}`, { name: this.form.name });
                } else {
                    // Create
                    await axios.post('/units', { name: this.form.name });
                }
                this.showModal = false;
                this.fetchUnits(); // Refresh tabel
            } catch (error) {
                console.error(error);
                alert('Gagal menyimpan data');
            }
        },
        // Hapus Data
        async deleteItem(id) {
            if(confirm('Apakah Anda yakin ingin menghapus unit ini?')) {
                try {
                    await axios.delete(`/units/${id}`);
                    this.fetchUnits();
                } catch (error) {
                    console.error(error);
                    alert('Gagal menghapus data');
                }
            }
        }
    }
};
</script>