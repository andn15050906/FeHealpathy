<template>
  <h1 class="page-title">How can we help you?</h1>
  <Categories />
  <RequestDemo />
  <Questions />
  <Navigation />
</template>

<script setup>
import Categories from '@/components/FaqComponents/widgets/Categories.vue';
import Questions from '@/components/FaqComponents/widgets/Questions.vue';
import RequestDemo from '@/components/FaqComponents/widgets/RequestDemo.vue';
import Navigation from '@/components/FaqComponents/widgets/Navigation.vue';
</script>

<style scoped>

.page-title {
font-size: 2rem;
font-weight: bold;
margin-bottom: 2rem;
}
</style>