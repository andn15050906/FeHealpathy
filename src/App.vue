<script setup>
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router';
import { ref, provide, onMounted } from 'vue';
import HeaderPage from './components/HomeLayout/HeaderPage.vue';
import FooterPage from './components/HomeLayout/FooterPage.vue';
import LoadingSpinner from './components/Helper/LoadingSpinner.vue';

const loadingSpinner = ref(null);
const sweetAlert = ref(null);

const router = useRouter();

provide('loadingSpinner', {
  showSpinner: () => loadingSpinner.value.showSpinner(),
  hideSpinner: () => loadingSpinner.value.hideSpinner(),
});

provide('sweetAlert', {
  showAlert: (options) => {
    if (sweetAlert.value && typeof sweetAlert.value.showAlert === 'function') {
      return sweetAlert.value.showAlert(options);
    } else {
      console.error('SweetAlert is not initialized or showAlert is not defined');
    }
  }
});

onMounted(() => {
  router.beforeEach((to, from, next) => {
    loadingSpinner.value.showSpinner(); 
    next();
  });

  router.afterEach(() => {
    setTimeout(() => {
      loadingSpinner.value.hideSpinner(); 
    }, 300); 
  });
});

</script>
<template>
  <div id="app">
    <LoadingSpinner ref="loadingSpinner" />
    <SweetAlert ref="sweetAlert" />
    <HeaderPage />
    <main>
      <RouterView />
    </main>
    <FooterPage />
  </div>
</template>

<style scoped>
main {
  padding: 0 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
