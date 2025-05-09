<template>
  <div class="categories-container">
    <div v-for="category in categories" :key="category.id" class="category-card">
      <div class="category-icon">{{ category.icon }}</div>
      <div class="category-title">{{ category.name }}</div>
      <div class="category-intro">{{ category.intro }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import categoriesData from '../data/popularCategories.json'

const categories = ref(categoriesData)
</script>

<style scoped>
.categories-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1150px) {
  .categories-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .categories-container {
    grid-template-columns: repeat(1, 1fr);
  }
}

.category-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  transform: scale(1.05);
}

.category-icon {
  font-size: 40px;
  color: #154EC1;
}

.category-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px 0;
}

.category-intro {
  font-size: 1rem;
  color: #666;
}
</style>