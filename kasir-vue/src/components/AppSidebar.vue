<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

import { logo } from '@/assets/brand/logo'
import { sygnet } from '@/assets/brand/sygnet'
import { AppSidebarNav } from '@/components/AppSidebarNav.js'
import { useSidebarStore } from '@/stores/sidebar.js'

const sidebar = useSidebarStore()

const logoUrl = ref(null)
const storeName = ref('APLIKASI KASIR')

onMounted(async () => {
  // 1. Cek LocalStorage dulu (Supaya loading instan/cepat)
  const cached = localStorage.getItem('app_settings')
  if (cached) {
    const settings = JSON.parse(cached)
    if (settings.store_name) storeName.value = settings.store_name
    if (settings.logo) {
      logoUrl.value = `http://localhost:5000/uploads/${settings.logo}`
    }
  }

  // 2. Fetch data terbaru dari API (Untuk memastikan jika ada update baru)
  try {
    const response = await axios.get('/settings') // Pastikan endpoint ini PUBLIC atau token terkirim
    
    if (response.data.store_name) storeName.value = response.data.store_name
    
    if (response.data.logo) {
      logoUrl.value = `http://localhost:5000/uploads/${response.data.logo}`
      // Update cache
      localStorage.setItem('app_settings', JSON.stringify(response.data))
    }
  } catch (error) {
    console.error('Gagal memuat logo sidebar', error)
  }
})
</script>

<template>
  <CSidebar
    class="border-end"
    colorScheme="dark"
    position="fixed"
    :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible"
    @visible-change="(value) => sidebar.toggleVisible(value)"
  >
    <CSidebarHeader class="border-bottom">
      <RouterLink custom to="/" v-slot="{ href, navigate }">
        <CSidebarBrand v-bind="$attrs" as="a" href="#" class="text-decoration-none">
        
        <div v-if="logoUrl" class="d-flex align-items-center justify-content-center py-2">
            <img 
              :src="logoUrl" 
              alt="Logo" 
              style="max-height: 40px; max-width: 100%; object-fit: contain;" 
              class="sidebar-brand-full" 
            />
            <img 
              :src="logoUrl" 
              alt="Logo" 
              style="max-height: 32px; object-fit: contain;" 
              class="sidebar-brand-narrow" 
            />
            <span class="ms-3 fw-bold" style="font-size: 20px;">{{ storeName }}</span>
        </div>

        <div v-else class="sidebar-brand-full fw-bold text-uppercase px-3 text-white">
            {{ storeName }}
        </div>
        
        <CIcon v-if="!logoUrl" custom-class-name="sidebar-brand-narrow" :icon="sygnet" :height="32" />
        
      </CSidebarBrand>
      </RouterLink>
      <CCloseButton class="d-lg-none" dark @click="sidebar.toggleVisible()" />
    </CSidebarHeader>
    <AppSidebarNav />
  </CSidebar>
</template>
