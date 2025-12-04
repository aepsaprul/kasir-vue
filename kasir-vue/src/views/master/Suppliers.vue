<template>
    <div>
        <CRow>
        <CCol :md="12">
            <CCard class="mb-4">
            <CCardHeader class="d-flex justify-content-between align-items-center">
                <strong>Data Supplier</strong>
                <CButton color="primary" size="sm" @click="openModal">
                + Tambah Supplier
                </CButton>
            </CCardHeader>
            <CCardBody>
                <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                    <CTableHeaderCell>Nama Supplier</CTableHeaderCell>
                    <CTableHeaderCell>No. Telepon</CTableHeaderCell>
                    <CTableHeaderCell>Alamat</CTableHeaderCell>
                    <CTableHeaderCell>Aksi</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow v-for="item in items" :key="item.id">
                    <CTableDataCell>{{ item.name }}</CTableDataCell>
                    <CTableDataCell>{{ item.phone }}</CTableDataCell>
                    <CTableDataCell>{{ item.address }}</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="warning" size="sm" class="me-1 text-white" @click="editItem(item)">Edit</CButton>
                        <CButton color="danger" size="sm" class="text-white" @click="deleteItem(item.id)">Hapus</CButton>
                    </CTableDataCell>
                    </CTableRow>
                </CTableBody>
                </CTable>
            </CCardBody>
            </CCard>
        </CCol>
        </CRow>

        <CModal :visible="showModal" @close="showModal = false">
        <CModalHeader>
            <CModalTitle>{{ isEdit ? 'Edit Supplier' : 'Tambah Supplier' }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CForm>
            <div class="mb-3">
                <CFormLabel>Nama Supplier</CFormLabel>
                <CFormInput v-model="form.name" placeholder="PT. Maju Mundur" />
            </div>
            <div class="mb-3">
                <CFormLabel>No. Telepon</CFormLabel>
                <CFormInput v-model="form.phone" placeholder="0812..." />
            </div>
            <div class="mb-3">
                <CFormLabel>Alamat</CFormLabel>
                <CFormTextarea v-model="form.address" rows="3"></CFormTextarea>
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
    name: 'Suppliers',
    data() {
        return {
        items: [],
        showModal: false,
        isEdit: false,
        form: { id: null, name: '', phone: '', address: '' }
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
        try {
            const response = await axios.get('/suppliers');
            this.items = response.data;
        } catch (error) { console.error(error); }
        },
        openModal() {
        this.isEdit = false;
        this.form = { id: null, name: '', phone: '', address: '' };
        this.showModal = true;
        },
        editItem(item) {
        this.isEdit = true;
        this.form = { ...item };
        this.showModal = true;
        },
        async saveData() {
            if(!this.form.name) return alert("Nama wajib diisi");
            try {
                if (this.isEdit) await axios.put(`/suppliers/${this.form.id}`, this.form);
                else await axios.post('/suppliers', this.form);
                this.showModal = false;
                this.fetchData();
            } catch (error) { alert('Gagal menyimpan'); }
        },
        async deleteItem(id) {
            if(confirm('Hapus data ini?')) {
                try {
                    await axios.delete(`/suppliers/${id}`);
                    this.fetchData();
                } catch (error) { alert('Gagal hapus'); }
            }
        }
    }
};
</script>