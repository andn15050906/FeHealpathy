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
  padding: 20px;
}

.category-card {
  background-color: #f9f9f9; 
  border: 1px solid #ddd; 
  border-radius: 8px; 
  padding: 20px; 
  text-align: center; 
  transition: transform 0.2s; 
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

h2.va-h5 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #154EC1;
}

ul {
  list-style-type: none; 
  padding: 0;
}

li {
  margin: 0.5rem 0;
}

.va-link {
  text-decoration: none;
  color: #007BFF;
  transition: color 0.3s;
}

.va-link:hover {
  color: #0056b3; 
}
</style>