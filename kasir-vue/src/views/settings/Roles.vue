<template>
  <div>
    <CCard class="mb-4">
        <CCardHeader class="d-flex justify-content-between">
            <strong>Manajemen Role (Hak Akses)</strong>
            <CButton size="sm" color="primary" @click="openModal">+ Tambah Role</CButton>
        </CCardHeader>
        <CCardBody>
            <CTable hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Nama Role</CTableHeaderCell>
                        <CTableHeaderCell>Aksi</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow v-for="role in roles" :key="role.id">
                        <CTableDataCell>{{ role.name }}</CTableDataCell>
                        <CTableDataCell>
                            <CButton size="sm" color="warning" class="me-1 text-white" @click="edit(role)">Edit</CButton>
                            <CButton size="sm" color="danger" class="text-white" @click="del(role.id)">Hapus</CButton>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        </CCardBody>
    </CCard>

    <CModal :visible="showModal" @close="showModal = false">
        <CModalHeader><CModalTitle>Form Role</CModalTitle></CModalHeader>
        <CModalBody>
            <div class="mb-3">
                <label>Nama Role</label>
                <CFormInput v-model="form.name" />
            </div>
            <div class="mb-3">
                <label class="fw-bold mb-2">Akses Menu:</label>
                <div v-for="menu in availableMenus" :key="menu.key" class="form-check">
                    <input class="form-check-input" type="checkbox" :value="menu.key" v-model="form.access_menu">
                    <label class="form-check-label">{{ menu.label }}</label>
                </div>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="save">Simpan</CButton>
        </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            roles: [],
            showModal: false,
            isEdit: false,
            form: { id: null, name: '', access_menu: [] },
            // DAFTAR MENU YANG TERSEDIA DI APLIKASI ANDA
            availableMenus: [
                { key: '*', label: 'Full Akses (Super Admin)' },
                { key: 'dashboard', label: 'Dashboard' },
                { key: 'master_data', label: 'Master Data (Produk, Kategori, dll)' },
                { key: 'categories', label: 'Categories' },
                { key: 'units', label: 'Units' },
                { key: 'products', label: 'Products' },
                { key: 'suppliers', label: 'Suppliers' },
                { key: 'customers', label: 'Customers' },
                { key: 'inventory', label: 'Inventory' },
                { key: 'stock_opname', label: 'Stock Opname' },
                { key: 'transactions', label: 'Transactions' },
                { key: 'pos', label: 'Transaksi Kasir' },
                { key: 'pos_history', label: 'Riwayat Transaksi' },
                { key: 'purchase', label: 'Purchase' },
                { key: 'purchase_history', label: 'Riwayat Pembelian' },
                { key: 'reports', label: 'Laporan' },
                { key: 'users', label: 'Manajemen User & Role' },
                { key: 'settings', label: 'Pengaturan Toko' }
            ]
        }
    },
    mounted() { this.fetch(); },
    methods: {
        async fetch() {
            const res = await axios.get('/roles');
            this.roles = res.data;
        },
        openModal() {
            this.isEdit = false;
            this.form = { id: null, name: '', access_menu: [] };
            this.showModal = true;
        },
        edit(role) {
            this.isEdit = true;
            this.form = { ...role }; // access_menu sudah berupa array dari backend
            this.showModal = true;
        },
        async save() {
            try {
                if(this.isEdit) await axios.put(`/roles/${this.form.id}`, this.form);
                else await axios.post('/roles', this.form);
                this.showModal = false;
                this.fetch();
                alert('Tersimpan');
            } catch(e) { alert('Gagal'); }
        },
        async del(id) {
            if(confirm('Hapus?')) {
                await axios.delete(`/roles/${id}`);
                this.fetch();
            }
        }
    }
}
</script>