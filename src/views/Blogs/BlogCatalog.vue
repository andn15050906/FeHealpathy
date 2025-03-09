<template>
    <h4>Blog Catalog</h4>
  
    <div class="filter-section">
      <button v-for="filter in filters" :key="filter.value"
        :class="['filter-btn', selectedTags.includes(filter.value) ? 'active' : '']"
        @click="toggleTag(filter.value)">
        {{ filter.label }}
      </button>
    </div>
  
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
import { ref, computed, defineEmits } from 'vue';
import { getPagedArticles } from "@/scripts/api/services/blogService.js";
import BlogCard from '@/components/BlogComponents/BlogCard.vue';
import { getPagedTags } from "@/scripts/api/services/tagService.js"; 
import { onMounted } from 'vue';

const selectedTags = ref([]);
const itemsPerPage = 20;
const blogs = ref([]);
const currentPage = ref(1);
const paginatedblogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return blogs.value.slice(start, end);
});
const filters = ref([
  { value: 'all', label: 'All' },
  { value: 'tech', label: 'Technology' },
  { value: 'life', label: 'Lifestyle' }
]);
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
  if (selectedTags.value.length === 0) {
    return blogs.value;
  }
  return blogs.value.filter(blog => 
    selectedTags.value.every(tagId => 
      blog.tags.some(tag => tag.id === tagId)
    )
  );
});

onMounted(async () => {
  try {
    const blogResponse = await getPagedArticles();
    if (blogResponse && blogResponse.items) {
      blogs.value = blogResponse.items.map(blog => ({ ...blog }));
    } else {
      console.error('No blog items found');
    }

    const tagResponse = await getPagedTags();
    if (tagResponse && tagResponse.length > 0) {
      filters.value = tagResponse.map(tag => ({
        value: tag.id,
        label: tag.title
      }));
    } else {
      console.error('No tag items found');
    }
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
  </style>