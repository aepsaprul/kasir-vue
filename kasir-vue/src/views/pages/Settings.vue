<template>
  <CRow>
    <CCol md="12">
      <CCard class="mb-4">
        <CCardHeader>Pengaturan Toko</CCardHeader>
        <CCardBody>
          <CForm @submit.prevent="saveSettings">
            <CRow>
                <CCol md="8">
                    <div class="mb-3">
                        <label class="form-label">Nama Toko</label>
                        <CFormInput v-model="form.store_name" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <CFormInput v-model="form.email" type="email" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nomor Telepon</label>
                        <CFormInput v-model="form.phone" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Alamat Lengkap</label>
                        <CFormTextarea v-model="form.address" rows="3"></CFormTextarea>
                    </div>
                </CCol>

                <CCol md="4" class="text-center">
                    <label class="form-label fw-bold">Logo Toko</label>
                    <div class="mb-3 border p-3 rounded bg-light">
                        <img v-if="previewLogo" :src="previewLogo" class="img-fluid" style="max-height: 150px;" />
                        <div v-else class="text-muted p-4">Belum ada logo</div>
                    </div>
                    <input type="file" @change="handleFile" class="form-control" accept="image/*">
                    <div class="form-text">Format: PNG, JPG (Max 2MB)</div>
                </CCol>
            </CRow>

            <hr>
            <div class="d-flex justify-content-end">
                <CButton color="primary" type="submit" :disabled="loading">
                    {{ loading ? 'Menyimpan...' : 'Simpan Pengaturan' }}
                </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Settings',
  data() {
    return {
      form: { store_name: '', email: '', phone: '', address: '' },
      selectedFile: null,
      previewLogo: null,
      loading: false
    };
  },
  mounted() {
    this.fetchSettings();
  },
  methods: {
    async fetchSettings() {
        try {
            const res = await axios.get('/settings');
            this.form = res.data;
            if(res.data.logo) {
                this.previewLogo = `http://localhost:5000/uploads/${res.data.logo}`;
                // Simpan juga ke localStorage agar komponen lain (sidebar/login) bisa baca cepat
                localStorage.setItem('app_settings', JSON.stringify(res.data));
            }
        } catch (e) { console.error(e); }
    },
    handleFile(e) {
        const file = e.target.files[0];
        if(file) {
            this.selectedFile = file;
            this.previewLogo = URL.createObjectURL(file);
        }
    },
    async saveSettings() {
        this.loading = true;
        const formData = new FormData();
        formData.append('store_name', this.form.store_name);
        formData.append('email', this.form.email);
        formData.append('phone', this.form.phone);
        formData.append('address', this.form.address);
        if (this.selectedFile) formData.append('logo', this.selectedFile);

        try {
            await axios.put('/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Pengaturan Tersimpan!');
            // Refresh data dan reload halaman agar Sidebar Logo terupdate
            await this.fetchSettings();
            window.location.reload(); 
        } catch (e) {
            alert('Gagal menyimpan');
        } finally {
            this.loading = false;
        }
    }
  }
};
</script>