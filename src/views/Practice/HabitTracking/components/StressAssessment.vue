<template>
  <div class="container mt-5 stress-assessment">
    <h2 class="mb-4">Stress Assessment</h2>
    <h5>Please answer the following questions:</h5>
    <div class="progress mb-4" style="height: 30px;">
      <div class="progress-bar progress-bar-animated" role="progressbar" :style="{ width: progress + '%' }"
        aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <table class="table table-bordered assessment-table">
      <thead class="thead-light text-center">
        <tr>
          <th></th>
          <th>Not at all true for me</th>
          <th>Somewhat true for me</th>
          <th>Mostly true for me</th>
          <th>Completely true for me</th>
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
    <div v-if="score !== null" class="mt-4">
      <h5>Your Score: {{ score }}</h5>
      <h5>Evaluation: {{ evaluation }}</h5>
    </div>
  </div>
</template>

<script>
import data from '@/api/data';

export default {
  data() {
    return {
      questions: data.StressAssessment.questions,
      answers: [],
      progress: 0,
      score: null,
      evaluation: '',
    };
  },
  methods: {
    selectAnswer(questionIndex, answer) {
      this.answers[questionIndex] = answer;
      this.updateProgress();
    },
    updateProgress() {
      const answeredQuestions = this.answers.filter(answer => answer !== undefined).length;
      this.progress = (answeredQuestions / this.questions.length) * 100;
    },
    submitAnswers() {
      this.score = this.calculateScore(this.answers);
      this.evaluation = this.evaluateStressLevel(this.score);
    },
    calculateScore(answers) {
      return answers.length; // Example: return the number of answers
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