<template>
    <v-container :class="optionsRef.isTransparentStyle ? 'quiz-container' : 'quiz-container quiz-background'" :style="{padding: padding}">
        <v-card v-if="optionsRef.title" class="title-card">{{ optionsRef.title }}</v-card>
        <v-card v-if="optionsRef.isReadOnly && result">
            <v-card-title><h4>{{ text.result }}</h4></v-card-title>
            <v-card-text class="test-result">
                <p>{{ text.score }} <strong>{{ result.score }}</strong></p>
                <p v-for="(band) in result.bands">
                    {{ band.name }}: 
                    <span :class="`score-${band.ratingClass}`">{{ band.rating }}</span>
                </p>
            </v-card-text>
        </v-card>
        <div v-if="isSinglePage" class="progress mb-4" style="height: 30px;">
          <div class="progress-bar progress-bar-animated" role="progressbar" :style="{ width: progress + '%' }"
            aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div v-if="isSinglePage" class="question-list">
            <div v-for="(question, index) in optionsRef.survey.questions" :key="index"
                :class="{ 'question-item': true, 'answered': submission[index] != undefined, 'current': currentQuestionIndex == index }"
                @click="currentQuestionIndex = index">
                <span>{{ index + 1 }}</span>
            </div>
        </div>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
            <v-row v-for="(question, index) in optionsRef.survey.questions" :key="index">
                <v-col v-if="!isSinglePage || currentQuestionIndex == index">
                    <v-card>
                        <v-card-title>
                            <h5 v-if="isSinglePage">{{ text.currentQuestion }} {{ currentQuestionIndex + 1 }}:</h5>
                            <h5>{{ question.content }}</h5>
                        </v-card-title>
                        <v-card-text>
                            <v-radio-group v-model="submission[index]">
                                <v-radio v-for="(option, optionIndex) in question.answers.sort((a, b) => a.content.localeCompare(b.content))"
                                    :key="'select-' + optionIndex" :label="option.content" :value="option.id" :readonly="optionsRef.isReadOnly"
                                    :class="{ 'active-selection': submission[index] === option.id }"
                                    @change="answerChanged"></v-radio>
                            </v-radio-group>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <div v-if="isSinglePage" class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
                <GlowingButton @click="nextQuestion"
                    primaryColor="#bdc3c7" secondaryColor="#2c3e50" padding="4px 8px" class="w-100">{{ text.next }}</GlowingButton>
                <GlowingButton v-if="isValidToSubmit()" @click="submit"
                    primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100">{{ text.submit }}</GlowingButton>
            </div>
        </v-form>
        <div v-if="!isSinglePage && optionsRef.submitCallback" class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
            <GlowingButton @click="submit" :disabled="!valid"
                primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100">{{ text.submit }}</GlowingButton>
            <GlowingButton @click="optionsRef.switchCallback"
                primaryColor="#bdc3c7" secondaryColor="#2c3e50" padding="4px 8px" class="w-100">{{ text.skipForNow }}</GlowingButton>
        </div>
    <v-alert v-if="submitted" type="success">Survey submitted successfully!</v-alert>
    </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';
import GlowingButton from '@/components/Common/GlowingButton.vue';
import { SurveyOptions } from '@/scripts/types/SurveyOptions';

const props = defineProps({
    options: {
        type: SurveyOptions
    },
    padding: {
        type: String,
        default: '40px 200px'
    },
    isSinglePage: {
        type: Boolean,
        default: false
    }
});

const text = {
    result: "Kết Quả Kiểm Tra",
    score: "Điểm của bạn:",
    currentQuestion: "Câu hỏi",
    submit: "Gửi kết quả",
    next: "Câu kế tiếp",
    skipForNow: "Bỏ qua"
}

const optionsRef = ref(props.options);
const result = ref({});
const valid = ref(false)
const submitted = ref(false)
const submission = ref([])
const currentQuestionIndex = ref(0);
const progress = ref(0);

const nextQuestion = () => {
    currentQuestionIndex.value = currentQuestionIndex.value < optionsRef.value.survey.questions.length - 1
        ? currentQuestionIndex.value + 1
        : 0;
}
const answerChanged = () => {
    let answeredQuestions = submission.value.filter(answer => answer !== undefined).length;
    progress.value = (answeredQuestions / optionsRef.value.survey.questions.length) * 100;
}
const isValidToSubmit = () => {
    return Array.from(submission.value.filter(answer => answer !== undefined)).length
        == optionsRef.value.survey.questions.length;
}
const submit = () => {
    let questionsWithAnswer = submission.value.map((item, index) => {
        return {
            questionId: optionsRef.value.survey.questions[index].id,
            answerId: item
        }
    })
    optionsRef.value.submitCallback(questionsWithAnswer);
}

const resetSurvey = () => {
    submission.value = [];
    progress.value = 0;
    currentQuestionIndex.value = 0;
}

const setSurveyAndAnswers = (options, choices) => {
    let answerArr = [];
    let score = 0;
    optionsRef.value = options;
    optionsRef.value.survey.questions.forEach((question, index) => {
        let choice = choices.find(choice => choice.mcqQuestionId == question.id);
        if (choice) {
            answerArr[index] = choice.mcqAnswerId;
            let answer = question.answers.find(answer => answer.id == choice.mcqAnswerId)
            score += answer.score;
        }
    });
    submission.value = answerArr;

    // Sử dụng Set để lưu trữ các band name đã xử lý
    const processedBandNames = new Set();
    let matchingBands = [];

    for (let band of optionsRef.value.survey.bands) {
        if (band.minScore <= score && band.maxScore >= score) {
            const bandNameMapping = {
                'Depression': 'Trầm cảm',
                'Stress': 'Căng thẳng',
                'Anxiety': 'Lo âu',
            };

            const bandNameInVietnamese = bandNameMapping[band.bandName] || band.bandName;

            // Kiểm tra nếu band name này đã được xử lý
            if (!processedBandNames.has(bandNameInVietnamese)) {
                processedBandNames.add(bandNameInVietnamese);

                if (['normal', 'mild'].includes(band.bandRating.toLowerCase())) {
                    matchingBands.push({
                        name: bandNameInVietnamese,
                        rating: 'Tốt',
                        ratingClass: 'good'
                    });
                }
                else if (['moderate'].includes(band.bandRating.toLowerCase())) {
                    matchingBands.push({
                        name: bandNameInVietnamese,
                        rating: 'Trung bình',
                        ratingClass: 'average'
                    });
                }
                else if (['severe', 'examplely severe'].includes(band.bandRating.toLowerCase())) {
                    matchingBands.push({
                        name: bandNameInVietnamese,
                        rating: 'Tệ',
                        ratingClass: 'bad'
                    });
                }
            }
        }
    }

    result.value = {
        score: score,
        bands: matchingBands
    }
}

// do not update props
/*watch(() => props.options, (newValue, oldValue) => {
    optionsRef.value = newValue;
});*/

defineExpose({ resetSurvey, setSurveyAndAnswers })
</script>

<style>
.page-container:has(.quiz-container) {
    padding: 0 !important;
}

.page-container:has(.quiz-container) .container {
    padding: 0 !important;
}

.page-container:has(.quiz-container) .v-selection-control__wrapper {
    display: none !important;
}

.page-container:has(.quiz-container) .v-selection-control-group {
    /*flex-direction: row !important;*/
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.page-container:has(.quiz-container) .v-label--clickable {
    padding: 10px 40px !important;
    font-weight: bold;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.page-container:has(.quiz-container) .v-input__details {
    display: none;
}
</style>

<style scoped>
.text-black {
    color: black;
}

.quiz-background {
    background-image: radial-gradient(
        circle 369px at -2.9% 12.9%,
        rgba(247,234,163,1) 0%,
        rgba(236,180,238,0.56) 46.4%,
        rgba(163,203,247,1) 100.7%
    );
}

.test-result {
    font-size: 16px;
}

.title-card {
    padding: 10px;
    font-size: 24px;
    border-radius: 20px;
    text-align: center;
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

.container {
    padding: 0 !important;
}

/*.v-row {
    width: 100%;
}*/

.v-card-title {
    margin: 20px 0;
}

.score-good {
    color: green;
    font-weight: bold;
}

.score-average {
    color: gold;
    font-weight: bold;
}

.score-bad {
    color: red;
    font-weight: bold;
}

.v-radio {
    display: inline-block;
    margin: 5px 15px;
}

.active-selection {
    background-color: #ffdd33 !important;
    border-bottom: 4px solid #ff0000;
}

.v-selection-control {
    flex: 1 0 40%;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    background-color: rgba(102, 191, 57, 0.6);
    grid-area: unset;
}

.radio-active:checked {
    background-color: #007bff;
    color: white;
}

.v-radio .v-label:hover {
    background-color: #e0e0e0;
}

.question-list {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.question-item {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  background-color: #D3D3D3;
}

.question-item:hover {
  background-color: #e7f1ff;
}

.question-item.answered {
  background-color: rgba(102, 191, 57, 0.6);;
}

.question-item.current {
  background-color: #4CAF50 !important;
}
</style>