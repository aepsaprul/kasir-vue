<template>
  <div class="login-page">
    <!-- Background dengan efek gradient -->
    <div class="login-background">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
      <div class="bg-shape bg-shape-4"></div>
    </div>

    <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div class="row justify-content-center w-100">
        <div class="col-xxl-8 col-xl-9 col-lg-10">
          <div class="login-card shadow-lg">
            <div class="row g-0">
              <!-- Kolom Kiri - Form Login -->
              <div class="col-lg-7 col-md-6">
                <div class="login-form-section p-4 p-md-5 h-100 d-flex flex-column">
                  <!-- Header Form -->
                  <div class="text-center mb-4">
                    <div class="login-logo mb-3">
                      <div v-if="settings.logo" class="store-logo mb-3">
                        <img 
                          :src="`http://localhost:5000/uploads/${settings.logo}`" 
                          alt="Store Logo" 
                          class="img-fluid"
                          style="max-height: 50px;"
                        />
                      </div>
                      <h1 class="login-title">{{ settings.store_name || 'Aplikasi Kasir' }}</h1>
                      <p class="login-subtitle text-muted">Masuk ke akun Anda</p>
                    </div>
                  </div>

                  <!-- Form Login -->
                  <CForm @submit.prevent="handleLogin" class="flex-grow-1 d-flex flex-column">
                    <!-- Alert Error -->
                    <CAlert 
                      color="danger" 
                      v-if="errorMessage" 
                      class="alert-custom animate__animated animate__fadeIn"
                    >
                      <div class="d-flex align-items-center">
                        <CIcon icon="cil-warning" class="me-2" />
                        <span>{{ errorMessage }}</span>
                      </div>
                    </CAlert>

                    <!-- Email Input -->
                    <div class="form-group mb-4">
                      <label for="email" class="form-label">Email</label>
                      <CInputGroup class="input-group-custom">
                        <CInputGroupText class="input-group-prepend">
                          <CIcon icon="cil-user" />
                        </CInputGroupText>
                        <CFormInput
                          id="email"
                          placeholder="nama@email.com"
                          autocomplete="email"
                          v-model="email"
                          required
                          class="form-control-custom"
                        />
                      </CInputGroup>
                      <div class="form-text">Masukkan email yang terdaftar</div>
                    </div>

                    <!-- Password Input -->
                    <div class="form-group mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <label for="password" class="form-label">Password</label>
                        <a href="#" class="text-decoration-none small forgot-password-link">Lupa password?</a>
                      </div>
                      <CInputGroup class="input-group-custom">
                        <CInputGroupText class="input-group-prepend">
                          <CIcon icon="cil-lock-locked" />
                        </CInputGroupText>
                        <CFormInput
                          id="password"
                          :type="showPassword ? 'text' : 'password'"
                          placeholder="Masukkan password"
                          autocomplete="current-password"
                          v-model="password"
                          required
                          class="form-control-custom"
                        />
                        <CInputGroupText 
                          class="input-group-append password-toggle"
                          @click="showPassword = !showPassword"
                          style="cursor: pointer;"
                        >
                          <CIcon :icon="showPassword ? 'cil-eye' : 'cil-eye-slash'" />
                        </CInputGroupText>
                      </CInputGroup>
                    </div>

                    <!-- Remember Me Checkbox -->
                    <div class="form-group mb-4">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          v-model="rememberMe"
                        />
                        <label class="form-check-label" for="rememberMe">
                          Ingat saya
                        </label>
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-auto">
                      <CButton 
                        type="submit" 
                        color="primary" 
                        class="login-btn w-100 py-3"
                        :disabled="isLoading"
                      >
                        <span v-if="isLoading">
                          <CSpinner component="span" size="sm" aria-hidden="true" class="me-2" />
                          Memproses...
                        </span>
                        <span v-else>
                          <CIcon icon="cil-arrow-right" class="me-2" />
                          Masuk
                        </span>
                      </CButton>

                      <!-- Divider -->
                      <div class="divider my-4">
                        <span class="divider-text">atau masuk dengan</span>
                      </div>

                      <!-- Social Login Options (Optional) -->
                      <div class="social-login text-center">
                        <CButton color="outline-secondary" class="social-btn me-2" @click.prevent>
                          <CIcon icon="cib-google" class="me-2" />
                          Google
                        </CButton>
                        <CButton color="outline-secondary" class="social-btn" @click.prevent>
                          <CIcon icon="cib-facebook" class="me-2" />
                          Facebook
                        </CButton>
                      </div>

                      <!-- Register Link -->
                      <div class="text-center mt-4">
                        <span class="text-muted">Belum punya akun?</span>
                        <a href="#" class="text-decoration-none register-link ms-1">Daftar disini</a>
                      </div>
                    </div>
                  </CForm>
                </div>
              </div>

              <!-- Kolom Kanan - Informasi Toko -->
              <div class="col-lg-5 col-md-6 d-none d-md-block">
                <div class="store-info-section h-100 d-flex flex-column justify-content-center p-4 p-md-5 text-white">
                  <!-- Overlay gelap untuk kontras teks -->
                  <div class="store-info-overlay"></div>
                  
                  <div class="store-info-content position-relative z-2">
                    <h2 class="store-name mb-4">{{ settings.store_name || 'Aplikasi Kasir' }}</h2>
                    
                    <div class="store-details mb-4">
                      <div class="store-description">
                        <p>{{ settings.address || 'Selamat datang di aplikasi kasir kami' }}</p>
                      </div>

                      <div class="store-contact">
                        <div v-if="settings.phone" class="contact-item d-flex align-items-center mb-3">
                          <div class="contact-icon me-3">
                            <CIcon icon="cil-phone" />
                          </div>
                          <div class="contact-info">
                            <div class="contact-label">Telepon</div>
                            <div class="contact-value">{{ settings.phone }}</div>
                          </div>
                        </div>
                        
                        <div v-if="settings.email" class="contact-item d-flex align-items-center">
                          <div class="contact-icon me-3">
                            <CIcon icon="cil-envelope-open" />
                          </div>
                          <div class="contact-info">
                            <div class="contact-label">Email</div>
                            <div class="contact-value">{{ settings.email }}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Features List -->
                    <div class="store-features mt-4">
                      <h5 class="mb-3">Fitur Utama</h5>
                      <ul class="feature-list list-unstyled">
                        <li class="feature-item mb-2">
                          <CIcon icon="cil-check" class="me-2" /> Manajemen Produk
                        </li>
                        <li class="feature-item mb-2">
                          <CIcon icon="cil-check" class="me-2" /> Laporan Penjualan
                        </li>
                        <li class="feature-item">
                          <CIcon icon="cil-check" class="me-2" /> Transaksi Real-time
                        </li>
                      </ul>
                    </div>

                    <!-- Footer Store Info -->
                    <div class="store-footer mt-5 pt-4 border-top border-white-50">
                      <p class="small opacity-75">
                        © {{ new Date().getFullYear() }} {{ settings.store_name || 'Aplikasi Kasir' }}. All rights reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Store Info (Tampil hanya di mobile) -->
    <div class="mobile-store-info d-block d-md-none mt-4 text-center">
      <div class="container">
        <div class="card store-info-card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ settings.store_name || 'Aplikasi Kasir' }}</h5>
            <p class="card-text small">{{ settings.address }}</p>
            <div class="store-contact-mobile">
              <div v-if="settings.phone" class="mb-2">
                <CIcon icon="cil-phone" /> {{ settings.phone }}
              </div>
              <div v-if="settings.email">
                <CIcon icon="cil-envelope-closed" /> {{ settings.email }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      showPassword: false,
      rememberMe: false,
      errorMessage: '',
      isLoading: false,
      settings: { 
        store_name: '', 
        address: '', 
        logo: '', 
        phone: '', 
        email: '' 
      }
    }
  },
  mounted() {
    this.fetchSettings();
  },
  methods: {
    async fetchSettings() {
      try {
        const response = await axios.get('http://localhost:5000/api/settings');
        this.settings = response.data;
      } catch (e) {
        console.error('Gagal load setting', e);
      }
    },
    async handleLogin() {
      this.errorMessage = '';
      this.isLoading = true;
      
      try {
        // Panggil API Backend
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: this.email,
          password: this.password
        })

        // Jika sukses
        if (response.data.token) {
          // Simpan data login
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          // Jika remember me dicentang, simpan juga
          if (this.rememberMe) {
            localStorage.setItem('rememberedEmail', this.email)
          }

          // Tampilkan pesan sukses sebelum redirect
          this.$toast.success('Login berhasil! Mengalihkan...', {
            position: 'top-right',
            duration: 2000
          });
          
          // Redirect ke Dashboard setelah delay kecil
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 1500)
        }
      } catch (error) {
        // Tangani error
        if (error.response) {
          this.errorMessage = error.response.data.message || 'Email atau password salah'
        } else if (error.request) {
          this.errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
        } else {
          this.errorMessage = 'Terjadi kesalahan. Silakan coba lagi.'
        }
        
        // Animasi shake untuk form pada error
        const form = document.querySelector('.login-form-section');
        form.classList.add('animate__animated', 'animate__headShake');
        setTimeout(() => {
          form.classList.remove('animate__animated', 'animate__headShake');
        }, 1000);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.bg-shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.bg-shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -50px;
  background: rgba(41, 128, 185, 0.1);
}

.bg-shape-3 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  left: 30%;
  background: rgba(155, 89, 182, 0.1);
}

.bg-shape-4 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 20%;
  background: rgba(39, 174, 96, 0.1);
}

.login-card {
  border-radius: 20px;
  overflow: hidden;
  background-color: #ffffff;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.login-form-section {
  background-color: #ffffff;
}

.login-logo {
  margin-bottom: 2rem;
}

.login-title {
  color: #2c3e50;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 1rem;
  color: #7f8c8d;
}

.store-logo img {
  transition: transform 0.3s ease;
}

.store-logo img:hover {
  transform: scale(1.05);
}

.input-group-custom {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dfe6e9;
  transition: all 0.3s ease;
}

.input-group-custom:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
}

.input-group-prepend, .input-group-append {
  background-color: #f8f9fa;
  border: none;
  padding: 0.75rem 1rem;
}

.form-control-custom {
  border: none;
  padding: 0.75rem 1rem;
}

.form-control-custom:focus {
  box-shadow: none;
  background-color: #fff;
}

.password-toggle:hover {
  background-color: #e9ecef;
}

.login-btn {
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border: none;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.forgot-password-link {
  color: #3498db;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password-link:hover {
  color: #2980b9;
  text-decoration: underline !important;
}

.register-link {
  color: #2ecc71;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #27ae60;
  text-decoration: underline !important;
}

/* Store Info Section */
.store-info-section {
  background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
  position: relative;
  overflow: hidden;
}

.store-info-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.store-info-content {
  z-index: 2;
}

.store-name {
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.store-details p {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.contact-item {
  margin-bottom: 1rem;
}

.contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.contact-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.contact-value {
  font-weight: 500;
  font-size: 1rem;
}

.feature-list li {
  padding: 0.3rem 0;
}

.feature-item {
  opacity: 0.9;
}

.store-footer {
  font-size: 0.9rem;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dfe6e9;
}

.divider-text {
  padding: 0 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Social Login */
.social-btn {
  border-radius: 10px;
  padding: 0.5rem 1.5rem;
  border: 1px solid #dfe6e9;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

/* Alert Custom */
.alert-custom {
  border-radius: 10px;
  border: none;
  animation-duration: 0.5s;
}

/* Mobile Store Info */
.mobile-store-info {
  animation: fadeInUp 0.8s ease;
}

.store-info-card {
  border-radius: 15px;
  background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
  color: white;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .login-form-section {
    padding: 2rem !important;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
  
  .login-btn {
    padding: 0.75rem !important;
  }
  
  .social-login {
    flex-direction: column;
  }
  
  .social-btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-subtitle {
    font-size: 0.9rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .login-form-section {
    padding: 3rem 4rem !important;
  }
  
  .store-info-section {
    padding: 3rem 4rem !important;
  }
}
</style>