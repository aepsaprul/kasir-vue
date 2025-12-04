<template>
    <CRow>
        <CCol md="4">
        <CCard class="mb-4">
            <CCardHeader>Foto Profil</CCardHeader>
            <CCardBody class="text-center">
            <div class="mb-3">
                <CAvatar :src="avatarPreview" size="xl" style="width: 150px; height: 150px;" />
            </div>
            <div class="mb-3">
                <input type="file" ref="fileInput" @change="handleFileChange" class="form-control" accept="image/*">
            </div>
            <CButton color="primary" @click="uploadAvatar" :disabled="!selectedFile">
                Upload Avatar
            </CButton>
            </CCardBody>
        </CCard>
        </CCol>

        <CCol md="8">
        <CCard class="mb-4">
            <CCardHeader>Edit Profil</CCardHeader>
            <CCardBody>
            <CForm @submit.prevent="updateProfile">
                
                <h6 class="mb-3 text-muted">Informasi Dasar</h6>
                <div class="mb-3">
                <label class="form-label">Nama Lengkap</label>
                <CFormInput v-model="form.name" required />
                </div>
                <div class="mb-3">
                <label class="form-label">Email</label>
                <CFormInput v-model="form.email" type="email" required />
                </div>

                <hr class="my-4">

                <h6 class="mb-3 text-muted">Ganti Password (Opsional)</h6>
                <CAlert color="info" class="d-flex align-items-center">
                    <CIcon icon="cil-info" class="flex-shrink-0 me-2" width="24" height="24" />
                    <div>Kosongkan jika tidak ingin mengubah password.</div>
                </CAlert>

                <div class="mb-3">
                <label class="form-label">Password Lama</label>
                <CFormInput v-model="form.password" type="password" placeholder="Wajib diisi jika ingin ganti password baru" />
                </div>
                <div class="mb-3">
                <label class="form-label">Password Baru</label>
                <CFormInput v-model="form.new_password" type="password" />
                </div>
                <div class="mb-3">
                <label class="form-label">Konfirmasi Password Baru</label>
                <CFormInput v-model="form.confirm_password" type="password" />
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="success" type="submit" class="text-white px-4">Simpan Perubahan</CButton>
                </div>
            </CForm>
            </CCardBody>
        </CCard>
        </CCol>
    </CRow>
</template>

<script>
import axios from 'axios';
import defaultAvatar from '@/assets/images/avatars/8.png'; // Gambar default bawaan template

export default {
    name: 'Profile',
    data() {
        return {
        form: {
            name: '',
            email: '',
            password: '',
            new_password: '',
            confirm_password: ''
        },
        selectedFile: null,
        avatarPreview: defaultAvatar
        };
    },
    mounted() {
        // Ambil data user dari LocalStorage saat load
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
        this.form.name = user.name;
        this.form.email = user.email;
        
        // Jika user punya avatar custom di DB
        if (user.avatar) {
            this.avatarPreview = `http://localhost:5000/uploads/${user.avatar}`;
        }
        }
    },
    methods: {
        // 1. Logic Ganti Text (Nama/Pass)
        async updateProfile() {
            if (this.form.new_password && this.form.new_password !== this.form.confirm_password) {
                return alert("Konfirmasi password baru tidak cocok!");
            }
            if (this.form.new_password && !this.form.password) {
                return alert("Masukkan password lama untuk verifikasi!");
            }

            try {
                const response = await axios.put('/profile', this.form);
                
                // Update LocalStorage dengan nama/email baru
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = { ...currentUser, ...response.data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                alert('Profil berhasil diperbarui!');
                
                // Bersihkan field password
                this.form.password = '';
                this.form.new_password = '';
                this.form.confirm_password = '';
                
                // Reload halaman agar Header mengupdate nama (opsional)
                window.location.reload();

            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || 'Gagal update profil');
            }
        },

        // 2. Logic Upload File
        handleFileChange(event) {
            const file = event.target.files[0];
            if(file) {
                this.selectedFile = file;
                this.avatarPreview = URL.createObjectURL(file); // Preview lokal sebelum upload
            }
        },
        async uploadAvatar() {
            if(!this.selectedFile) return;

            const formData = new FormData();
            formData.append('avatar', this.selectedFile);

            try {
                const response = await axios.post('/profile/avatar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Update LocalStorage Avatar
                const user = JSON.parse(localStorage.getItem('user'));
                user.avatar = response.data.avatar_url;
                localStorage.setItem('user', JSON.stringify(user));

                alert('Foto profil berhasil diganti!');
                
                // Reload agar Header di pojok kanan atas berubah gambarnya
                window.location.reload();

            } catch (error) {
                console.error(error);
                alert('Gagal upload gambar');
            }
        }
    }
};
</script>