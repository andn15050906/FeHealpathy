<template>
    <div class="container pose-details" v-if="pose">
        <div class="mb-3">
            <router-link to="/yoga/poses" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-left mr-2"></i>Quay lại
                <i class="fas fa-arrow-left mr-2"></i>Quay lại
            </router-link>
        </div>
        <h2 class="text-center mb-2" style="font-weight: bold;">{{ pose.name }}</h2>
        <p class="text-center mute mb-4">Mức độ: {{ translateLevel(pose.level) }}</p>

        <div class="text-center mb-4">
            <button class="btn btn-outline-secondary mr-2" :class="{ active: selectedOption === 'model' }"
                @click="selectOption('model')">
                <i class="fas fa-cube mr-1"></i> Tương tác 3D
            </button>
            <button class="btn btn-outline-secondary" :class="{ active: selectedOption === 'video' }"
                @click="selectOption('video')">
                <i class="fas fa-video mr-1"></i> Video
            </button>
        </div>
        <div class="embed-responsive mb-4">
            <iframe class="embed-responsive-item" :src="currentEmbedUrl" frameborder="0"
                allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
        </div>
        <div class="pose-details-info d-flex flex-column gap-3">
            <div class="card shadow p-4">
                <h4 class="text-dark fw-bold mb-3">Mô tả bài tập</h4>
                <h4 class="text-dark fw-bold mb-3">Mô tả bài tập</h4>
                <p class="text-muted">{{ pose.description }}</p>
            </div>
            <div class="card shadow p-4">
                <h4 class="text-dark fw-bold mb-3">Dụng cụ cần thiết</h4>
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        <span class="text-muted">{{ pose.equipmentRequirement }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div v-if="recommendedPoses.length" style="margin-top: 40px;">
            <h3 class="text-center fw-bold mt-4">Có thể bạn sẽ thích</h3>
            <swiper :modules="swiperModules" :slides-per-view="1" :space-between="10" :navigation="true"
                :pagination="{ clickable: true }" :breakpoints="{
                    576: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 3 }
                }" class="recommended-swiper">
                <swiper-slide v-for="item in recommendedPoses" :key="item.objectID">
                    <div class="card h-100 shadow-sm p-3 pose-card" @click="navigateToPose(item.objectID)">
                        <img :src="item.ThumpUrl" class="img-fluid rounded mb-3"
                            style="height: 200px; object-fit: contain;" :alt="item.Name" />
                        <h5 class="fw-bold mb-1">{{ item.Name }}</h5>
                        <p class="text-muted mb-1">Mức độ: {{ translateLevel(item.Level) }}</p>
                    </div>
                </swiper-slide>
            </swiper>
        </div>

        <div class="text-center mt-4 disclaimer">
            <i class="fas fa-exclamation-triangle text-warning me-2"></i>
            <i>Lưu ý: Chúng tôi không sở hữu bất kỳ tài nguyên nào được cung cấp trên trang này.</i>
        </div>
    </div>

    <div v-else class="text-center mt-5">
        <p>Đang tải thông tin tư thế...</p>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getPagedYogaPoses, getRecommendationPoses } from "../../../scripts/api/services/yogaService";

export default {
    name: "YogaPoseDetails",
    components: {
        Swiper,
        SwiperSlide
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const pose = ref(null);
        const selectedOption = ref("model");
        const recommendedPoses = ref([]);
        const swiperModules = [Navigation, Pagination];

        const translateLevel = (level) => {
            const levelMap = {
                'Beginner': 'Cơ bản',
                'Intermediate': 'Trung cấp',
                'Beginner to Intermediate': 'Cơ bản đến Trung cấp',
                'Intermediate to Advanced': 'Trung cấp đến Nâng cao'
            };
            return levelMap[level] || level;
        };

        const currentEmbedUrl = computed(() => {
            if (!pose.value) return "";
            return selectedOption.value === "model" ? pose.value.embeddedUrl : pose.value.videoUrl;
        });

        const selectOption = (option) => {
            selectedOption.value = option;
        };

        const loadPoseDetails = async (id) => {
            pose.value = null;
            try {
                const response = await getPagedYogaPoses({ Id: id });
                if (response.items && response.items.length > 0) {
                    pose.value = response.items[0];
                    window.scrollTo(0, 0);
                }
            } catch (error) {
                console.error("Error loading pose details:", error);
            }
        };

        const loadRecommendedPoses = async () => {
            try {
                const res = await getRecommendationPoses();
                recommendedPoses.value = res || [];
            } catch (error) {
                console.error("Error fetching recommended poses:", error);
            }
        };

        const navigateToPose = (id) => {
            if (route.params.id === id) {
                loadPoseDetails(id);
            } else {
                router.push({
                    name: 'YogaPoseDetails',
                    params: { id: id }
                });
            }
        };

        watch(
            () => route.params.id,
            (newId) => {
                if (newId) {
                    loadPoseDetails(newId);
                }
            }
        );

        onMounted(() => {
            loadPoseDetails(route.params.id);
            loadRecommendedPoses();
        });

        return {
            pose,
            selectedOption,
            currentEmbedUrl,
            selectOption,
            recommendedPoses,
            swiperModules,
            navigateToPose,
            translateLevel
        };
    }
};
</script>

<style scoped>
.pose-details {
    margin: 0 auto;
    padding: 0 15px;
}

iframe {
    width: 100%;
    height: 600px;
    border: none;
}

.embed-responsive {
    border-radius: 5px;
}

.btn.active {
    background-color: #6c757d;
    color: white;
}

.mr-1 {
    margin-right: 0.25rem;
}

.mr-2 {
    margin-right: 0.5rem;
}

.pose-details-info {
    max-width: 100%;
    margin: 0 auto;
}

.card {
    border-radius: 10px;
    border: none;
}

.fw-bold {
    font-weight: bold;
}

.text-muted {
    font-size: 1rem;
    line-height: 1.6;
}

.disclaimer {
    font-style: italic;
    font-size: 0.9rem;
}

.recommended-swiper {
    padding-bottom: 2rem;
    margin-bottom: 1rem;
}

.swiper-button-next,
.swiper-button-prev {
    color: #6c757d;
    font-weight: bold;
    font-size: 1.2rem;
}

.swiper-button-next::after,
.swiper-button-prev::after {
    font-weight: bold;
    font-size: 22px;
}

.swiper-pagination-bullet-active {
    background: #6c757d;
}

:deep(.swiper-pagination) {
    bottom: 0 !important;
    margin-bottom: 0.1rem;
}

.pose-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.pose-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>