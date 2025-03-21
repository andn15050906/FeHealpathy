<template>
    <v-stepper-vertical>
        <v-stepper-vertical-item v-for="(step, index) in steps" :key="step.value" :complete="step.value > index"
            :subtitle="step.subtitle" :title="step.title" :value="step.value"
            :hide-actions="true">
            {{ step.content }}
            <v-btn @click="goTo(step.reference)">Follow step</v-btn>
            <!--<v-stepper-vertical-actions>
                <v-btn @click="goTo(step)">Follow step</v-btn>
            </v-stepper-vertical-actions>-->
        </v-stepper-vertical-item>
    </v-stepper-vertical>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentRoadmapWithProgress } from '@/scripts/api/services/roadmapService';

const router = useRouter();
const personalRoadmap = ref({});
const steps = ref([
        {
            value: '0',
            title: '...',
            reference: "..."
        }
    ])

onBeforeMount(async () => {
    personalRoadmap.value = await getCurrentRoadmapWithProgress();
    steps.value = personalRoadmap.value.phases?.sort((a, b) => a.index - b.index).map((_, index) => {
        return {
            value: `${index}`,
            title: _.title,
            reference: "/practice"
        }
    });
    
    /*subtitle: 'Nhận diện vấn đề',
    content: `Nhận thức về vấn đề của mình và xây dựng động lực thay đổi.`*/
    /*subtitle: 'Ổn định tinh thần',
    content: `Áp dụng các kỹ thuật thư giãn và Xây dựng thói quen kiểm soát cảm xúc.`*/
    /*subtitle: 'Xây dựng hành vi tích cực',
    content: `Thiết lập các thói quen nhỏ, tạo và duy trì mục tiêu tích cực.`*/
    /*subtitle: 'Xây dựng kĩ năng',
    content: `Phát triển kỹ năng mềm và xây dựng mối quan hệ lành mạnh.`*/
    /*subtitle: 'Củng cố & duy trì',
    content: `Định kỳ đánh giá tiến độ và duy trì động lực.`*/
})

function goTo(reference) {
    console.log(reference);
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

defineExpose({ getPersonalRoadmap })
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
</style>