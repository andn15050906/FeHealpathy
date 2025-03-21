<template>
  <VaCard class="nav-card">
    <section class="nav-grid">
      <div v-for="section in navSections" :key="section">
        <h3 class="nav-title">{{ section }}</h3>
        <ul style="padding: 0;">
          <li v-for="item in navigation[section]" :key="`${section}-${item.name}`">
            <a class="nav-link" href="#">{{ item.name }}</a>
          </li>
        </ul>
      </div>
    </section>
  </VaCard>
</template>

<script setup>
import { computed } from 'vue';
import navigation from '../data/navigationLinks.json';

const navSections = computed(() => Object.keys(navigation));
</script>

<style scoped>
.nav-card {
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 40px;
  align-items: start;
}

.nav-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.nav-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #154EC1;
  margin-bottom: 1rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.nav-link {
  display: block;
  text-decoration: none;
  color: #007BFF;
  transition: color 0.3s;
  padding-left: 0;
}

.nav-link:hover {
  color: #0056b3;
}
</style>
