<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Masuk ke akun Anda</p>
                  
                  <CAlert color="danger" v-if="errorMessage">{{ errorMessage }}</CAlert>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput 
                      placeholder="Email" 
                      autocomplete="email" 
                      v-model="email" 
                      required
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                      required
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton type="submit" color="primary" class="px-4"> Login </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center d-flex align-items-center justify-content-center flex-column">
                
                <div v-if="settings.logo" class="mb-4 bg-white p-2 rounded">
                    <img :src="`http://localhost:5000/uploads/${settings.logo}`" style="max-height: 80px;" />
                </div>

                <h2>{{ settings.store_name || 'Aplikasi Kasir' }}</h2>
                <p class="mt-3">
                  {{ settings.address }}
                </p>
                
                <div v-if="settings.phone" class="mt-2">
                    <CIcon icon="cil-phone" /> {{ settings.phone }}
                </div>
                <div v-if="settings.email">
                    <CIcon icon="cil-envelope-closed" /> {{ settings.email }}
                </div>

              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      settings: { store_name: '', address: '', logo: '', phone: '', email: '' }
    }
  },
  mounted() {
      this.fetchSettings();
  },
  methods: {
    async fetchSettings() {
        // Ambil data setting secara publik (tanpa token)
        try {
            // Note: Pastikan di axios global login page tidak mengirim token yang salah/kadaluarsa
            // Atau gunakan axios instance baru. Tapi biasanya endpoint GET /settings kita buat public.
            const response = await axios.get('http://localhost:5000/api/settings');
            this.settings = response.data;
        } catch (e) {
            console.error('Gagal load setting', e);
        }
    },
    async handleLogin() {
      try {
        this.errorMessage = '' // Reset error
        
        // Panggil API Backend
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: this.email,
          password: this.password
        })

        // Jika sukses
        if (response.data.token) {
          // 1. Simpan token & user info ke LocalStorage
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))

          // 2. Redirect ke Dashboard
          this.$router.push('/dashboard')
        }
      } catch (error) {
        // Tangani error jika password salah atau server mati
        if (error.response) {
            this.errorMessage = error.response.data.message
        } else {
            this.errorMessage = 'Gagal terhubung ke server backend'
        }
      }
    }
  }
}
</script>