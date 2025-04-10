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
        <courseCard v-for="course in pagedCourses" :key="course.id" :course="course" />
      </div>
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="changePage" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount } from 'vue';
import courseCard from '@/components/courseComponents/courseCard.vue';
import Pagination from '@/components/Common/Pagination.vue';
import { getAllCourses } from '@/scripts/api/services/courseService.js';

const searchQuery = ref('');
const sortOption = ref('name-asc');
const itemsPerPage = 12;
const currentPage = ref(1);
const courses = ref([]);

const filteredList = computed(() => {
  let result = courses.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(course =>
      course.title.toLowerCase().includes(q)
    );
  }
  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredList.value.length / itemsPerPage)
);
const pagedCourses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredList.value.slice(start, start + itemsPerPage);
});

function sortCourses() {
  courses.value.sort((a, b) =>
    sortOption.value === 'name-asc'
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );
  changePage(1);
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

onBeforeMount(async () => {
  try {
    const courseResp = await getAllCourses();
    courses.value = courseResp.map(course => ({ ...course })) || [];
    sortCourses();
  } catch (e) {
    console.error('Failed to fetch courses', e);
  }
});

watch(searchQuery, () => {
  changePage(1);
});
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