<template>
    <div class="course-card shadow h-100">
        <div class="course-thumbnail position-relative">
            <RouterLink :to="`/courses/${course.id}`">
                <img :src="course.thumbUrl" alt="" class="img-fluid w-100 h-100"
                    :onError="(e) => e.target.style.display = 'none'">
                <div v-if="!course.thumbUrl" class="default-thumbnail"
                    style="background-image: url(/assets/images/10.jpg);"></div>
            </RouterLink>
            <span class="level">{{ getLevelText(course.level) }}</span>
            <span v-if="course.discount > 0" class="discount-badge">-{{ Math.floor(course.discount * 100) }}%</span>
        </div>
        <div class="course-content p-3 d-flex flex-column">
            <h3 class="course-title mb-2">{{ course.title }}</h3>
            <div class="course-meta mt-auto">
                <div class="instructor-info mb-2">
                    <span class="instructor">{{ course.creator?.fullName }}</span>
                    <p class="course-date m-0">{{ formatDate(course.creationTime) }}</p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="rating d-flex align-items-center">
                        <div class="stars">
                            <i v-if="course.ratingCount > 0"
                                v-for="n in Math.ceil(course.totalRating / course.ratingCount)" :key="n"
                                class="fa fa-star" aria-hidden="true"></i>
                        </div>
                        <span class="rating-text ms-2">
                            <span v-if="course.ratingCount > 0">({{ course.ratingCount }})</span>
                            <span v-else>Chưa có đánh giá</span>
                        </span>
                    </div>
                    <div class="price-container">
                        <span v-if="course.discount > 0" class="original-price">{{ formatPriceVND(course.price)
                            }}</span>
                        <span class="final-price">{{ displayPrice(calculateFinalPrice(course)) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
    course: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

const formatDate = (dateString) => {
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
        console.error("Lỗi định dạng ngày:", error);
        return dateString;
    }
};

const getLevelText = (level) => {
    if (level === 0) return "Mới bắt đầu";
    if (level === 1) return "Trung cấp";
    if (level === 2) return "Nâng cao";
    return "Unknown";
};

function isOnDiscount(course) {
    return course.discount > 0 && new Date(course.discountExpiry) > new Date();
}

function calculateFinalPrice(course) {
    if (course.discount > 0) {
        return course.price * (1 - course.discount);
    }
    return course.price;
}

function formatPriceVND(price) {
    return price.toLocaleString() + ' VND';
}

function displayPrice(price) {
    if (price === 0) {
        return 'Miễn phí';
    }
    return formatPriceVND(price);
}

function formatPrice(price) {
    return price.toLocaleString();
}
</script>

<style scoped>
.course-card {
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    transition: transform 0.3s, box-shadow 0.3s;
    height: 320px;
    display: flex;
    flex-direction: column;
}

.course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.course-thumbnail {
    height: 160px;
    overflow: hidden;
}

.course-thumbnail img,
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

.course-thumbnail:hover img,
.course-thumbnail:hover .default-thumbnail {
    transform: scale(1.05);
}

.level {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.discount-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #e74c3c;
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.course-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.course-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.course-meta {
    margin-top: auto;
}

.instructor-info {
    display: flex;
    flex-direction: column;
}

.instructor {
    font-size: 14px;
    color: #34495e;
    font-weight: 500;
}

.course-date {
    font-size: 13px;
    color: #7f8c8d;
}

.rating {
    margin-top: 5px;
}

.fa-star {
    color: #f1c40f;
    font-size: 14px;
    margin-right: 1px;
}

.rating-text {
    font-size: 13px;
    color: #7f8c8d;
}

.price-container {
    text-align: right;
}

.original-price {
    text-decoration: line-through;
    color: #95a5a6;
    font-size: 12px;
    margin-right: 5px;
}

.final-price {
    color: #e74c3c;
    font-weight: 600;
    font-size: 14px;
}
</style>