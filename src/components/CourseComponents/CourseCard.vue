<template>
    <GlowingCard class="course-card" justify="unset" padding="10px">
        <div style="flex-grow: 1;">
            <div class="course-thumbnail">
                <RouterLink :to="`/courses/${course.id}`">
                    <img :src="course.thumbUrl" :alt="course.title">
                </RouterLink>
                <span class="duration">{{ course.duration }}</span>
                <!--<span class="level-badge">{{ course.level }}</span>-->
                <span v-if="course.discount > 0" class="level-badge">-{{ course.discount }}%</span>
            </div>
            <p class="course-title">{{ course.title }}</p>
        </div>
        <div>
            <span class="instructor">{{ course.creator.fullName }}</span>
            <p class="course-date">{{ formatDate(course.creationTime) }}</p>
            <span class="rating">
                <i v-if="course.ratingCount > 0" :key="n" class="fa fa-star co-or"
                    v-for="n in Math.ceil(course.totalRating / course.ratingCount)"
                    aria-hidden="true"></i>

                <span class="rating-text">
                    <span v-if="course.ratingCount > 0">
                    ({{ course.ratingCount }})
                    </span>
                    <span v-else>No rating yet</span>
                </span>

                <!--<span v-for="n in 5" :key="n" class="star">★</span>
                <span class="rating-count">({{ course.ratingCount }})</span>-->
            </span>
        </div>
    </GlowingCard>
</template>


<script setup>
import GlowingCard from '@/components/Common/GlowingCard.vue';


const props = defineProps({
    course: {
        type: Object
    }
});

console.log(props.course);

const formatDate = (dateString) => {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
function isOnDiscount(course) {
    return course.discount > 0 && new Date(course.discountExpiry) > new Date();
}

function formatPrice(price) {
    return price.toLocaleString();
}
</script>

<style scoped>
.course-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 320px;
}

.course-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    width: 100%;
}

.course-thumbnail img {
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

.course-info {
    padding: 15px;
}

.course-title {
    font-size: 16px;
    margin-bottom: 8px;
    color: #000;
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


.instructor {
    font-size: 14px;
    color: #666;
}
.course-date {
    font-size: 14px;
    color: #666;
}
</style>