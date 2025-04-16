<template>
  <div class="container mt-2">
    <h2 class="fw-bold text-center mb-4 text-dark">Course Catalog</h2>

    <div class="row justify-content-center mb-4">
      <div class="col-md-8">
        <input v-model="searchQuery" type="text" class="form-control search-bar" placeholder="Search courses..." />
      </div>
    </div>

    <div class="sort-section">
      <select v-model="sortOption" @change="sortCourses" class="form-select sort-select">
        <option value="name-asc">Name A-Z</option>
        <option value="name-desc">Name Z-A</option>
      </select>
    </div>

    <div class="courses-container">
      <div class="course-grid">
        <courseCard v-for="course in courses" :key="course.id" :course="course" />
      </div>
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="loadCourses" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import courseCard from '@/components/courseComponents/courseCard.vue';
import Pagination from '@/components/Common/Pagination.vue';
import { getCourses } from '@/scripts/api/services/courseService.js';

const searchQuery = ref('');
const sortOption = ref('name-asc');
const itemsPerPage = 12;
const currentPage = ref(1);
const courses = ref([]);
const totalPages = ref(1);
const totalItems = ref(0);

async function loadCourses(page = 1) {
  currentPage.value = page;

  try {
    const params = {
      pageIndex: currentPage.value - 1,
      pageSize: itemsPerPage
    };

    const response = await getCourses(params);
    courses.value = response.items || [];
    totalPages.value = response.pageCount || Math.ceil(response.totalCount / itemsPerPage);
    totalItems.value = response.totalCount || 0;
  } catch (e) {
    console.error('Failed to fetch courses', e);
  }
}

function sortCourses() {
  loadCourses(1);
}

onBeforeMount(() => {
  loadCourses();
});

let searchTimeout;
function onSearchChange() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadCourses(1);
  }, 300);
}

watch(searchQuery, onSearchChange);
</script>

<style scoped>
.search-bar {
  border-radius: 70px;
  padding-left: 20px;
  transition: 0.3s ease;
  height: 50px;
}

.sort-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.sort-select {
  width: 200px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.course-grid>* {
  justify-self: center;
  width: 100%;
  display: flex;
  justify-content: center;
}

.courses-container {
  margin: 0 auto 40px;
}
</style>