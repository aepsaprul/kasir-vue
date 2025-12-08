<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

import { logo } from '@/assets/brand/logo'
import { sygnet } from '@/assets/brand/sygnet'
import { AppSidebarNav } from '@/components/AppSidebarNav.js'
import { useSidebarStore } from '@/stores/sidebar.js'
import nav from '@/_nav'

const fileURL = import.meta.env.VITE_FILE_URL || process.env.VUE_APP_FILE_URL || 'http://localhost:5000/uploads/';

const sidebar = useSidebarStore()
const filteredNav = ref([]) 

// Variabel Logo Dinamis
const logoUrl = ref(null)
const storeName = ref('APLIKASI KASIR')

onMounted(async () => {
    // --- 1. LOGIKA LOGO DINAMIS ---
    const cachedSettings = localStorage.getItem('app_settings')
    if (cachedSettings) {
        const settings = JSON.parse(cachedSettings)
        if (settings.logo) logoUrl.value = fileURL + settings.logo;
        if (settings.store_name) storeName.value = settings.store_name
    }
    // Fetch fresh settings (silent)
    try {
        const res = await axios.get('/settings')
        if (res.data.logo) logoUrl.value = fileURL + res.data.logo;
    } catch(e) {}

    // --- 2. LOGIKA FILTER MENU ---
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
        // console.log("User tidak ditemukan di localStorage");
        filteredNav.value = [];
        return;
    }
    
    const user = JSON.parse(userStr);
    const allowed = user.menus || []; 
    
    // console.log("User Login:", user.name);
    // console.log("Menu yang Diizinkan:", allowed);

    // Jika Super Admin
    if (allowed.includes('*')) {
        // console.log("User adalah Super Admin, tampilkan semua.");
        filteredNav.value = nav;
        return;
    }

    const filterItem = (items) => {
        return items.filter(item => {
            let isAllowed = true;
            
            // Cek Permission Key
            if (item.permissionKey) {
                isAllowed = allowed.includes(item.permissionKey);
                // DEBUG LOG
                // console.log(`Menu: ${item.name} | Key: ${item.permissionKey} | Boleh? ${isAllowed}`);
            } else {
                // DEBUG LOG
                // console.log(`Menu: ${item.name} | Key: TIDAK ADA (Default True)`);
            }

            // Cek Anak Menu (Group)
            if (isAllowed && item.items) {
                const filteredChildren = filterItem(item.items);
                item.items = filteredChildren;
                
                // Jika group jadi kosong, sembunyikan
                if (filteredChildren.length === 0) {
                    // console.log(`Group ${item.name} disembunyikan karena anak kosong.`);
                    return false;
                }
            }

            return isAllowed;
        });
    };

    const navCopy = JSON.parse(JSON.stringify(nav));
    filteredNav.value = filterItem(navCopy);
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
    <AppSidebarNav :nav="filteredNav" />
  </CSidebar>
</template>
