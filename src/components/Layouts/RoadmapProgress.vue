<template>
    <v-stepper-vertical v-if="steps.length" v-model="currentPhaseIndex">
        <v-stepper-vertical-item v-for="(step, index) in steps" :key="step.value" :complete="step.value > currentPhaseIndex"
            :subtitle="step.subtitle" :title="step.title" :value="step.value"
            :hide-actions="true">
            {{ step.content }}
            <v-btn @click="goTo(step.reference)">{{ text.FollowStep }}</v-btn>
            <!--<v-stepper-actions :disabled="false" @click:next="step=step+1" @click:prev="step=step-1"></v-stepper-actions>-->
        </v-stepper-vertical-item>
    </v-stepper-vertical>
    <v-card v-else>
        <v-card-title class="d-flex align-center title-section">
            <i class="fas fa-exclamation-triangle text-warning mr-2"></i>
            <span class="sidebar-title">{{ text.SetUpFirst }}</span>
        </v-card-title>
    </v-card>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentRoadmapWithProgress } from '@/scripts/api/services/roadmapService';

const router = useRouter();
const personalRoadmap = ref({});
const currentPhaseIndex = ref(0);
const steps = ref([]);
const text = {
    FollowStep: "Follow step",
    SetUpFirst: "You have no roadmap, please set up a roadmap first."
}

onBeforeMount(async () => {
    await fetchPersonalRoadmap();
})

function goTo(reference) {
    router.push({ path: reference })
}

/*function goToNextStep(index) {
    if (index < steps.value.length - 1) {
        currentStep.value = index + 1;
    }
}

function goToPreviousStep(index) {
    if (index > 0) {
        currentStep.value = index - 1;
    }
}*/

function goToStep(index) {
    currentPhaseIndex.value = index;
}

async function fetchPersonalRoadmap() {
    personalRoadmap.value = await getCurrentRoadmapWithProgress();
    steps.value = personalRoadmap.value.phases?.sort((a, b) => a.index - b.index).map((_, index) => {
        if (personalRoadmap.value.currentPhase.id == _.id)
            currentPhaseIndex.value = index;
        return {
            value: `${index}`,
            title: _.title,
            reference: getReference(_)
        }
    });
    goToStep(currentPhaseIndex.value);
}

function getReference(phase) {
    return "/progress";
}

function getPersonalRoadmap() {
    return new Promise((resolve) => {
        const attempt = () => {
            if (personalRoadmap.value.phases)
                resolve(personalRoadmap.value);
            else
                setTimeout(attempt, 100);
        }

        attempt();
    });
}

defineExpose({ getPersonalRoadmap, fetchPersonalRoadmap })
</script>

<style scoped>
.v-stepper {
    display: unset;
    z-index: unset;
}
.v-expansion-panel {
    border-radius: 0;
}
.v-expansion-panel-title {
    overflow: hidden;
}
.v-stepper-actions {
    display: none;
}
.v-card {
    margin: 0;
}
.sidebar-title {
    text-wrap: auto;
    padding: 4px;
}
</style>