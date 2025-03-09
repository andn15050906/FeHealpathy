<template>
  <GlowingCard class="blog-card" justify="unset" padding="10px">
    <div style="flex-grow: 1;">
        <div class="blog-thumbnail">
            <RouterLink :to="`/blog/${blog.id}`">
                <img :src="blog.thumb.url" :alt="blog.title">
            </RouterLink>
        </div>
        <p class="blog-title">{{ blog.title }}</p>
    </div>
    <div>
        <div class="tags">
            <ul class="blog-tags">
                <li v-for="tag in blog.tags" :key="tag.id"> {{ tag.title }}</li>
            </ul>
        </div>
        <span class="instructor">{{ blog.creator.fullName }}</span>
        <p class="blog-date">{{ formatDate(blog.creationTime) }}</p>
    </div>
  </GlowingCard>
</template>

<script setup>
import GlowingCard from '@/components/Common/GlowingCard.vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    blog: Object
});

const formatDate = (dateString) => {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};


</script>

<style scoped>
.blog-date {
    color: black;
}
.blog-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 320px;
}

.blog-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    width: 100%;
}

.blog-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.duration {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}

.level-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #5488c7;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.blog-info {
    padding: 15px;
}

.blog-title {
    font-size: 16px;
    margin-bottom: 8px;
    color: #000;
    height : 50px;
}

.instructor {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
}

.rating {
    display: flex;
    align-items: center;
    gap: 4px;
}

.fa-star {
    font-size: 12px;
    color: gold;
}

.rating-text {
    color: #000000;
}

.rating-count {
    color: #666;
    font-size: 12px;
}
.blog-tags {
    list-style: none;
    padding: 0;
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
}


.blog-tags li {
    background: #efefef; 
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 8px;
    color: #00bfff;
}
.tags {
    display: flex;
    justify-content: center;
    align-items: center;
    height:40px;
    margin:5px 0;
}

</style>