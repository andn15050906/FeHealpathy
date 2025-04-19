<template>
    <GlowingCard class="excercise-card" justify="unset" padding="10px">
        <div style="flex-grow: 1;">
            <div class="excercise-thumbnail">
                <RouterLink :to="`/yoga/${excercise.id}`">
                    <img :src="excercise.thumpUrl" :alt="excercise.title">
                </RouterLink>
                <!--<span class="duration">{{ excercise.duration }}</span>-->
                <span class="level-badge">{{ excercise.level }}</span>
            </div>
            <p class="excercise-title">{{ excercise.name }}</p>
        </div>
        <!--<div>
            <span class="instructor">{{ excercise.instructor }}</span>
            <span class="rating">
                <span v-for="n in 5" :key="n" class="star">★</span>
                <span class="rating-count">({{ excercise.ratingCount }})</span>
            </span>
        </div>-->
    </GlowingCard>
</template>


<script setup>
import GlowingCard from '@/components/Common/GlowingCard.vue';

const props = defineProps({
    excercise: {
        type: Object
    }
});
</script>

<style scoped>
.excercise-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
}


.excercise-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    width: 100%;
}

.excercise-thumbnail img {
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

.excercise-info {
    padding: 15px;
}

.excercise-title {
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

.star {
    font-size: 12px;
    color: gold;
}

.rating-count {
    color: #666;
    font-size: 12px;
}
</style>