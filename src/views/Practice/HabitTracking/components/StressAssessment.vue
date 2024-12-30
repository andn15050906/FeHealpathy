<template>
  <div class="stress-assessment">
    <h2>Stress Assessment</h2>
    <p>Please answer the following questions:</p>
    <div v-for="(question, index) in questions" :key="index" class="question-item">
      <p>{{ question.text }}</p>
      <div class="options">
        <button v-for="option in question.options" :key="option" @click="selectAnswer(index, option)">
          {{ option }}
        </button>
      </div>
    </div>
    <button @click="submitAnswers" class="submit-button">Submit Answers</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const questions = ref([
  {
    text: 'How often do you feel overwhelmed by stress?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: 'Do you find it hard to relax?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: 'How often do you feel anxious or worried?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: 'Do you have trouble sleeping due to stress?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: 'How often do you feel irritable or angry?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: 'Do you feel like you have control over your stress?',
    options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never']
  },
  {
    text: 'How often do you feel physically tense or tight?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: 'Do you find it hard to concentrate due to stress?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: 'How often do you feel fatigued or exhausted?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: 'Do you feel supported by friends or family when stressed?',
    options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never']
  }
]);

const answers = ref([]);

const selectAnswer = (questionIndex, answer) => {
  answers.value[questionIndex] = answer;
};

const submitAnswers = () => {
  console.log('Answers:', answers.value);
  // Implement logic to handle the answers
};
</script>

<style scoped>
.stress-assessment {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.question-item {
  margin-bottom: 20px;
}

.options {
  display: flex;
  gap: 10px;
}

.submit-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style> 