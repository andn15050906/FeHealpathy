<template>
    <div class="container mt-5">
        <h2 class="mb-4" style="font-weight: bold;">Các tư thế Yoga</h2>
        <div class="row">
            <div class="col-12">
                <div v-for="(pose, index) in yogaPoses" :key="index"
                    class="pose-row d-flex justify-content-between align-items-center mb-4 p-4 shadow-sm hover-row">
                    <div class="d-flex align-items-center">
                        <img :src="pose.thumpUrl" alt="Pose Thumbnail" class="pose-thumbnail mr-4"
                            v-if="pose.thumpUrl" />
                        <div>
                            <span class="pose-name">{{ pose.name }}</span>
                            <p class="pose-level">Mức: {{ translateLevel(pose.level) }}</p>
                        </div>
                    </div>
                    <router-link :to="{ name: 'YogaPoseDetails', params: { id: pose.id } }"
                        class="btn btn-outline-primary btn-lg">
                        Thực hành ngay <i class="fas fa-chevron-right ml-2"></i>
                    </router-link>
                </div>
            </div>
        </div>
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="goToPage" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getPagedYogaPoses } from "../../../scripts/api/services/yogaService";
import Pagination from "../../../components/Common/Pagination.vue";

export default {
    name: "YogaPoses",
    components: { Pagination },
    setup() {
        const yogaPoses = ref([]);
        const currentPage = ref(1);
        const totalPages = ref(1);

        const translateLevel = (level) => {
            const levelMap = {
                'Beginner': 'Cơ bản',
                'Intermediate': 'Trung cấp',
                'Beginner to Intermediate': 'Cơ bản đến Trung cấp',
                'Intermediate to Advanced': 'Trung cấp đến Nâng cao'
            };
            return levelMap[level] || level;
        };

        const loadYogaPoses = async () => {
            try {
                const response = await getPagedYogaPoses({ pageIndex: currentPage.value - 1 , pageSize: 10});
                yogaPoses.value = response.items;
                totalPages.value = response.pageCount;
            } catch (error) {
                console.error("Lỗi khi tải bài tập yoga:", error);
            }
        };

        const goToPage = (page) => {
            currentPage.value = page;
            loadYogaPoses();
        };

        onMounted(() => {
            loadYogaPoses();
        });

        return { 
            yogaPoses, 
            currentPage, 
            totalPages, 
            goToPage,
            translateLevel 
        };
    }
};
</script>

<style scoped>
.pose-row {
    background-color: #fff;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    min-height: 100px;
    padding: 1.5rem;
}

.hover-row:hover {
    background-color: #f8f9fa;
    transform: translateY(-3px);
}

.pose-thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
}

.pose-name {
    font-size: 1.8rem;
    font-weight: bold;
}

.pose-level {
    font-size: 1.1rem;
    color: #6c757d;
}

.btn-lg {
    font-size: 1.2rem;
    padding: 10px 20px;
}

.mr-4 {
    margin-right: 1.5rem;
}

.ml-2 {
    margin-left: 0.5rem;
}
</style>
