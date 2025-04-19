<template>
  <StatisticsTabs :initial-tab="0" tab-color="blue" tab-direction="horizontal" :grow="true"
    :centered="true"></StatisticsTabs>

  <div class="container">
    <h1 class="title">📊 Kết quả tự đánh giá</h1>

    <div class="section">
      <h2>📅 Lịch sử khảo sát</h2>
      <table>
        <thead>
          <tr>
            <th>Survey Taken</th>
            <th>Score</th>
            <th>Evaluation</th>
            <th>Date</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in surveyResults" :key="index">
            <td>{{ result.surveyTitle }}</td>
            <!--...-->
            <td>{{ result.score <= result.maxScore ? result.score : result.maxScore }} / {{ result.maxScore }}</td>
            <td v-if="result.bands.length > 0" :class="result.bands[0].ratingClass">
              {{ getEvaluation(result) }}
            </td>
            <td v-else :class="
              getChartColor(result) == '#e91e63' ? 'bad':
              getChartColor(result) == '#ffc107' ? 'average':
              'good'">
              {{ getEvaluation(result) }}
            </td>
            <td>{{ localFormatISODate(result.creationTime) }}</td>
            <td><RouterLink :to="{ name: 'SubmissionReview', params: { id: result.id} }">Review</RouterLink></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="charts-container">
      <div :style="{ width: '30%' }">
        <h2>🎯 Survey Result Ratio</h2>
        <canvas ref="pieChart"></canvas>
      </div>

      <div :style="{ width: '60%' }">
        <h2>📊 Survey Scores Over Time</h2>
        <canvas ref="barChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Chart from "chart.js/auto";
import { formatISODateWithHMS, formatISODate } from '@/scripts/logic/common';
import { calcSurveyResult } from '@/scripts/logic/utils';
import { getUserProfile } from '@/scripts/api/services/authService';
import { getPagedSubmissions } from '@/scripts/api/services/submissionsService';
import { getPagedSurveys } from '@/scripts/api/services/surveysService';
import StatisticsTabs from '@/components/StatisticsComponents/StatisticsTabs.vue';

export default {
  components: { StatisticsTabs },
  methods: {
    localFormatISODate(date) {
      return formatISODateWithHMS(date);
    }
  },
  setup() {
    const pieChart = ref(null);
    const barChart = ref(null);

    const surveyResults = ref([]);
    const positive = ref(0);
    const neutral = ref(0);
    const negative = ref(0);
    const maxRenderedScore = ref(0);

    const getEvaluation = (result) => {
      let band = result.bands[0];
      if (band) {
        if (band.ratingClass == 'bad')
          return "Negative 😔";
        else if (band.ratingClass == 'average')
          return "Neutral ⚠️"
        else if (band.ratingClass == 'good')
          return "Positive 👍"
      }
      return result.score > (result.maxScore / 2) ? "Negative 😔" : "Positive 👍";
    };

    const getChartColor = (result) => {
      let band = result.bands[0];
      if (band) {
        if (band.ratingClass == 'bad')
          return "#e91e63";
        else if (band.ratingClass == 'average')
          return "#ffc107"
        else if (band.ratingClass == 'good')
          return "#4caf50"
      }
      return result.score > (result.maxScore / 2) ? "#e91e63" : "#4caf50";
    }

    const renderCharts = () => {
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
          labels: surveyResults.value.map(r => `${r.surveyTitle} (${formatISODate(r.creationTime)})`),
          datasets: [
            {
              label: "Survey Score (based on Score scale = 100)",
              data: surveyResults.value.map(r => (r.score / r.maxScore) * 100),    // r.maxScore > 0
              backgroundColor: surveyResults.value.map(r => getChartColor(r)),
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          scales: { x: { min: 0, max: /*maxRenderedScore.value*/ 100 } },
        },
      });
    }

    (async () => {
      let userId = (await getUserProfile()).id;

      let submissionsPromise = getPagedSubmissions({ creatorId: userId });
      let surveysPromise = getPagedSurveys();
      await Promise.all([submissionsPromise, surveysPromise]);
      let submissions = (await submissionsPromise).items;
      let surveys = (await surveysPromise).items.filter(_ => _.bands.length > 0);

      let resultArr = [];
      for (let submission of submissions) {
        let survey = surveys.find(item => item.id == submission.surveyId);
        if (survey) {
          let result = calcSurveyResult(survey, submission.choices);
          resultArr.push({
            id: submission.id,
            surveyTitle: survey.name,
            creationTime: submission.creationTime,
            score: result.score,
            maxScore: result.maxScore,
            bands: result.bands
          });
        }
      }

      maxRenderedScore.value = Math.max(...resultArr.map(_ => _.maxScore));
      console.log(resultArr);

      surveyResults.value = resultArr;
      surveyResults.value.forEach((result) => {
        let band = result.bands[0];
        if (band) {
          if (band.ratingClass == 'bad')
            negative.value++;
          else if (band.ratingClass == 'average')
            neutral.value++;
          else if (band.ratingClass == 'good')
            positive.value++;
        }
        else if (result.score > (result.maxScore / 2))
          negative.value++;
        else
          positive.value++;
      });

      renderCharts();
    })()

    return {
      surveyResults,
      getEvaluation,
      getChartColor,
      pieChart,
      barChart,
      renderCharts
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

.good {
  color: #4caf50;
  font-weight: bold;
}

.average {
  color: #ffc107;
  font-weight: bold;
}

.bad {
  color: #e91e63;
  font-weight: bold;
}

.charts-container {
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-wrap: wrap;
  padding-bottom: 40px;
  text-align: center;
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