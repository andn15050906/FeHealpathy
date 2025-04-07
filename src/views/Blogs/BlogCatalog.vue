<template>
  <div class="container mt-2">
    <h2 class="fw-bold text-center mb-4 text-dark">Blog Catalog</h2>

    <div class="row justify-content-center mb-4">
      <div class="col-md-8">
        <input v-model="searchQuery" type="text" class="form-control search-bar" placeholder="Search blogs..." />
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
        <option value="name-asc">Name A-Z</option>
        <option value="name-desc">Name Z-A</option>
      </select>
    </div>

    <div class="blogs-container">
      <div class="blog-grid">
        <blogCard v-for="blog in pagedBlogs" :key="blog.id" :blog="blog" />
      </div>
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="changePage" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount } from 'vue';
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

const filteredList = computed(() => {
  let result = blogs.value;
  if (selectedTags.value.length) {
    result = result.filter(blog =>
      selectedTags.value.every(tagId =>
        blog.tags.some(tag => tag.id === tagId)
      )
    );
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(blog => blog.title.toLowerCase().includes(q));
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage));

const pagedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredList.value.slice(start, start + itemsPerPage);
});

function toggleTag(tagId) {
  const idx = selectedTags.value.indexOf(tagId);
  if (idx === -1) selectedTags.value.push(tagId);
  else selectedTags.value.splice(idx, 1);
  changePage(1);
}

function sortBlogs() {
  blogs.value.sort((a, b) =>
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
    const resp = await getPagedArticles();
    blogs.value = resp.items || [];
    const tagResp = await getPagedTags();
    filters.value = tagResp.map(tag => ({ value: tag.id, label: tag.title }));
    sortBlogs();
  } catch (e) {
    console.error('Failed to fetch blogs or tags', e);
  }
});

watch([searchQuery, selectedTags], () => changePage(1));
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

.blogs-container {
  margin: 0 auto 40px;
}
</style>
