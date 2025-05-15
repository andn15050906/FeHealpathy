<template>
  <div class="container mt-2">
    <h2 class="fw-bold text-center mb-4 text-dark">Khóa học</h2>

    <div class="row justify-content-center mb-4">
      <div class="col-md-8">
        <input v-model="searchQuery" type="text" class="form-control search-bar" placeholder="Tìm khóa học..." />
      </div>
    </div>

    <div class="filter-section">
      <button v-for="filter in filters" :key="filter.value"
        :class="['filter-btn', selectedTags.includes(filter.value) ? 'active' : '']" @click="toggleTag(filter.value)">
        {{ filter.label }}
      </button>
    </div>

    <div class="sort-section">
      <select v-model="sortOption" @change="sortCourses" class="form-select sort-select">
        <option value="name-asc">Tiêu đề A-Z</option>
        <option value="name-desc">Tiêu đề Z-A</option>
      </select>
    </div>

    <div class="courses-container">
      <div v-if="courses.length > 0" class="course-grid">
        <CourseCard 
          v-for="course in courses" 
          :key="course.id" 
          :course="course"
          :is-enrolled="enrolledCourses.includes(course.id) || ownCourses.includes(course.id)"
        />
      </div>
      <div v-else class="text-center py-5">
        <p class="text-muted">Không tìm thấy khóa học phù hợp</p>
      </div>
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="loadCourses" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import CourseCard from '@/components/CourseComponents/CourseCard.vue';
import Pagination from '@/components/Common/Pagination.vue';
import { getCourses } from '@/scripts/api/services/courseService.js';
import { getEnrollments } from '@/scripts/api/services/enrollmentService.js';
import { getUserProfile } from '@/scripts/api/services/authService.js';

const searchQuery = ref('');
const selectedTags = ref([]);
const sortOption = ref('name-asc');
const itemsPerPage = 12;
const currentPage = ref(1);
const courses = ref([]);
const filters = ref([]);
const totalPages = ref(1);
const totalItems = ref(0);
const enrolledCourses = ref([]);
const currentUser = ref(null);
const ownCourses = ref([]);

async function loadEnrolledCourses() {
  try {
    const response = await getEnrollments({ pageSize: 100 });
    if (response?.items) {
      enrolledCourses.value = response.items.map(enrollment => enrollment.courseId);
    }
  } catch (error) {
    console.error('Error loading enrolled courses:', error);
  }
}

async function getCurrentUserInfo() {
  try {
    currentUser.value = await getUserProfile();
  } catch (error) {
    console.error('Error getting user info:', error);
    currentUser.value = null;
  }
}

async function loadCourses(page = 1) {
  currentPage.value = page;

  try {
    const params = {
      pageIndex: currentPage.value - 1,
      pageSize: itemsPerPage,
      categories: selectedTags.value,
      title: searchQuery.value
    };

    const response = await getCourses(params);
    if (response?.items) {
      courses.value = response.items;
      // Update ownCourses list
      if (currentUser.value) {
        ownCourses.value = response.items
          .filter(course => course.creatorId === currentUser.value.id)
          .map(course => course.id);
      }
      
      totalPages.value = response.pageCount || Math.ceil(response.totalCount / itemsPerPage);
      totalItems.value = response.totalCount || 0;
    }
  } catch (e) {
    console.error('Không thể tải khóa học', e);
  }
}

async function loadCategories() {
  try {
    const categoryResp = await getPagedCategories();
    filters.value = categoryResp.map(category => ({ value: category.id, label: category.title }));
  } catch (e) {
    console.error('Không thể tải danh mục', e);
  }
}

function toggleTag(tagId) {
  const idx = selectedTags.value.indexOf(tagId);
  if (idx === -1) selectedTags.value.push(tagId);
  else selectedTags.value.splice(idx, 1);
  loadCourses(1);
}

function sortCourses() {
  loadCourses(1);
}

onBeforeMount(async () => {
  await Promise.all([
    loadCategories(),
    loadEnrolledCourses(),
    getCurrentUserInfo()
  ]);
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

.filter-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.filter-btn.active {
  background: #5488c7;
  color: white;
  border-color: #5488c7;
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
  grid-template-columns: repeat(4, 1fr);
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
  width: 72vw;
}

@media (max-width: 1200px) {
  .course-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>