<template>
    <h4 class="page-title">Blog Catalog</h4>
  
    <div class="search-section">
      <input type="text" placeholder="Search blogs..." v-model="searchQuery" class="search-input"/>
    </div>

    <div class="filter-section">
      <button v-for="filter in filters" :key="filter.value"
        :class="['filter-btn', selectedTags.includes(filter.value) ? 'active' : '']"
        @click="toggleTag(filter.value)">
        {{ filter.label }}
      </button>
    </div>
  
      <select  v-model="sortOption" @change="sortBlogs" class="form-select" style="width: 200px;">
            <option selected value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
      </select>


    <div class="blogs-container">
      <div class="blog-grid">
        <blogCard v-for="blog in filteredBlogs" :key="blog.id" :blog="blog" />
      </div>
    </div>
  
    <div class="pagination">
      <button v-for="page in Math.ceil(blogs.length / itemsPerPage)" :key="page"
        :class="['page-btn', currentPage === page ? 'active' : '']"
        @click="changePage(page)">
        {{ page }}
      </button>
    </div>
  </template>
  
<script setup>
import { ref, computed, defineEmits, watch } from 'vue';
import { getPagedArticles } from "@/scripts/api/services/blogService.js";
import BlogCard from '@/components/BlogComponents/BlogCard.vue';
import { getPagedTags } from "@/scripts/api/services/tagService.js"; 
import { onMounted } from 'vue';

const selectedTags = ref([]);
const searchQuery = ref('');
const sortOption = ref('name-asc');
const itemsPerPage = 20;
const blogs = ref([]);
const currentPage = ref(1);
const paginatedblogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return blogs.value.slice(start, end);
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

const filteredBlogs = computed(() => {
  let result = blogs.value;
  if (selectedTags.value.length > 0) {
    result = result.filter(blog => selectedTags.value.every(tagId =>
      blog.tags.some(tag => tag.id === tagId)
    ));
  }
  if (searchQuery.value) {
    result = result.filter(blog => blog.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }
  return result.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
});

function sortBlogs() {
  if (sortOption.value === 'name-asc') {
    blogs.value.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption.value === 'name-desc') {
    blogs.value.sort((a, b) => b.title.localeCompare(a.title));
  }
}

watch(sortOption, () => {
  sortBlogs();
  changePage(1);
});


onMounted(async () => {
  try {
    const blogResponse = await getPagedArticles();
    blogs.value = blogResponse?.items?.map(blog => ({ ...blog })) || [];
    const tagResponse = await getPagedTags();
    sortBlogs();
    filters.value = tagResponse?.map(tag => ({
      value: tag.id,
      label: tag.title
    })) || [];
  } catch (error) {
    console.error("Failed to fetch blogs or tags", error);
  }
});


function changePage(page) {
  currentPage.value = page;
}

function applyFilter(filterValue) {
  currentFilter.value = filterValue;

  if (filterValue === 'all') {
    paginatedblogs.value = blogs.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
  } else {
    const filteredBlogs = blogs.value.filter(blog => blog.tags.some(tag => tag.id === filterValue));
    paginatedblogs.value = filteredBlogs.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
  }
}

</script>

  
  <style scoped>
  .blogs-container {
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
  
  .blog-grid {
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