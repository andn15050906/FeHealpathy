<template>
  <VaCard class="mb-4 p-6">
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="section in navSections" :key="section" class="mb-6">
        <h3 class="h5 mb-4">{{ section }}</h3>
        <ul class="leading-5">
          <li v-for="item in navigation[section]" :key="`${section}-${item.name}`" class="mb-4">
            <a class="va-link" href="#">{{ item.name }}</a>
          </li>
        </ul>
      </div>
    </section>
  </VaCard>
</template>

<script setup>
import { computed } from 'vue'
import navigation from '../data/navigationLinks.json'

const navSections = computed(() => {
  return Object.keys(navigation)
})
</script>

<style scoped>
h3.h5 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #154EC1; 
}

ul.leading-5 {
  padding-left: 1rem;
}

li.mb-4 {
  margin-bottom: 0.5rem;
}

.va-link {
  text-decoration: none;
  color: #007BFF; 
  transition: color 0.3s;
}

.va-link:hover {
  color: #0056b3; 
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 40px;
}
</style>
