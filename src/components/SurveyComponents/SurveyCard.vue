<template>
    <div class="survey-card-grid-item">
        <GlowingCard class="survey-card" justify="unset" padding="10px">
            <div style="flex-grow: 1; display: flex;">
                <div class="survey-thumbnail">
                    <img :src="survey.icon" :alt="survey.name">
                </div>
            </div>
            <h3 class="survey-title">{{ survey.name }}</h3>
        </GlowingCard>
        <h4 class="survey-description">{{ survey.description }}</h4>
    </div>
</template>


<script setup>
import GlowingCard from '@/components/Common/GlowingCard.vue';

const props = defineProps({
    survey: Object
});

console.log(props.survey);
</script>

<style scoped>
.survey-card-grid-item {
    display: flex;
    flex-direction: column;
}

.survey-card {
    display: flex;
    align-self: center;
}

.survey-thumbnail {
    position: relative;
    width: 100%;
    padding: 10px 30px;
}

.survey-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.survey-title {
    color: #000000;
}

.survey-description {
    padding: 6px 10px;
    text-align: center;
}
</style>