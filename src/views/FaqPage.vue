<template>
  <div class="container">
  <h1 class="page-title">Có thể chúng tôi giúp gì cho bạn?</h1>
  <Categories />
  <RequestDemo />
  <Questions />
  <Navigation />
</div>
</template>

<script setup>
import Categories from '@/components/FaqComponents/widgets/Categories.vue';
import Questions from '@/components/FaqComponents/widgets/Questions.vue';
import RequestDemo from '@/components/FaqComponents/widgets/RequestDemo.vue';
import Navigation from '@/components/FaqComponents/widgets/Navigation.vue';
</script>

<style scoped>
.container{
  width: 72vw;
}
.page-title {
font-size: 2rem;
font-weight: bold;
margin-bottom: 2rem;
}
</style>