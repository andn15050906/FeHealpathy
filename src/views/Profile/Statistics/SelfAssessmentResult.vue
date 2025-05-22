<template>
  <StatisticsTabs :initial-tab="0" tab-color="blue" tab-direction="horizontal" :grow="true" :centered="true">
  </StatisticsTabs>

  <div class="container py-4">
    <h2 class="text-center mb-4">📊 Kết quả tự đánh giá</h2>

    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-white">
        <h2 class="h4 mb-0">📅 Lịch sử khảo sát</h2>
      </div>
      <div class="card-body p-0">
        <div class="table-container">
          <table class="table table-hover table-striped mb-0">
            <thead class="table-light sticky-top">
              <tr>
                <th>Khảo sát</th>
                <th>Điểm số</th>
                <th>Đánh giá</th>
                <th>Ngày</th>
                <th>Xem chi tiết</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in surveyResults" :key="index">
                <td>{{ result.surveyTitle }}</td>
                <td>{{ result.score <= result.maxScore ? result.score : result.maxScore }} / {{ result.maxScore }}</td>
                <td v-if="result.bands.length > 0" :class="result.bands[0].ratingClass">
                  {{ getEvaluation(result) }}
                </td>
                <td v-else :class="getChartColor(result) == '#e91e63' ? 'bad' :
                  getChartColor(result) == '#ffc107' ? 'average' :
                    'good'">
                  {{ getEvaluation(result) }}
                </td>
                <td>{{ localFormatISODate(result.creationTime) }}</td>
                <td>
                  <RouterLink class="btn btn-sm btn-outline-primary"
                    :to="{ name: 'SubmissionReview', params: { id: result.id } }">Chi tiết</RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 mb-4 mb-md-0">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white">
            <h2 class="h4 mb-0">🎯 Tỷ lệ kết quả đánh giá</h2>
          </div>
          <div class="card-body chart-container">
            <canvas ref="pieChart"></canvas>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white">
            <h2 class="h4 mb-0">📊 Điểm số đánh giá theo thời gian</h2>
          </div>
          <div class="card-body chart-container">
            <canvas ref="barChart"></canvas>
          </div>
        </div>
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
          return "Tiêu cực 😔";
        else if (band.ratingClass == 'average')
          return "Trung bình ⚠️"
        else if (band.ratingClass == 'good')
          return "Tích cực 👍"
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
          labels: ["Tích cực", "Trung bình", "Tiêu cực"],
          datasets: [
            {
              data: [positive.value, neutral.value, negative.value],
              backgroundColor: ["#4CAF50", "#FFC107", "#E91E63"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });

      new Chart(barChart.value, {
        type: "bar",
        data: {
          labels: surveyResults.value.map(r => `${r.surveyTitle} (${formatISODate(r.creationTime)})`),
          datasets: [
            {
              label: "Điểm số đánh giá (Thang điểm = 100)",
              data: surveyResults.value.map(r => (r.score / r.maxScore) * 100),
              backgroundColor: surveyResults.value.map(r => getChartColor(r)),
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { min: 0, max: 100 } },
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
  width: 72vw;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 0;
}

h2 {
  color: #2c3e50;
  font-weight: 700;
  position: relative;
  padding-bottom: 12px;
}

h2.text-center::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #3498db, #2ecc71);
  border-radius: 2px;
}

.card {
  border-radius: 15px;
  overflow: hidden;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  padding: 1.25rem;
}

.card-header h2 {
  font-size: 1.25rem;
  margin: 0;
  color: #2c3e50;
}

.table-container {
  height: 300px;
  overflow-y: auto;
  border-radius: 0 0 15px 15px;
}

.table-container::-webkit-scrollbar {
  width: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f8f9fa;
}

.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  color: #2c3e50;
  padding: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.table th:nth-child(3) {
  text-align: center;
}

.table th:first-child,
.table td:first-child {
  text-align: left;
}

.table th:last-child,
.table td:last-child {
  text-align: center;
}

.table th:nth-child(2),
.table td:nth-child(2) {
  text-align: center;
}

.table th:nth-child(4),
.table td:nth-child(4) {
  text-align: center;
}

.table td {
  vertical-align: middle;
  padding: 1rem;
  color: #495057;
}

.table td:nth-child(3) {
  text-align: center;
}

.table-hover tbody tr:hover {
  background-color: rgba(52, 152, 219, 0.04);
  transition: all 0.2s ease;
}

.chart-container {
  height: 300px;
  position: relative;
  padding: 1rem;
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

.btn-outline-primary {
  color: #3498db;
  border: 2px solid #3498db;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  color: #fff;
  background: linear-gradient(to right, #3498db, #2ecc71);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2);
}

@media (max-width: 768px) {
  .container {
    width: 95vw;
    padding: 1rem;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>