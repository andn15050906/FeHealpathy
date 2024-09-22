<script setup>
  import { RouterView } from 'vue-router'
  import HeaderPage from './components/HomeLayout/HeaderPage.vue';
  import FooterPage from './components/HomeLayout/FooterPage.vue';
</script>
<template>
  <div id="app">
    <HeaderPage/>
    <RouterView/>
    <FooterPage/>
  </div>
</template>


