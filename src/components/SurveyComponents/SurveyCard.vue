<template>
    <div class="survey-card-grid-item">
        <GlowingCard class="survey-card" justify="center" padding="20px">
            <div class="survey-thumbnail">
                <img :src="survey.icon" :alt="survey.name" />
            </div>
            <h3 class="survey-title mt-3">{{ survey.name }}</h3>
        </GlowingCard>
        <p class="survey-description mt-2">{{ survey.description }}</p>
    </div>
</template>

<script setup>
import GlowingCard from '@/components/Common/GlowingCard.vue';

const props = defineProps({
    survey: Object
});
</script>

<style scoped>
.survey-card-grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.survey-card {
    width: 100%;
    max-width: 300px;
    text-align: center;
    padding: 20px;
}

.survey-thumbnail {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.survey-thumbnail img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.survey-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.survey-description {
    font-size: 1.2rem;
    color: #555;
    font-weight: 600;
    text-align: center;
    margin-top: 0.5rem;
}
</style>