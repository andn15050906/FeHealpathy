<template>
  <div class="container mt-5 stress-assessment">
    <h2 class="mb-4 text-title">Tests</h2>
    <div class="test-options">
      <div v-for="(type, index) in assessmentTypes" :key="type.id" class="test-option" @click="openTest(type.id)">
        <div class="icon-container">
          <img :src="type.icon" alt="icon" class="icon" />
        </div>
        <span class="option-title">{{ type.title }}</span>
      </div>
    </div>

    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <span class="close" @click="closePopup">&times;</span>
        <h3 class="text-center text-title">{{ currentTest.title }}</h3>
        <h5 class="text-center">Please answer the following questions:</h5>
        <div class="progress mb-4" style="height: 30px;">
          <div class="progress-bar progress-bar-animated" role="progressbar" :style="{ width: progress + '%' }"
            aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="questions-container">
          <h5>Question {{ currentQuestionIndex + 1 }}:</h5>
          <p>{{ currentTest.questions[currentQuestionIndex].text }}</p>
          <div class="question-list">
            <div v-for="(question, index) in currentTest.questions" :key="index" class="question-item"
              @click="currentQuestionIndex = index">
              <span :class="{ 'answered': answers[index] !== undefined, 'current': currentQuestionIndex === index }">
                {{ index + 1 }}
              </span>
            </div>
          </div>
          <div>
            <div v-for="(option, optionIndex) in currentTest.questions[currentQuestionIndex].options"
              :key="optionIndex">
              <input type="radio" :name="'question' + currentQuestionIndex" :value="option"
                @change="selectAnswer(option)"
                :class="{ 'selected': answers[currentQuestionIndex] === option, 'answered': answers[currentQuestionIndex] !== undefined }" />
              {{ option }}
            </div>
          </div>
          <button @click="nextQuestion" class="btn btn-primary mt-3 mx-auto d-block">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '@/api/data';

export default {
  data() {
    return {
      assessmentTypes: data.Assessments.types,
      currentTest: {},
      showPopup: false,
      currentQuestionIndex: 0,
      answers: [],
      progress: 0,
      score: null,
      evaluation: '',
    };
  },
  methods: {
    openTest(testId) {
      this.currentTest = data.Assessments.types.find(type => type.id === testId);
      this.currentQuestionIndex = 0;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.resetTest();
    },
    resetTest() {
      this.answers = [];
      this.progress = 0;
      this.score = null;
      this.evaluation = '';
      this.currentQuestionIndex = 0;
    },
    selectAnswer(answer) {
      this.answers[this.currentQuestionIndex] = answer;
      this.updateProgress();
    },
    nextQuestion() {
      this.currentQuestionIndex++;
      this.updateProgress();
    },
    updateProgress() {
      const answeredQuestions = this.answers.filter(answer => answer !== undefined).length;
      this.progress = (answeredQuestions / this.currentTest.questions.length) * 100;
    },
    submitAnswers() {
      this.score = this.calculateScore(this.answers);
      this.evaluation = this.evaluateStressLevel(this.score);
    },
    calculateScore(answers) {
      return answers.length;
    },
    evaluateStressLevel(score) {
      if (score < 5) return 'Low Stress';
      if (score < 10) return 'Moderate Stress';
      return 'High Stress';
    },
  },
};
</script>

<style scoped>
.container {
  display: grid;
  gap: 20px;
}

.test-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 50vh;
}

.test-option {
  background-color: #4CAF50;
  padding: 60px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: white;
  flex: 1 1 calc(50% - 20px);
  margin: 10px;
}

.test-option:nth-child(1),
.test-option:nth-child(2),
.test-option:nth-child(3) {
  flex: 1 1 calc(33.33% - 20px);
}

.test-option:nth-child(4),
.test-option:nth-child(5) {
  flex: 1 1 calc(50% - 20px);
}

.test-option:hover {
  background-color: #45a049;
}

.icon-container {
  margin-bottom: 10px;
}

.icon {
  width: 50px;
  height: 50px;
}

.option-title {
  font-size: 18px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  padding: 40px;
  border-radius: 10px;
  width: 80%;
  max-width: 900px;
  max-height: 80vh;
  overflow-y: auto;
}

.close {
  cursor: pointer;
  float: right;
  font-size: 20px;
}

.questions-container {
  max-height: 600px;
  overflow-y: auto;
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

.question-item.current {
  background-color: #4CAF50;
}

.question-item.answered {
  background-color: #4CAF50;
}

input[type="radio"] {
  margin-right: 10px;
}

.selected {
  background-color: #4CAF50;
}

.text-title {
  color: #007bff;
}
</style>