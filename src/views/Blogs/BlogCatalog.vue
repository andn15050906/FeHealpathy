<template>
  <div class="container mt-2">
    <h2 class="fw-bold text-center mb-4 text-dark">Danh sách blog</h2>

    <div class="row justify-content-center mb-4">
      <div class="col-md-8">
        <input v-model="searchQuery" type="text" class="form-control search-bar" placeholder="Tìm kiếm blog..." />
      </div>
    </div>

    <div class="filter-section">
      <button v-for="filter in filters" :key="filter.value"
        :class="['filter-btn', selectedTags.includes(filter.value) ? 'active' : '']" @click="toggleTag(filter.value)">
        {{ filter.label }}
      </button>
    </div>

    <div class="sort-section">
      <select v-model="sortOption" @change="sortBlogs" class="form-select sort-select">
        <option value="name-asc">Xếp theo tên A-Z</option>
        <option value="name-desc">Xếp theo tên Z-A</option>
      </select>
    </div>

    <div class="blogs-container">
      <div class="blog-grid">
        <blogCard v-for="blog in blogs" :key="blog.id" :blog="blog" />
      </div>
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="loadBlogs" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import BlogCard from '@/components/BlogComponents/BlogCard.vue';
import Pagination from '@/components/Common/Pagination.vue';
import { getPagedArticles } from '@/scripts/api/services/blogService.js';
import { getPagedTags } from '@/scripts/api/services/tagService.js';

const searchQuery = ref('');
const selectedTags = ref([]);
const sortOption = ref('name-asc');
const itemsPerPage = 12;
const currentPage = ref(1);
const blogs = ref([]);
const filters = ref([]);
const totalPages = ref(1);
const totalItems = ref(0);

async function loadBlogs(page = 1) {
  currentPage.value = page;

  try {
    const params = {
      pageIndex: currentPage.value - 1,
      pageSize: itemsPerPage,
      tags: selectedTags.value
    };

    const response = await getPagedArticles(params);
    blogs.value = response.items || [];
    totalPages.value = response.pageCount || Math.ceil(response.totalCount / itemsPerPage);
    totalItems.value = response.totalCount || 0;
  } catch (e) {
    console.error('Không thể tải bài viết', e);
  }
}

async function loadTags() {
  try {
    const tagResp = await getPagedTags();
    filters.value = tagResp.map(tag => ({ value: tag.id, label: tag.title }));
  } catch (e) {
    console.error('Không thể tải tags', e);
  }
}

function toggleTag(tagId) {
  const idx = selectedTags.value.indexOf(tagId);
  if (idx === -1) selectedTags.value.push(tagId);
  else selectedTags.value.splice(idx, 1);
  loadBlogs(1);
}

function sortBlogs() {
  loadBlogs(1);
}

onBeforeMount(async () => {
  await loadTags();
  loadBlogs();
});

let searchTimeout;
function onSearchChange() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadBlogs(1);
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

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.blog-grid>* {
  justify-self: center;
  width: 100%;
  display: flex;
  justify-content: center;
}

.blogs-container {
  margin: 0 auto 40px;
}
</style>