<template>
    <div class="card border-0 shadow-sm mb-5">
        <div class="card-body">
            <h4 class="fw-bold text-dark card-title mb-4">Bài viết liên quan</h4>
            <div class="row g-4">
                <div v-for="article in relatedArticles" :key="article.id" class="col-12 col-md-6 col-lg-4">
                    <div class="card h-100 border-0">
                        <RouterLink :to="`/blogs/${article.id}`" class="text-decoration-none">
                            <img :src="article.imageUrl" :alt="article.title" class="card-img-top" />
                        </RouterLink>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">{{ article.title }}</h5>
                            <p class="text-muted mb-2">{{ article.author }}</p>
                            <p class="text-secondary mb-3">{{ formatDate(article.creationTime) }}</p>
                            <RouterLink :to="`/blogs/${article.id}`" class="mt-auto btn btn-outline-primary">
                                Xem chi tiết
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getPagedArticles } from '@/scripts/api/services/blogService';

const relatedArticles = ref([]);
const route = useRoute();

const fetchRelatedArticles = async () => {
    try {
        const currentBlogId = route.params.id;
        const { items = [] } = await getPagedArticles({ limit: 4, random: true });
        relatedArticles.value = items
            .filter((a) => a.id !== currentBlogId)
            .slice(0, 3)
            .map((article) => ({
                id: article.id,
                imageUrl: article.thumb.url,
                title: article.title,
                author: article.creator.fullName,
                creationTime: article.creationTime,
            }));
    } catch (error) {
        console.error('Failed to fetch related articles:', error);
    }
};

onMounted(fetchRelatedArticles);
watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
        fetchRelatedArticles();
    }
});

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
};
</script>

<style scoped>
.card-img-top {
    height: 180px;
    object-fit: cover;
    border-top-left-radius: .375rem;
    border-top-right-radius: .375rem;
}
</style>