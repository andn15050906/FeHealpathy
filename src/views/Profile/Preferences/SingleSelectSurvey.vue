<template>
    <v-container class="quiz-background">
        <h1>{{ options.title }}</h1>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
            <v-row v-for="(question, index) in options.survey.questions" :key="index">
                <v-col>
                    <v-card>
                        <v-card-title>{{ question.content }}</v-card-title>
                        <v-card-text>
                            <!--<v-radio-group v-if="question.type === 'single-choice'" v-model="responses[index]"
                                :rules="[rules.required]">
                                <v-radio v-for="(option, i) in question.options" :key="i" :label="option"
                                    :value="option"></v-radio>
                            </v-radio-group>-->
                            <v-radio-group v-model="responses[index]">
                                <v-radio v-for="(answer, index) in question.answers.sort((a, b) => a.content.localeCompare(b.content))"
                                    :key="'select-' + index" :label="answer.content" :value="answer.id"></v-radio>
                            </v-radio-group>
                            <!--<v-text-field v-if="question.type === 'text'" v-model="responses[index]"
                                :rules="[rules.required]" label="Your answer"></v-text-field>-->
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <div class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
                <GlowingButton primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100"
                    :disabled="!valid" @click="options.submitCallback">{{ submit }}</GlowingButton>
                <GlowingButton v-if="options.switchCallback" primaryColor="#bdc3c7" secondaryColor="#2c3e50"
                    padding="4px 8px" class="w-100" @click="options.switchCallback">{{ skipForNow }}</GlowingButton>
            </div>
        </v-form>

        <v-alert v-if="submitted" type="success">Survey submitted successfully!</v-alert>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import GlowingButton from '@/components/Common/GlowingButton.vue';
import { SurveyOptions } from './SurveyOptions';

const props = defineProps({
    options: {
        type: SurveyOptions,
        required: true
    }
});

const submit = ref("Submit");
const skipForNow = ref("Skip for now");

const valid = ref(false)
const submitted = ref(false)
const responses = ref([])
/*const rules = {
    required: (value) => !!value || 'Required.',
}*/
</script>

<style scoped>
/*"--sjs-general-backcolor-dim": "" */
.quiz-background {
    background-color: rgba(230,255,252);
    padding: 40px 120px;
}

.text-black {
    color: black;
}

button.active {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
    opacity: 0.9;
}

.rounded-pill:hover:not(:focus) {
    background: rgba(0, 0, 0, 0.1);
}

.single-survey-select {
    padding: 8px 16px;
}
</style>