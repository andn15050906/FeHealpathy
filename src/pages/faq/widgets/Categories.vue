<template>
  <div>
    <h2 class="va-h5">Popular Categories</h2>
    <ul>
      <li v-for="category in categories" :key="category.id">
        <a class="va-link" href="#">{{ category.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import categoriesData from '../data/popularCategories.json'

const categories = ref(categoriesData)
</script> 