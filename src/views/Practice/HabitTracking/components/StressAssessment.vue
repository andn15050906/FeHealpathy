<template>
  <div class="stress-assessment">
    <h2>Stress Assessment</h2>
    <p>Please answer the following questions:</p>
    <table class="assessment-table">
      <thead>
        <tr>
          <th></th>
          <th>Very Low</th>
          <th>Low</th>
          <th>Normal</th>
          <th>High</th>
          <th>Very High</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(question, index) in questions" :key="index">
          <td>{{ question.text }}</td>
          <td v-for="(option, optionIndex) in question.options" :key="optionIndex">
            <input type="radio" :name="'question' + index" :value="option" @change="selectAnswer(index, option)" />
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="submitAnswers" class="submit-button">Submit Answers</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const questions = ref([
  {
    text: 'How often do you feel overwhelmed by stress?',
    options: ['Very Low', 'Low', 'Normal', 'High', 'Very High']
  },
  {
    text: 'Do you find it hard to relax?',
    options: ['Very Low', 'Low', 'Normal', 'High', 'Very High']
  },
  {
    text: 'How often do you feel anxious or worried?',
    options: ['Very Low', 'Low', 'Normal', 'High', 'Very High']
  },
  {
    text: 'Do you have trouble sleeping due to stress?',
    options: ['Very Low', 'Low', 'Normal', 'High', 'Very High']
  },
  {
    text: 'How often do you feel irritable or angry?',
    options: ['Very Low', 'Low', 'Normal', 'High', 'Very High']
  },
]);

const answers = ref([]);

const selectAnswer = (questionIndex, answer) => {
  answers.value[questionIndex] = answer;
};

const submitAnswers = () => {
  console.log('Answers:', answers.value);
  const stressLevel = evaluateStressLevel(answers.value);
  console.log('Stress Level:', stressLevel);
  
  router.push({ path: '/practice/habit-tracking', query: { stressLevel } });
};

const evaluateStressLevel = (answers) => {
  // Simple evaluation logic based on selected answers
  let score = 0;
  answers.forEach(answer => {
    if (answer === 'Very High') score += 4;
    else if (answer === 'High') score += 3;
    else if (answer === 'Normal') score += 2;
    else if (answer === 'Low') score += 1;
  });
  return score; // Return total score as stress level
};
</script>

<style scoped>
.stress-assessment {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
}

.assessment-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.assessment-table th, .assessment-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.submit-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style> 