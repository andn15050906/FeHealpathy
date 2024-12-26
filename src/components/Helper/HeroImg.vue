<template>
  <section class="hero-section">
    <img :src="this.src" :alt="this.alt" class="hero-image" />
  </section>
</template>

<script>
import MockApi from '@/api/MockApi';

export default {
  name: 'HeroImg',
  data() {
    return MockApi.getHeroImg()
  }
}
</script>

<style scoped>
.hero-section {
  width: 100%;
  background-color: #335ede;
  margin-bottom: 85px;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

@media (max-width: 1000px) {
  .hero-section {
    margin-bottom: 40px;
  }
}
</style>