<template>
    <div class="survey-container">
        <h1 class="title">Survey Editor</h1>
        <div class="question-list">
            <div v-for="(question, questionIndex) in questions" :key="questionIndex" class="question-card">
                <button class="btn-icon delete-question-btn" @click="removeQuestion(questionIndex)">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <h2 class="section-title">Question {{ questionIndex + 1 }}</h2>
                <!-- Question Content -->
                <v-form class="form">
                    <div class="form-input">
                        <label class="form-label">Question Content *</label>
                        <input v-model="question.content" class="input-field" />
                    </div>
                    <div class="form-input">
                        <label class="form-label">Explanation *</label>
                        <input v-model="question.explanation" class="input-field" />
                    </div>

                    <!-- Answers Section -->
                    <div class="answers-section">
                        <h3 class="answers-title">Answers</h3>
                        <p class="instructions">
                            Provide possible answers and mark the correct one(s).
                        </p>
                        <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="answer-row">
                            <v-text-field v-model="answer.content" label="Answer Content" outlined
                                :placeholder="'Answer ' + (answerIndex + 1)" class="answer-input" />
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="answer.isCorrect" class="checkbox-input">
                                Correct Answer
                            </label>
                            <button class="btn-icon" @click="removeAnswer(questionIndex, answerIndex)">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                        <button class="btn-gray" @click.prevent="addAnswer(questionIndex)">
                            Add Answer
                        </button>
                    </div>
                </v-form>
            </div>
        </div>

        <!-- Add New Question -->
        <button class="btn-gray add-question-btn" @click="addQuestion">
            Add New Question
        </button>

        <!-- Save All Questions -->
        <div class="form-footer">
            <button type="submit" class="btn-primary form-button" :loading="isLoading" @click="saveAllQuestions">
                Save Survey
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Fake data
const fakeQuestions = [
  {
    content: 'What is Vue.js?',
    explanation: 'Explain what Vue.js is in brief.',
    answers: [
      { content: 'A JavaScript framework', isCorrect: true },
      { content: 'An HTML preprocessor', isCorrect: false },
      { content: 'A CSS library', isCorrect: false },
      { content: 'A database', isCorrect: false },
    ],
  },
  {
    content: 'Which company developed Vue.js?',
    explanation: 'Identify the company which developed Vue.js.',
    answers: [
      { content: 'Google', isCorrect: false },
      { content: 'Microsoft', isCorrect: false },
      { content: 'Facebook', isCorrect: false },
      { content: 'Evan You (individual developer)', isCorrect: true },
    ],
  },
];

// Initialize questions with fake data
const questions = ref([]);
const isLoading = ref(false);

onMounted(() => {
  questions.value = fakeQuestions;
});

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

async function saveAllQuestions() {
  isLoading.value = true;
  try {
    const payload = questions.value.map((q) => ({
      content: q.content,
      explanation: q.explanation,
      answers: q.answers,
    }));
  } catch (error) {
    console.error('Error saving survey:', error);
  } finally {
    isLoading.value = false;
  }
}

</script>

<style scoped>
.survey-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: "Roboto", sans-serif;
}

.title {
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.question-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.btn-gray {
    background-color: #ccc;
    color: #333;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.checkbox-label {
    display: flex;
    align-items: center;
    margin-left: auto;
    font-size: 14px;
    color: #666;
}

.checkbox-input {
    margin-right: 5px;
}

.btn-gray:hover {
    background-color: #bbb;
}

.add-question-btn {
    margin-top: 20px;
    display: block;
    margin-left: auto;
}

.question-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #f9f9f9;
    position: relative;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
}

.answers-title {
    font-size: 18px;
    font-weight: 500;
}

.instructions {
    font-size: 14px;
    color: #666;
}

.answer-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.answer-input {
    flex: 1;
}

.checkbox {
    margin-left: auto;
}

.delete-question-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
}

.btn-icon {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    color: #666;
    font-size: 18px;
}

.btn-icon:hover {
    color: #000;
}

.btn-primary {
    background-color: #3f51b5;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-primary:hover {
    background-color: #303f9f;
}

.form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
}

.form-button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background-color: #3f51b5;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.form-button:hover {
    background-color: #303f9f;
}

.form-button:disabled {
    background-color: #c5cae9;
    color: #fff;
}

.input-field {
    border: none;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    outline: none;
}

.input-field:focus {
    border-bottom-color: #3f51b5;
}

.form-input {
    margin-bottom: 20px;
}
</style>
