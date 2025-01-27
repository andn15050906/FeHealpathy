<template>
  <div id="app">
    <LoadingSpinner ref="loadingSpinner" />
    <SweetAlert ref="sweetAlert" />
    <Header ref="headerRef" />
    <NotificationContainer v-if="isAuthenticated" ref="notificationRef" />
    <main>
      <div class="page-container">
        <RouterView @authenticated="handleAuthenticated" @addNotification="addNotification"
          @removeNotification="removeNotification" />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { getUserAuthData } from '@/scripts/api/services/authService';
import Header from './components/Layouts/Header.vue';
import Footer from './components/Layouts/Footer.vue';
import LoadingSpinner from './components/Common/Popup/LoadingSpinner.vue';
import SweetAlert from './components/Common/Popup/SweetAlert.vue';
import NotificationContainer from './components/NotificationComponents/NotificationContainer.vue';

const loadingSpinner = ref(null);
const sweetAlert = ref(null);
const router = useRouter();
const isAuthenticated = ref(false);

provide('loadingSpinner', {
  showSpinner: () => loadingSpinner.value.showSpinner(),
  hideSpinner: () => loadingSpinner.value.hideSpinner(),
});

provide('sweetAlert', {
  showAlert: (options) => sweetAlert.value.showAlert(options),
  showSuccess: (message) => sweetAlert.value.showAlert({ icon: 'success', title: 'Success', text: message }),
  showError: (message) => sweetAlert.value.showAlert({ icon: 'error', title: 'Error', text: message }),
  showWarning: (message) => sweetAlert.value.showAlert({ icon: 'warning', title: 'Warning', text: message }),
  showInfo: (message) => sweetAlert.value.showAlert({ icon: 'info', title: 'Info', text: message }),
});

onMounted(async () => {
  router.beforeEach((to, from, next) => {
    loadingSpinner.value.showSpinner();
    next();
  });

  router.afterEach(() => {
    setTimeout(() => {
      loadingSpinner.value.hideSpinner();
    }, 300);
  });

  if (await getUserAuthData())
    isAuthenticated.value = true;
});

const headerRef = ref(null);
const handleAuthenticated = (data) => {
  isAuthenticated.value = true;
  headerRef.value.fetchUserProfile();
}

const notificationRef = ref(null);
const addNotification = (data) => {
  notificationRef.value.addNotification(data);
}
const removeNotification = (data) => {
  notificationRef.value.removeNotification(data);
}
</script>

<style scoped>
main {
  padding: 0 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/assets/background/green-bg1.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center top;
  background-attachment: fixed;
}

.page-container {
  min-height: 100vh;
  width: 1200px;
  background-color: #fff;
  margin-top: 60px;
  padding: 40px;
}

footer {
  z-index: 100;
}
</style>