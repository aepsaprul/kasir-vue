<template>
    <div>
        <CRow>
            <CCol :md="12">
                <CCard class="mb-4">
                    <CCardHeader class="d-flex justify-content-between align-items-center">
                        <strong>Data Unit</strong>
                        <CButton color="primary" @click="openModal"><CIcon icon="cil-plus" height="15" /> Tambah Unit</CButton>
                    </CCardHeader>
                </CCard>

                <!-- Jika tidak ada data -->
                <div v-if="units.length === 0" class="text-center text-muted py-4">
                    Belum ada data
                </div>

                <!-- List Card -->
                <div v-else class="d-flex flex-column gap-1">

                    <CCard v-for="(item, index) in units" :key="item.id" class="shadow-sm">
                        <CCardBody class="d-flex justify-content-between align-items-center">

                            <!-- Info Unit -->
                            <div>
                                <div class="fw-bold">{{ item.name }}</div>
                                <small class="text-muted">Unit #{{ index + 1 }}</small>
                                </div>

                                <!-- Tombol Aksi -->
                                <div class="d-flex gap-2">
                                <CButton color="warning" class="text-white" @click="editItem(item)">
                                    <CIcon icon="cil-pencil" />
                                </CButton>

                                <CButton color="danger" class="text-white" @click="deleteItem(item.id)">
                                    <CIcon icon="cil-trash" />
                                </CButton>
                            </div>

                        </CCardBody>
                    </CCard>
                </div>
            </CCol>
        </CRow>

        <CModal :visible="showModal" @close="showModal = false" alignment="center">
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
                <CButton color="secondary" @click="showModal = false"><CIcon icon="cil-x-circle" height="15"></CIcon> Batal</CButton>
                <CButton color="primary" @click="saveData"><CIcon icon="cil-save" height="15"></CIcon> Simpan</CButton>
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
                // console.error('Error fetching data:', error);
                this.$swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal mengambil data.',
                    timer: 1500,
                    showConfirmButton: false
                });
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
            if(!this.form.name) return this.$swal.fire({icon: 'error',title: 'Gagal!',text: 'Data unit harus diisi!.',timer: 1500,showConfirmButton: false});

            try {
                if (this.isEdit) {
                    // Update
                    await axios.put(`/units/${this.form.id}`, { name: this.form.name });
                } else {
                    // Create
                    await axios.post('/units', { name: this.form.name });
                }
                this.showModal = false;
                this.fetchUnits();

                this.$swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Unit telah disimpan.',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                // console.error(error);
                this.$swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal menyimpan data.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        },
        
        // Hapus Data
        async deleteItem(id) {
            this.$swal.fire({
                title: 'Anda yakin?',
                text: 'Unit akan dihapus secara permanen!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`/units/${id}`);
                        this.fetchUnits();

                        this.$swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Unit telah dihapus.',
                            timer: 1500,
                            showConfirmButton: false
                        });

                    } catch (error) {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Unit Tidak Bisa Dihapus!',
                            html: `
                                <p>Karena Data digunakan dihalaman lain.</p>
                            `
                        });
                    }
                }
            });
        }
    }
};
</script>