<template>
    <div class="card border-0 shadow-sm mb-2">
        <div class="card-body">
            <h4 class="fw-bold text-dark card-title mb-4">Bài viết bạn có thể thích</h4>

            <div class="position-relative">
                <swiper :modules="swiperModules" :slides-per-view="1" :space-between="10" :navigation="true"
                    :pagination="{ clickable: true }" :breakpoints="{
                        576: { slidesPerView: 1 },
                        768: { slidesPerView: 2, spaceBetween: 10 },
                        992: { slidesPerView: 3, spaceBetween: 10 }
                    }" class="related-articles-swiper">
                    <swiper-slide v-for="article in recommendedArticals" :key="article.id">
                        <div class="card h-100 shadow-sm article-card" @click="navigateToArticle(article.objectID)">
                            <div class="image-container">
                                <img :src="article.Url" class="card-img-top" alt="post image" />
                            </div>
                            <div class="card-content">
                                <h5 class="fw-bold title-truncate">{{ article.Title }}</h5>
                                <p class="text-muted mb-0 date-text">{{ formatDate(article.CreationTime) }}</p>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getRecommendationArticals } from '../../scripts/api/services/blogService';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const recommendedArticals = ref([]);
const route = useRoute();
const router = useRouter();
const swiperModules = [Navigation, Pagination];

const fetchrecommendedArticals = async () => {
    try {
        const res = await getRecommendationArticals();
        recommendedArticals.value = res || [];
    } catch (error) {
    }
};

const navigateToArticle = async (id) => {
    try {
        await router.push({ name: 'BlogDetail', params: { id } });
        window.location.reload();
    } catch (error) {
    }
};

onMounted(fetchrecommendedArticals);
watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
        fetchrecommendedArticals();
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
.related-articles-swiper {
    padding: 0 15px;
    padding-bottom: 2.5rem;
    max-width: 100%;
}

.image-container {
    height: 200px;
    overflow: hidden;
    border-radius: 6px 6px 0 0;
}

.card-img-top {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s ease;
}

.article-card:hover .card-img-top {
    transform: scale(1.05);
}

.card-content {
    min-height: 75px;
    max-height: 85px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    justify-content: space-between;
}

.title-truncate {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    max-height: 2.6em;
    margin-bottom: 0.25rem;
    font-size: 1rem;
    word-break: break-word;
    hyphens: auto;
}

.swiper-button-next,
.swiper-button-prev {
    color: #6c757d;
    font-weight: bold;
    top: 45%;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.swiper-button-next::after,
.swiper-button-prev::after {
    font-weight: bold;
    font-size: 20px;
}

.swiper-pagination-bullet-active {
    background: #6c757d;
}

:deep(.swiper-pagination) {
    bottom: 0 !important;
    margin-bottom: 0.5rem;
}

:deep(.swiper-button-prev) {
    left: 0;
}

:deep(.swiper-button-next) {
    right: 0;
}

.article-card {
    height: 320px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
}

.article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

:deep(.swiper-wrapper) {
    width: 100%;
}

:deep(.swiper-slide) {
    width: auto;
    display: flex;
    justify-content: center;
}

.card-body {
    padding: 1.25rem 0.75rem;
}
</style>