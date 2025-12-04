<script>
// Import gambar default sebagai fallback
import defaultAvatar from '@/assets/images/avatars/8.png'

export default {
  name: 'AppHeaderDropdownAccnt',
  data() {
    return {
      dynamicAvatar: defaultAvatar
    }
  },
  mounted() {
    // Cek LocalStorage saat komponen dimuat
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.avatar) {
      // Jika ada avatar di database, gunakan URL backend
      this.dynamicAvatar = `http://localhost:5000/uploads/${user.avatar}`;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/pages/login'); 
    }
  }
}
</script>

<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="dynamicAvatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Akun
      </CDropdownHeader>
      
      <CDropdownItem @click="$router.push('/profile')" style="cursor: pointer;">
        <CIcon icon="cil-user" /> Profile
      </CDropdownItem>
      
      <CDropdownDivider />
      
      <CDropdownItem @click="logout" style="cursor: pointer;">
        <CIcon icon="cil-lock-locked" /> Logout
      </CDropdownItem>
      
    </CDropdownMenu>
  </CDropdown>
</template>
