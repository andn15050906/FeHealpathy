<template>
    <v-stepper-vertical v-model="currentPhaseIndex">
        <v-stepper-vertical-item v-for="(step, index) in steps" :key="step.value" :complete="step.value > currentPhaseIndex"
            :subtitle="step.subtitle" :title="step.title" :value="step.value"
            :hide-actions="true">
            {{ step.content }}
            <v-btn @click="goTo(step.reference)">Follow step</v-btn>
            <!--<v-stepper-actions :disabled="false" @click:next="step=step+1" @click:prev="step=step-1"></v-stepper-actions>-->
        </v-stepper-vertical-item>
    </v-stepper-vertical>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentRoadmapWithProgress } from '@/scripts/api/services/roadmapService';

const router = useRouter();
const personalRoadmap = ref({});
const currentPhaseIndex = ref(0);
const steps = ref([
    {
        value: `${currentPhaseIndex.value}`,
        title: '...',
        reference: "..."
    }
])

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
    return "/practice";
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
</style>