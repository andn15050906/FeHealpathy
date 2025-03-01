<template>
    <v-stepper-vertical>
        <template v-slot:default="{ step }">
            <v-stepper-vertical-item v-for="(step, index) in steps" :key="step.value" :complete="step > index"
                :subtitle="step.subtitle" :title="step.title" :value="step.value"
                :hide-actions="true">
                {{ step.content }}
                <v-btn @click="goTo(step.reference)">Follow step</v-btn>
                <!--<v-stepper-vertical-actions>
                    <v-btn @click="goTo(step)">Follow step</v-btn>
                </v-stepper-vertical-actions>-->
            </v-stepper-vertical-item>
        </template>
    </v-stepper-vertical>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const currentStep = ref(2);
const router = useRouter();

const steps = ref([
    {
        value: '1',
        title: 'Nhận diện vấn đề',
        reference: "/setting-up"
        /*subtitle: 'Nhận diện vấn đề',
        content: `Nhận thức về vấn đề của mình và xây dựng động lực thay đổi.`*/
    },
    {
        value: '2',
        title: 'Ổn định tinh thần',
        reference: "/practice"
        /*subtitle: 'Ổn định tinh thần',
        content: `Áp dụng các kỹ thuật thư giãn và Xây dựng thói quen kiểm soát cảm xúc.`*/
    },
    {
        value: '3',
        title: 'Xây dựng hành vi tích cực',
        reference: "/habit-tracking"
        /*subtitle: 'Xây dựng hành vi tích cực',
        content: `Thiết lập các thói quen nhỏ, tạo và duy trì mục tiêu tích cực.`*/
    },
    {
        value: '4',
        title: 'Xây dựng kĩ năng',
        reference: "/courses"
        /*subtitle: 'Xây dựng kĩ năng',
        content: `Phát triển kỹ năng mềm và xây dựng mối quan hệ lành mạnh.`*/
    },
    {
        value: '5',
        title: 'Củng cố & duy trì',
        reference: "/statistics/user-activity"
        /*subtitle: 'Củng cố & duy trì',
        content: `Định kỳ đánh giá tiến độ và duy trì động lực.`*/
    }
]);

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
</script>

<style scoped>
.v-stepper {
    display: unset;
    z-index: unset;
}
</style>