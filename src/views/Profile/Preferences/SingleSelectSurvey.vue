<template>
    <div>
        <h2 class="mb-5 text-black">{{ options.title }}</h2>
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="d-flex flex-column gap-3" style="width: 80%">
                <div v-for="(question, index) in options.survey.questions" :key="'input-' + index">
                    <div style="text-align: left">{{ question.content }}</div>
                    <select v-model="question.inputValue"
                        class="single-survey-select form-control rounded-pill border-primary">
                        <option
                            v-for="(answer, index) in question.answers.sort((a, b) => a.content.localeCompare(b.content))"
                            :key="'select-' + index" :value="answer.id">
                            {{ answer.content }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
            <GlowingButton primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100"
                @click="options.submitCallback">{{ submit }}</GlowingButton>
            <GlowingButton v-if="options.switchCallback" primaryColor="#bdc3c7" secondaryColor="#2c3e50"
                padding="4px 8px" class="w-100" @click="options.switchCallback">{{ skipForNow }}</GlowingButton>
        </div>
    </div>
</template>

<script>
import GlowingButton from '@/components/Common/GlowingButton.vue';
import { SurveyOptions } from './SurveyOptions';

export default {
    components: { GlowingButton },
    props: {
        options: {
            type: SurveyOptions
        }
    },
    data: function () {
        return {
            submit: "Submit",
            skipForNow: "Skip for now"
        }
    }
};
</script>

<style scoped>
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