<template>
    <div class="container my-5">
        <h1 class="text-center mb-4">Edit Survey</h1>

        <div class="card mb-4">
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Survey Name *</label>
                    <input v-model="survey.name" type="text" class="form-control" placeholder="Enter survey name" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Description *</label>
                    <textarea v-model="survey.description" class="form-control" rows="3"
                        placeholder="Enter survey description"></textarea>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <label class="form-label">Upload Questions JSON File</label>
                <input type="file" class="form-control" @change="handleFileUpload" accept="application/json" />
            </div>
        </div>

        <div v-if="questions.length" class="mb-4">
            <div v-for="(question, questionIndex) in questions" :key="questionIndex" class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h2 class="h5 mb-0">Question {{ questionIndex + 1 }}</h2>
                    <button class="btn btn-danger btn-sm" @click="removeQuestion(questionIndex)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Question Content *</label>
                        <input v-model="question.content" type="text" class="form-control"
                            placeholder="Enter question content" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Explanation *</label>
                        <input v-model="question.explanation" type="text" class="form-control"
                            placeholder="Enter explanation" />
                    </div>
                    <div class="mb-3">
                        <h3 class="h6">Answers</h3>
                        <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex"
                            class="row align-items-center mb-1">
                            <div class="col-md-10">
                                <input v-model="answer.content" type="text" class="form-control"
                                    :placeholder="'Answer ' + (answerIndex + 1)" />
                            </div>
                            <div class="col-md-2 text-end">
                                <button class="btn btn-danger btn-sm" @click="removeAnswer(questionIndex, answerIndex)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" @click.prevent="addAnswer(questionIndex)">
                            Add Answer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-3 text-end">
            <button class="btn btn-secondary" @click="addQuestion">
                Add New Question
            </button>
        </div>

        <div class="text-end">
            <button class="btn btn-primary" :disabled="isLoading" @click="updateSurveyData">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"
                    aria-hidden="true"></span>
                Save Survey
            </button>
            <button class="btn btn-secondary ms-2" @click="$emit('cancel')">
                Cancel
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue';
import { updateSurvey } from '../../scripts/api/services/surveysService';

const emits = defineEmits(['cancel', 'surveyUpdated']);
const props = defineProps({
    surveyData: {
        type: Object,
        required: true,
    },
});

const survey = ref({
    name: props.surveyData.name,
    description: props.surveyData.description,
});
const questions = ref([]);
const preEditQuestions = ref([]);
const isLoading = ref(false);

onMounted(() => {
    if (props.surveyData.questions) {
        questions.value = JSON.parse(JSON.stringify(props.surveyData.questions));
        preEditQuestions.value = JSON.parse(JSON.stringify(props.surveyData.questions));
    }
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            if (Array.isArray(parsed)) {
                questions.value = parsed;
            }
        } catch (error) {
            console.error("Error parsing JSON file:", error);
        }
    };
    reader.readAsText(file);
}

function addQuestion() {
    questions.value.push({
        content: '',
        explanation: '',
        answers: [{ content: '', isCorrect: false }],
    });
}

function removeQuestion(index) {
    questions.value.splice(index, 1);
}

function addAnswer(questionIndex) {
    questions.value[questionIndex].answers.push({ content: '', isCorrect: false });
}

function removeAnswer(questionIndex, answerIndex) {
    questions.value[questionIndex].answers.splice(answerIndex, 1);
}

async function updateSurveyData() {
    isLoading.value = true;
    try {
        const addedQuestions = questions.value.filter(q => !q.id).map(q => ({
            surveyId: props.surveyData.id,
            content: q.content,
            explanation: q.explanation,
            answers: q.answers.map(a => ({ content: a.content })),
        }));
        const removedQuestions = preEditQuestions.value
            .filter(q => !questions.value.find(cq => cq.id === q.id))
            .map(q => q.id);
        const payload = {
            id: props.surveyData.id,
            name: survey.value.name,
            description: survey.value.description,
            addedQuestions: addedQuestions,
            removedQuestions: removedQuestions,
        };
        const response = await updateSurvey(payload);
        emits("surveyUpdated");
    } catch (error) {
        console.error("Error updating survey:", error);
    } finally {
        isLoading.value = false;
    }
}
</script>