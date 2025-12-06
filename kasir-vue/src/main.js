import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { Money3Component } from 'v-money3';

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => response, // Jika sukses, loloskan saja
    error => {
        // Jika errornya adalah 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            console.warn('Sesi habis, logout otomatis...');
            
            // Hapus data sesi
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Paksa pindah ke halaman login
            // Kita pakai window.location agar state aplikasi bersih total
            window.location.href = '/#/pages/login'; 
        }
        return Promise.reject(error);
    }
);


const fileBaseUrl = import.meta.env.VITE_FILE_URL || process.env.VUE_APP_FILE_URL || 'http://localhost:5000/uploads/';
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('money3', Money3Component);
app.config.globalProperties.$swal = Swal;
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});
app.config.globalProperties.$toast = Toast;
app.config.globalProperties.$fileURL = fileBaseUrl;

app.mount('#app')
