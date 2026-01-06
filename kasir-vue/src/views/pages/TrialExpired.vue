<template>
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
            <CRow class="justify-content-center">
                <CCol :md="6">
                    <CCard class="p-4 text-center border-danger border-top-5">
                        <CCardBody>
                            <div class="text-danger mb-4">
                                <CIcon icon="cil-warning" size="4xl" />
                            </div>
                            <h2 class="text-danger">Masa Trial Habis</h2>
                            <p class="text-muted mb-4">
                                Terima kasih telah mencoba aplikasi kami. 
                                Masa percobaan gratis Anda telah berakhir pada <strong>{{ formatDate(trialDate) }}</strong>.
                            </p>
                            
                            <div class="alert alert-info">
                                Silakan hubungi Admin/Developer untuk berlangganan dan melanjutkan akses penuh ke data Anda.
                            </div>

                            <div class="d-grid gap-2 col-12 mx-auto mt-4">
                                <a href="https://wa.me/6281337667055?text=Halo%20saya%20mau%20berlangganan%20aplikasi%20kasir" target="_blank" class="btn btn-success text-white">
                                    <CIcon icon="cil-phone" class="me-2"/> Hubungi Admin
                                </a>
                                <CButton color="secondary" variant="ghost" @click="logout">
                                    Logout / Keluar
                                </CButton>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    </div>
</template>

<script>
export default {
    name: 'TrialExpired',
    data() {
        return {
            trialDate: ''
        }
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem('user'));
        // Kita simpan info trial di localStorage saat login nanti
        const trialInfo = JSON.parse(localStorage.getItem('trial_info') || '{}');
        this.trialDate = trialInfo.ends_at || new Date();
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleString('id-ID');
        },
        logout() {
            localStorage.clear();
            this.$router.push('/pages/login');
        }
    }
}
</script>