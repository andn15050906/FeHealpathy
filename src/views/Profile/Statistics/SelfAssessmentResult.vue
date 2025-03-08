<template>
  <div class="container">
    <h1 class="title">📊 Survey Statistics (Self Assessment)</h1>

    <div class="section">
      <h2>📅 Survey History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Score</th>
            <th>Evaluation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in surveyResults" :key="index">
            <td>{{ result.date }}</td>
            <td>{{ result.score }}</td>
            <td :class="getEvaluationClass(result.score)">
              {{ getEvaluation(result.score) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="charts-container">
      <div class="chart-box">
        <h2>🎯 Survey Result Ratio</h2>
        <canvas ref="pieChart"></canvas>
      </div>

      <div class="chart-box" id="bar-chart">
        <h2>📊 Survey Scores Over Time</h2>
        <canvas ref="barChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "SurveyStatistics",
  setup() {
    const pieChart = ref(null);
    const barChart = ref(null);

    const surveyResults = ref([
      { date: "2025-03-01", score: 85 },
      { date: "2025-03-05", score: 60 },
      { date: "2025-03-10", score: 40 },
      { date: "2025-03-15", score: 75 },
      { date: "2025-03-20", score: 90 },
    ]);

    const positive = ref(0);
    const neutral = ref(0);
    const negative = ref(0);

    surveyResults.value.forEach((result) => {
      if (result.score >= 80) positive.value++;
      else if (result.score >= 50) neutral.value++;
      else negative.value++;
    });

    const getEvaluation = (score) => {
      return score >= 80
        ? "Positive 👍"
        : score >= 50
        ? "Neutral ⚠️"
        : "Negative 😔";
    };

    const getEvaluationClass = (score) => {
      return score >= 80 ? "positive" : score >= 50 ? "neutral" : "negative";
    };

    onMounted(() => {
      new Chart(pieChart.value, {
        type: "pie",
        data: {
          labels: ["Positive", "Neutral", "Negative"],
          datasets: [
            {
              data: [positive.value, neutral.value, negative.value],
              backgroundColor: ["#4CAF50", "#FFC107", "#E91E63"],
            },
          ],
        },
      });

      new Chart(barChart.value, {
        type: "bar",
        data: {
          labels: surveyResults.value.map((r) => r.date),
          datasets: [
            {
              label: "Survey Score",
              data: surveyResults.value.map((r) => r.score),
              backgroundColor: [
                "#4CAF50",
                "#FFC107",
                "#E91E63",
                "#03A9F4",
                "#8E44AD",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          scales: {
            x: { min: 0, max: 100 },
          },
        },
      });
    });

    return {
      surveyResults,
      getEvaluation,
      getEvaluationClass,
      pieChart,
      barChart,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: auto;
  background: white;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 1000px;
}

.title {
  text-align: center;
  margin-bottom: 40px;
}

.section {
  margin-bottom: 80px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

th {
  background: #f9f9f9;
}

.positive {
  color: #4caf50;
  font-weight: bold;
}

.neutral {
  color: #ffc107;
  font-weight: bold;
}

.negative {
  color: #e91e63;
  font-weight: bold;
}

.charts-container {
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-wrap: wrap;
  padding-bottom: 40px;
}

.chart-box {
  width: 50%;
  margin-bottom: 40px;
  text-align: center;
}

#bar-chart canvas {
  width: 75% !important;
  height: 270px !important;
}

.chart-box canvas {
  max-width: 950px;
  max-height: 950px;
  display: block;
  margin: auto;
  margin-top: 20px;
}

.chart-box h2 {
  text-align: center;
  width: 100%;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .charts-container {
    flex-direction: column;
    align-items: center;
  }

  .chart-box {
    width: 100%;
  }

  .chart-box canvas {
    max-width: 400px;
    max-height: 400px;
  }
}
</style>
