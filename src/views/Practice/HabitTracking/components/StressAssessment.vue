<template>
  <div class="container mt-5 stress-assessment">
    <h2 class="mb-4">Stress Assessment</h2>
    <p>Please answer the following questions:</p>
    <div class="progress mb-4" style="height: 30px;">
      <div class="progress-bar progress-bar-animated" role="progressbar" :style="{ width: progress + '%' }"
        aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <table class="table table-bordered assessment-table">
      <thead class="thead-light text-center">
        <tr>
          <th></th>
          <th>Never</th>
          <th>Rarely</th>
          <th>Sometimes</th>
          <th>Often</th>
          <th>Always</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(question, index) in questions" :key="index">
          <td>{{ question.text }}</td>
          <td v-for="(option, optionIndex) in question.options" :key="optionIndex" class="text-center">
            <input type="radio" :name="'question' + index" :value="option" @change="selectAnswer(index, option)" />
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="submitAnswers" class="btn btn-primary mt-3">Submit Answers</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const questions = ref([
  {
    text: '🧠 How often do you feel overwhelmed by stress?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: '😟 Do you find it hard to relax?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: '😰 How often do you feel anxious or worried?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: '💤 Do you have trouble sleeping due to stress?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: '😠 How often do you feel irritable or angry?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: '🏋️‍♂️ How often do you engage in physical activities or exercise?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: '🍎 How balanced and nutritious do you think your current diet is?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    text: '🌞 Do you spend time outdoors or get regular sunlight exposure?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
]);

const answers = ref([]);
const progress = ref(0);

const selectAnswer = (questionIndex, answer) => {
  answers.value[questionIndex] = answer;
  updateProgress();
};

const updateProgress = () => {
  const answeredQuestions = answers.value.filter(answer => answer !== undefined).length;
  progress.value = (answeredQuestions / questions.value.length) * 100;
};

const submitAnswers = () => {
  const stressLevel = evaluateStressLevel(answers.value);
};

const evaluateStressLevel = (answers) => {
  return 'Normal';
};

watch(answers, updateProgress, { deep: true });
</script>

<style scoped>
.stress-assessment {
  padding: 20px;
}

.table th {
  vertical-align: middle;
  text-align: center;
}

thead.thead-light th {
  background-color: #f8f9fa;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.progress-bar {
  background-color: #28a745;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.6s ease;
}
</style>