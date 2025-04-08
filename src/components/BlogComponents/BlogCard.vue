<template>
  <div class="blog-card shadow h-100">
    <div class="blog-thumbnail position-relative">
      <RouterLink :to="`/blogs/${blog.id}`" target="_blank">
        <img v-if="blog.thumb" :src="blog.thumb?.url" :alt="blog.title" class="img-fluid w-100 h-100"
          :onError="(e) => e.target.style.display = 'none'">
        <div v-else class="default-thumbnail" :style="{ backgroundImage: 'url(/assets/images/10.jpg)' }"></div>
      </RouterLink>
    </div>
    <div class="blog-content d-flex flex-column p-3">
      <h3 class="blog-title text-center mb-3">
        <RouterLink :to="`/blogs/${blog.id}`" target="_blank" class="text-decoration-none">
          {{ blog.title || 'Untitled Blog' }}
        </RouterLink>
      </h3>
      <div class="blog-footer mt-auto">
        <div class="meta-info d-flex justify-content-between align-items-center">
          <span class="instructor">{{ blog.creator.fullName }}</span>
          <p class="blog-date m-0">{{ formatDate(blog.creationTime) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
  blog: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const formatDate = (dateString) => {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
</script>

<style scoped>
.blog-card {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 380px;
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.blog-thumbnail {
  height: 200px;
  overflow: hidden;
}

.blog-thumbnail img,
.default-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.default-thumbnail {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
}

.blog-thumbnail:hover img,
.blog-thumbnail:hover .default-thumbnail {
  transform: scale(1.05);
}

.blog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}

.blog-title a {
  color: #2c3e50;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  transition: color 0.2s ease;
}

.blog-title a:hover {
  color: #3498db;
}

.blog-footer {
  padding-top: 12px;
  border-top: 1px solid #eef2f7;
}

.instructor {
  font-weight: 600;
  color: #34495e;
  font-size: 0.9rem;
}

.blog-date {
  font-size: 0.85rem;
  color: #7f8c8d;
}
</style>