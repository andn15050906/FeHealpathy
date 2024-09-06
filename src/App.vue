<script setup>
import { RouterView } from 'vue-router'
import HeaderPage from './views/home/HeaderPage.vue';
import FooterPage from './views/home/FooterPage.vue';
</script>
<template>
  <div id="app">
    <HeaderPage/>
    <RouterView/>
    <FooterPage/>
  </div>
</template>


