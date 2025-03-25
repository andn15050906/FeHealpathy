<template>
  <h4 class="page-title">Course Catalog</h4>
  <div class="search-section">
    <input type="text" placeholder="Search courses..." v-model="searchQuery" class="search-input"/>
  </div>
    <select  v-model="sortOption" @change="" class="form-select" style="width: 200px;">
          <option selected value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
    </select>

  <div class="courses-container">
    <div class="course-grid">
      <courseCard v-for="course in filteredcourses" :key="course.id" :course="course" />
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
import { ref, computed, watch } from 'vue';
import { getCourses } from "@/scripts/api/services/courseService.js";
import courseCard from '@/components/courseComponents/courseCard.vue';
import { getPagedTags } from "@/scripts/api/services/tagService.js"; 
import { onMounted } from 'vue';
const selectedTags = ref([]);
const searchQuery = ref('');
const sortOption = ref('name-asc');
const itemsPerPage = 20;
const courses = ref([]);
const currentPage = ref(1);
const paginatedcourses = computed(() => {
const start = (currentPage.value - 1) * itemsPerPage;
const end = start + itemsPerPage;
return courses.value.slice(start, end);
});
const filters = ref([]);
const currentFilter = ref('all');
defineEmits(['authenticated', 'addNotification', 'removeNotification']);
function toggleTag(tagId) {
const index = selectedTags.value.indexOf(tagId);
if (index === -1) {
  selectedTags.value.push(tagId);
} else {
  selectedTags.value.splice(index, 1);
}
}
const filteredcourses = computed(() => {
let result = courses.value;
if (selectedTags.value.length > 0) {
  result = result.filter(course => selectedTags.value.every(tagId =>
    course.tags.some(tag => tag.id === tagId)
  ));
}
if (searchQuery.value) {
  result = result.filter(course => course.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
}
return result.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
});
function sortcourses() {
if (sortOption.value === 'name-asc') {
  courses.value.sort((a, b) => a.title.localeCompare(b.title));
} else if (sortOption.value === 'name-desc') {
  courses.value.sort((a, b) => b.title.localeCompare(a.title));
}
}
watch(sortOption, () => {
sortcourses();
changePage(1);
});
onMounted(async () => {
try {
  const courseResponse = await getCourses();
  courses.value = courseResponse?.items?.map(course => ({ ...course })) || [];
  const tagResponse = await getPagedTags();
  sortcourses();
  filters.value = tagResponse?.map(tag => ({
    value: tag.id,
    label: tag.title
  })) || [];
} catch (error) {
  console.error("Failed to fetch courses or tags", error);
}
});
function changePage(page) {
currentPage.value = page;
}
function applyFilter(filterValue) {
currentFilter.value = filterValue;
if (filterValue === 'all') {
  paginatedcourses.value = courses.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
} else {
  const filteredcourses = courses.value.filter(course => course.tags.some(tag => tag.id === filterValue));
  paginatedcourses.value = filteredcourses.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
}
}
</script>
<style scoped>
.courses-container {
  max-width: 1200px;
  margin: 60px auto 40px;
  padding: 0 20px;
  position: relative;
  min-height: 300px;
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
  flex-wrap: wrap;
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
.page-title {
font-size: 32px;
text-align: center;
margin: 40px 0;
color: #1b1b1b;
}
.search-section {
margin: 20px 0;
display: flex;
justify-content: center;
}
.search-input {
width: 100%;
max-width: 800px;
padding: 10px 20px;
font-size: 16px;
border: 1px solid #ccc;
border-radius: 20px;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
transition: border-color 0.3s;
}
.search-input:focus {
border-color: #007BFF;
outline: none;
}
</style>