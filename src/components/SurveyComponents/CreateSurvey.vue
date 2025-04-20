<template>
    <div class="container my-5">
        <h1 class="text-center mb-4">Tạo khảo sát từ đầu vào</h1>

        <div class="card mb-4">
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Tên khảo sát *</label>
                    <input v-model="survey.name" type="text" class="form-control" placeholder="Nhập tên khảo sát" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Mô tả *</label>
                    <textarea v-model="survey.description" class="form-control" rows="3"
                        placeholder="Nhập mô tả khảo sát"></textarea>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <label class="form-label">Tải lên tệp câu hỏi JSON</label>
                <input type="file" class="form-control" @change="handleFileUpload" accept="application/json" />
            </div>
        </div>

        <div v-if="questions.length" class="mb-4">
            <div v-for="(question, questionIndex) in questions" :key="questionIndex" class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h2 class="h5 mb-0">Câu hỏi {{ questionIndex + 1 }}</h2>
                    <button class="btn btn-danger btn-sm" @click="removeQuestion(questionIndex)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Nội dung câu hỏi *</label>
                        <input v-model="question.content" type="text" class="form-control"
                            placeholder="Nhập nội dung câu hỏi" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Giải thích *</label>
                        <input v-model="question.explanation" type="text" class="form-control"
                            placeholder="Nhập giải thích" />
                    </div>
                    <div class="mb-3">
                        <h3 class="h6">Câu trả lời</h3>
                        <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex"
                            class="row align-items-center mb-1">
                            <div class="col-md-10">
                                <input v-model="answer.content" type="text" class="form-control"
                                    :placeholder="'Câu trả lời ' + (answerIndex + 1)" />
                            </div>
                            <div class="col-md-2 text-end">
                                <button class="btn btn-danger btn-sm" @click="removeAnswer(questionIndex, answerIndex)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" @click.prevent="addAnswer(questionIndex)">
                            Thêm câu trả lời
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-3 text-end">
            <button class="btn btn-primary" @click="addQuestion">
                Thêm câu hỏi mới
            </button>
        </div>

        <div class="text-end">
            <button class="btn btn-success" :disabled="isLoading" @click="saveSurvey">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"
                    aria-hidden="true"></span>
                Lưu khảo sát
            </button>
            <button class="btn btn-danger ms-2" @click="$emit('cancel')">
                Hủy bỏ
            </button>
        </div>
    </div>

    <div class="horizontal-line">
        <div class="line"></div>
        <span class="or-text">OR</span>
        <div class="line"></div>
    </div>

    <div class="container my-5">
        <h1 class="text-center mb-4">Tải khảo sát từ bảng có cấu trúc</h1>
        <input type="file" class="form-control" @change="handleSheetUpload" accept=".xls,.xlsx" />
        <div class="text-end">
            <button class="btn btn-success" :disabled="isLoading" @click="importSurvey">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"
                    aria-hidden="true"></span>
                Tải khảo sát
            </button>
            <button class="btn btn-danger ms-2" @click="$emit('cancel')">
                Hủy bỏ
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { createSurvey, createSurveyFromSheet } from "../../scripts/api/services/surveysService";

const emits = defineEmits(["cancel", "surveyCreated"]);

const survey = ref({
    name: "",
    description: "",
});

const questions = ref([
    {
        content: "",
        explanation: "",
        answers: [{ content: "" }],
    },
]);
const importedSheet = ref(null);

const isLoading = ref(false);
const dummySurveyId = "00000000-0000-0000-0000-000000000000";

function handleSheetUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    importedSheet.value = file;
}

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
            console.error("Lỗi khi phân tích tệp JSON:", error);
        }
    };
    reader.readAsText(file);
}

function addQuestion() {
    questions.value.push({
        content: "",
        explanation: "",
        answers: [{ content: "" }],
    });
}

function removeQuestion(index) {
    questions.value.splice(index, 1);
}

function addAnswer(questionIndex) {
    questions.value[questionIndex].answers.push({ content: "" });
}

function removeAnswer(questionIndex, answerIndex) {
    questions.value[questionIndex].answers.splice(answerIndex, 1);
}

async function saveSurvey() {
    isLoading.value = true;
    try {
        const transformedQuestions = questions.value.map((q) => ({
            surveyId: dummySurveyId,
            content: q.content,
            explanation: q.explanation,
            answers: q.answers.map((a) => ({ content: a.content })),
        }));
        const payload = {
            name: survey.value.name,
            description: survey.value.description,
            questions: transformedQuestions,
        };
        const response = await createSurvey(payload);
        emits("surveyCreated");
    } catch (error) {
        console.error("Lỗi khi lưu khảo sát:", error);
    } finally {
        isLoading.value = false;
    }
}
async function importSurvey() {
    console.log(importedSheet.value);

    isLoading.value = true;
    try {
        await createSurveyFromSheet(importedSheet);
        emits("surveyCreated");
    } catch (error) {
        console.error("Lỗi khi lưu khảo sát:", error);
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.horizontal-line {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
}

.line {
    flex-grow: 1;
    height: 1px;
    background-color: #000;
}

.or-text {
    padding: 0 10px;
    font-weight: bold;
}
</style>