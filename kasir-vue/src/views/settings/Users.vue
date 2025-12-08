<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Manajemen Pengguna (User)</strong>
            <CButton color="primary" size="sm" @click="openModal">
              <CIcon icon="cil-user-plus" class="me-2"/>
              Tambah User
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive bordered align="middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" width="50">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nama Lengkap</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email / Username</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Role (Jabatan)</CTableHeaderCell>
                  <CTableHeaderCell scope="col" width="150">Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(user, index) in users" :key="user.id">
                  <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                  <CTableDataCell>
                     <div class="d-flex align-items-center">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                            {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        {{ user.name }}
                     </div>
                  </CTableDataCell>
                  <CTableDataCell>{{ user.email }}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="getRoleColor(user.role_name)">{{ user.role_name }}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" size="sm" class="me-1 text-white" @click="editUser(user)">
                      <CIcon icon="cil-pencil" size="sm"/>
                    </CButton>
                    <CButton color="danger" size="sm" class="text-white" @click="deleteUser(user.id)">
                      <CIcon icon="cil-trash" size="sm"/>
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-if="users.length === 0">
                    <CTableDataCell colspan="5" class="text-center py-4 text-muted">Belum ada data user</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CModal :visible="showModal" @close="showModal = false" backdrop="static">
      <CModalHeader>
        <CModalTitle>{{ isEdit ? 'Edit User' : 'Tambah User Baru' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="mb-3">
            <CFormLabel>Nama Lengkap</CFormLabel>
            <CFormInput v-model="form.name" placeholder="Contoh: Budi Santoso" />
          </div>
          
          <div class="mb-3">
            <CFormLabel>Email (Untuk Login)</CFormLabel>
            <CFormInput type="email" v-model="form.email" placeholder="budi@toko.com" />
          </div>

          <div class="mb-3">
            <CFormLabel>Role / Jabatan</CFormLabel>
            <CFormSelect v-model="form.role_id">
                <option value="" disabled>Pilih Role...</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                    {{ role.name }}
                </option>
            </CFormSelect>
          </div>

          <hr class="my-3">

          <div class="mb-3">
            <CFormLabel>Password</CFormLabel>
            <CFormInput type="password" v-model="form.password" placeholder="******" />
            <CFormText v-if="isEdit" class="text-info">
                <small>* Kosongkan jika tidak ingin mengubah password user ini.</small>
            </CFormText>
            <CFormText v-else class="text-danger">
                <small>* Wajib diisi untuk user baru.</small>
            </CFormText>
          </div>

        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Batal</CButton>
        <CButton color="primary" @click="saveUser">
            {{ isEdit ? 'Simpan Perubahan' : 'Buat User' }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Users',
  data() {
    return {
      users: [],
      roles: [], // Data untuk dropdown
      showModal: false,
      isEdit: false,
      form: {
        id: null,
        name: '',
        email: '',
        role_id: '',
        password: ''
      }
    };
  },
  mounted() {
    this.fetchUsers();
    this.fetchRoles();
  },
  methods: {
    // Memberikan warna badge beda-beda tiap role
    getRoleColor(roleName) {
        if (!roleName) return 'secondary';
        const name = roleName.toLowerCase();
        if (name.includes('admin')) return 'danger'; // Merah untuk Admin
        if (name.includes('kasir')) return 'success'; // Hijau untuk Kasir
        return 'info'; // Biru untuk lainnya
    },

    // 1. Ambil Data User
    async fetchUsers() {
      try {
        const response = await axios.get('/users');
        this.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    // 2. Ambil Data Role (Untuk Dropdown)
    async fetchRoles() {
      try {
        const response = await axios.get('/roles');
        this.roles = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    openModal() {
      this.isEdit = false;
      this.form = { id: null, name: '', email: '', role_id: '', password: '' };
      this.showModal = true;
    },

    editUser(user) {
      this.isEdit = true;
      this.form = { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role_id: user.role_id, 
          password: '' // Password dikosongkan saat edit (keamanan)
      };
      this.showModal = true;
    },

    async saveUser() {
        // Validasi Sederhana
        if(!this.form.name || !this.form.email || !this.form.role_id) {
            return this.$swal.fire('Eror', 'Nama, Email, dan Role wajib diisi!', 'error');
        }
        // Jika mode Tambah Baru, Password wajib
        if(!this.isEdit && !this.form.password) {
            return this.$swal.fire('Eror', 'Password wajib diisi untuk user baru!', 'error');
        }

        try {
            if (this.isEdit) {
                // Update
                await axios.put(`/users/${this.form.id}`, this.form);
            } else {
                // Create
                await axios.post('/users', this.form);
            }

            this.showModal = false;
            this.fetchUsers(); // Refresh tabel

            this.$toast.fire({
                icon: 'success',
                title: 'Data User Berhasil Disimpan'
            });

        } catch (error) {
            console.error(error);
            this.$swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
        }
    },

    async deleteUser(id) {
        const result = await this.$swal.fire({
            title: 'Hapus User ini?',
            text: "Akses login user akan hilang permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/users/${id}`);
                this.fetchUsers();
                this.$swal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
            } catch (error) {
                this.$swal.fire('Gagal', 'Tidak bisa menghapus user ini.', 'error');
            }
        }
    }
  }
};
</script>