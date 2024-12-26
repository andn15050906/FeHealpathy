<template>
    <div class="glowing" padding="10px">
        <a :href="article.Link" class="article-link">
            <img :src="article.Thumb" :alt="article.Title" class="article-image" />
        </a>
        <div class="article-content">
            <a :href="article.Link" class="article-title">{{ article.Title }}</a>
            <time class="article-date">{{ article.Date }}</time>
            <div class="article-tags">
                <span v-for="tag in article.Tags" :key="tag" class="article-tag" @click="handleTagClick(tag)">
                    {{ tag }}
                </span>
            </div>
        </div>
    </div>
</template>


<script setup>
const props = defineProps({
    article: {
        type: Object
    }
});

// keep in both BlogCardWithTags and SearchBlogResult
const handleTagClick = (tagOrCategory) => {
    if (tagOrCategory.Title) {
        this.$router.push({ path: '/search-blogs', query: { category: tagOrCategory.Id, page: 1 } });
    } else {
        this.$router.push({ path: '/search-blogs', query: { tag: tagOrCategory, page: 1 } });
    }
}
</script>

<style>
.glowing {
    justify-content: center;
    align-items: center;
    flex: 1;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.glowing:hover {
    transform: scale(1.05);
}

.article-card {
    max-width: 280px;
}

.article-image {
    width: 100%;
    border-radius: 20px;
    aspect-ratio: 1;
    object-fit: cover;
}

.article-title {
    margin-top: 16px;
    font-size: 24px;
    color: #000;
}

a.article-title {
    text-decoration: none;
}

.article-date {
    display: block;
    margin-top: 10px;
    font: 400 13px/1 Inter, sans-serif;
    color: #999;
}
</style>