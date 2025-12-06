<template>
    <div>
        <CRow>
            <CCol :md="12">
                <CCard class="mb-4">
                    <CCardHeader class="d-flex justify-content-between align-items-center">
                        <strong>Data Pelanggan</strong>
                        <CButton color="primary" size="sm" @click="openModal"><CIcon icon="cil-plus" size="15"></CIcon> Tambah Pelanggan</CButton>
                    </CCardHeader>
                </CCard>

                <!-- Jika data kosong -->
                <div v-if="items.length === 0" class="text-center text-muted py-4">
                    Belum ada data
                </div>

                <!-- List Pelanggan -->
                <div v-else class="d-flex flex-column gap-1">
                    <CCard v-for="item in items" :key="item.id" class="shadow-sm">
                        <CCardBody>

                            <!-- Nama Pelanggan -->
                            <div class="fw-bold fs-5 mb-1">{{ item.name }}</div>
                            <!-- No Telepon -->
                            <div class="text-muted small mb-1"><CIcon icon="cil-phone" size="15"></CIcon> {{ item.phone || '-' }}</div>
                            <!-- Alamat -->
                            <div class="text-muted small mb-3"><CIcon icon="cil-location-pin" size="15"></CIcon> {{ item.address || '-' }}</div>

                            <!-- Tombol Aksi -->
                            <div class="d-flex justify-content-end gap-2">
                                <CButton color="warning" size="sm" class="text-white" @click="editItem(item)"><CIcon icon="cil-pencil" size="15"></CIcon> </CButton>
                                <CButton color="danger" size="sm" class="text-white" @click="deleteItem(item.id)"><CIcon icon="cil-trash" size="15"></CIcon> </CButton>
                            </div>

                        </CCardBody>
                    </CCard>
                </div>
            </CCol>
        </CRow>

        <CModal :visible="showModal" @close="showModal = false" alignment="center">
            <CModalHeader>
                <CModalTitle>{{ isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan' }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <div class="mb-3">
                        <CFormLabel>Nama Pelanggan</CFormLabel>
                        <CFormInput v-model="form.name" placeholder="Nama Pelanggan" />
                    </div>
                    <div class="mb-3">
                        <CFormLabel>No. Telepon</CFormLabel>
                        <CFormInput v-model="form.phone" placeholder="08..." />
                    </div>
                    <div class="mb-3">
                        <CFormLabel>Alamat</CFormLabel>
                        <CFormTextarea v-model="form.address" rows="3"></CFormTextarea>
                    </div>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" @click="showModal = false"><CIcon icon="cil-x-circle" size="15"></CIcon> Batal</CButton>
                <CButton color="primary" @click="saveData"><CIcon icon="cil-save" size="15"></CIcon> Simpan</CButton>
            </CModalFooter>
        </CModal>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Customers',
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
                const response = await axios.get('/customers');
                this.items = response.data;
            } catch (error) {
                // console.error(error);
                this.$swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal mengambil data.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
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
            if(!this.form.name) return this.$swal.fire({icon: 'error',title: 'Gagal!',text: 'Data pelanggan harus diisi!.',timer: 1500,showConfirmButton: false});
            try {
                if (this.isEdit) await axios.put(`/customers/${this.form.id}`, this.form);
                else await axios.post('/customers', this.form);
                this.showModal = false;
                this.fetchData();

                this.$swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Pelanggan telah disimpan.',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) { 
                this.$swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal menyimpan data.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        },

        async deleteItem(id) {
            const result = await this.$swal.fire({
                title: 'Apakah Anda yakin?',
                text: "Data yang dihapus tidak bisa dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            });

            // Jika user klik tombol "Ya, Hapus"
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/customers/${id}`);
                    this.fetchData();
                    
                    this.$swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Pelanggan telah dihapus.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) { 
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Pelanggan Tidak Bisa Dihapus!',
                        html: `
                            <p>Karena Data digunakan dihalaman lain.</p>
                        `
                    });
                }
            }
        }
    }
};
</script>