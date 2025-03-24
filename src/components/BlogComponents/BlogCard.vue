<template>
  <GlowingCard class="blog-card" justify="unset" padding="10px">
    <div style="flex-grow: 1; width: 100%;">
        <div class="blog-thumbnail" style="background-image: url(/assets/images/10.jpg);">
            <RouterLink :to="`/blog/${blog.id}`">
                <img v-if="blog.thumb" :src="blog.thumb?.url" :alt="blog.title" :onError="(e) => e.target.style.display = 'none'">
            </RouterLink>
        </div>
        <div class="blog-content">
          <h3 class="blog-title">
            <RouterLink :to="`/blog/${blog.id}`">{{ blog.title || 'Untitled Blog' }}</RouterLink>
          </h3>
        </div>
    </div>

    <!-- Footer Section -->
    <div class="blog-footer">
      <div class="tags">
        <ul class="blog-tags">
          <li v-for="tag in blog.tags" :key="tag.id">{{ tag.title }}</li>
        </ul>
      </div>
      <div class="meta-info">
        <span class="instructor">{{ blog.creator.fullName }}</span>
        <p class="blog-date">{{ formatDate(blog.creationTime) }}</p>
      </div>
    </div>
  </GlowingCard>
</template>

<script setup>
import GlowingCard from '@/components/Common/GlowingCard.vue';
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;
  height: 380px;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.blog-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center top;
}

.blog-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.blog-thumbnail img:hover {
  transform: scale(1.05);
}

.blog-content {
  padding: 15px;
  margin-bottom: -20px;
  text-align: left;
}

.blog-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.4;
}

.blog-title a {
  text-decoration: none;
  color: inherit;
}

.blog-title a:hover {
  color: #007bff;
}

.blog-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.blog-footer {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  margin-bottom: -20px;
  gap: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.blog-tags {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-start;
}

.blog-tags li {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  max-width: 100px;
  color: #007bff;
  font-weight: bold;
}

.meta-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.85rem;
  color: #666;
}

.instructor {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.blog-date {
  font-size: 0.85rem;
  color: #999;
}
</style>