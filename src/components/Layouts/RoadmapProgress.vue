<template>
    <!-- <v-stepper-vertical v-if="steps.length" v-model="currentPhaseIndex">
        <v-stepper-vertical-item v-for="(step, index) in steps" :key="step.value" :complete="step.value < currentPhaseIndex"
            :subtitle="step.subtitle" :title="step.title" :value="index + 1" :hide-actions="true"
            :class="step.value < currentPhaseIndex ? 'completed-step' : step.value == currentPhaseIndex ? 'current-step' : 'locked-step'">
            {{ step.content }}
            <v-btn :class="isFollowBtnGlowing ? 'glowing-btn' : ''" @click="goTo(step.reference, index == steps.length - 1)">
                {{ index != steps.length - 1 ? text.FollowStep : text.NewRoadmap }}
            </v-btn>
            <v-stepper-actions :disabled="false" @click:next="step=step+1" @click:prev="step=step-1"></v-stepper-actions>
        </v-stepper-vertical-item>
    </v-stepper-vertical>
    <div v-else-if="loading"></div>
    <v-card v-else>
        <v-card-title class="d-flex align-center title-section">
            <i class="fas fa-exclamation-triangle text-warning mr-2"></i>
            <span class="sidebar-title" @click="goTo('', true)">{{ text.SetUpFirst }}</span>
        </v-card-title>
    </v-card> -->
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentRoadmapWithProgress } from '@/scripts/api/services/roadmapService';

const router = useRouter();
const personalRoadmap = ref({});
const loading = ref(true);
const currentPhaseIndex = ref(1);
const isFollowBtnGlowing = ref(false);
const steps = ref([]);
const text = {
    FollowStep: "Tiếp tục",
    NewRoadmap: 'Bắt đầu hành trình mới',
    SetUpFirst: "Bạn chưa có lộ trình, vui lòng thiết lập lộ trình trước."
}

onBeforeMount(async () => {
    await fetchPersonalRoadmap();
    if (router.currentRoute.value.path == '/')
        isFollowBtnGlowing.value = true;
})

watch(useRoute(), () => {
    isFollowBtnGlowing.value = router.currentRoute.value.path == '/';
});

function goTo(reference, isNewRoadmap) {
    router.push({ path: isNewRoadmap ? '/setting-up' : reference })
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
    loading.value = true;
    personalRoadmap.value = await getCurrentRoadmapWithProgress();
    steps.value = personalRoadmap.value?.phases?.sort((a, b) => a.index - b.index).map((_, index) => {
        if (personalRoadmap.value.currentPhase?.id == _.id)
            currentPhaseIndex.value = index + 1;
        return {
            value: `${index + 1}`,
            title: _.title,
            reference: getReference(_)
        }
    }) ?? [];

    if (steps.value.length > 0) {
        steps.value.push({
            value: `${personalRoadmap.value.phases.length + 1}`,
            title: 'Kết thúc lộ trình',
            reference: getReference()
        })
    }
    loading.value = false;

    if (personalRoadmap.value?.isCompleted)
        currentPhaseIndex.value = personalRoadmap.value.phases.length + 1;
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
.v-expansion-panels {
    background-color: #ffffff;
}
.v-expansion-panel {
    background-color: unset;
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
    cursor: pointer;
}
.completed-step {
    background-color: rgba(0, 123, 255, 0.15) !important;
}
.current-step {
    background-color: rgba(40, 167, 69, 0.15) !important;
}
.glowing-btn {
    animation: glow 1.5s infinite alternate, scale 1.5s infinite alternate;
}

@keyframes glow {
    0% {
        box-shadow: 0 0 20px rgba(0, 123, 255, 0.8);
    }
    100% {
        box-shadow: 0 0 40px rgba(0, 123, 255, 1);
    }
}

@keyframes scale {
    0% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}
</style>