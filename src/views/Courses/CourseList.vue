<template>
  <h4>Course Catalog</h4>

  <!--<div class="filter-section">
    <button v-for="filter in filters" :key="filter.value"
      :class="['filter-btn', currentFilter === filter.value ? 'active' : '']" @click="applyFilter(filter.value)">
      {{ filter.label }}
    </button>
  </div>-->

  <div class="courses-container">
    <div class="course-grid">
      <CourseCard v-for="course in paginatedCourses" :key="course.id" :course="course" />
    </div>
  </div>

  <div class="pagination">
    <button v-for="page in Math.ceil(courses.length / itemsPerPage)" :key="page"
      :class="['page-btn', currentPage === page ? 'active' : '']"
      @click="changePage(page)">
      {{ page }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getCourses } from "@/scripts/api/services/courseService.js";
import CourseCard from '@/components/CourseComponents/CourseCard.vue';
import { onMounted } from 'vue';

const itemsPerPage = 12;
const courses = ref([]);
const currentPage = ref(1);
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return courses.value.slice(start, end);
})

onMounted(async () => {
  try {
    courses.value = (await getCourses()).items.map(course => {
      return {
        ...course,
        //...
        instructor: 'SkyDiver7'
      }
    });
  } catch (error) {
    console.error("Failed to fetch courses", error);
  }
});

function changePage(page) {
  currentPage.value = page;
}
</script>

<style scoped>
.courses-container {
  max-width: 1200px;
  margin: 60px auto 40px;
  padding: 0 20px;
  position: relative;
}

.total-count {
  position: absolute;
  left: 20px;
  top: -30px;
  font-size: 16px;
  color: #666;
}

.page-title {
  font-size: 32px;
  text-align: center;
  margin: 40px 0;
  color: #1b1b1b;
}

.filter-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.filter-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
}

.filter-btn.active {
  background: #5488c7;
  color: white;
  border-color: #5488c7;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.page-btn {
  width: 35px;
  height: 35px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.page-btn.active {
  background: #5488c7;
  color: white;
  border-color: #5488c7;
}
</style>