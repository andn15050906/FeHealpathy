<template>
  <StatisticsTabs :initial-tab="0" tab-color="blue" tab-direction="horizontal" :grow="true" :centered="true">
  </StatisticsTabs>

  <div class="container py-4">
    <h2 class="text-center mb-4">Thống kê hoạt động</h2>

    <div class="card mb-4 shadow-sm">
      <div class="card-body p-0">
        <div class="table-container">
          <table class="table table-hover table-striped mb-0">
            <thead class="table-light sticky-top">
              <tr>
                <th>Thời gian</th>
                <th>Hoạt động</th>
                <th>Nội dung</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(activity, index) in recentActivities" :key="index">
                <td>{{ activity.creationTime }}</td>
                <td>{{ activity.action }}</td>
                <td>
                  <a href="/" class="text-decoration-none" v-if="activity.content.type == 'link'">{{
                    activity.content.display }}</a>
                  <span v-else>{{ activity.content.display }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <h2 class="h4 mb-0">📈 Xu hướng cảm xúc và hoạt động</h2>
      </div>
      <div class="card-body chart-container">
        <Line :data="sentimentChartData" :options="sentimentChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Chart from "chart.js/auto";
import { getActivityLogs, getDisplayName, TRACKED_EVENTS } from '@/scripts/api/services/activityLogService';
import { formatISODateWithHMS, formatISODateWithDDMM } from '@/scripts/logic/common';
import { getUserProfile } from '@/scripts/api/services/authService';
import { getSentimentAnalysis } from '@/scripts/api/services/statisticsService';
import StatisticsTabs from '@/components/StatisticsComponents/StatisticsTabs.vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

const recentActivities = ref([]);
const moodChart = ref(null);
const sentimentChartData = ref({
  labels: [],
  datasets: []
});
const sentimentChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    "y-mood": {
      type: "linear",
      position: "left",
      title: { display: true, text: "Điểm số cảm xúc" },
    },
    "y-activity": {
      type: "linear",
      position: "right",
      beginAtZero: true,
      title: { display: true, text: "Hoạt động" },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      cornerRadius: 6
    }
  }
});

const safeGetDisplayName = (genericType) => {
  try {
    if (!genericType) return 'Hoạt động chung';
    const displayName = getDisplayName(genericType);
    return displayName || 'Hoạt động chung';
  } catch (error) {
    return 'Hoạt động chung';
  }
};

onBeforeMount(async () => {
  try {
    const userProfile = await getUserProfile();
    if (!userProfile || !userProfile.id) {
      return;
    }

    let userId = userProfile.id;
    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

    var sentimentDataTask = getSentimentAnalysis();
    var activityLogsTask = getActivityLogs({ pageSize: 128, CreatorId: userId });

    await Promise.all([sentimentDataTask, activityLogsTask]);
    const sentimentData = await sentimentDataTask;
    const activityLogs = await activityLogsTask;

    console.log(sentimentData);
    console.log(activityLogs);

    if (!activityLogs || !Array.isArray(activityLogs)) {
      return;
    }

    recentActivities.value = activityLogs.map(log => {
      let json = undefined;
      try {
        json = JSON.parse(log.content);
      } catch (e) {
        json = {};
      }

      let action = '';
      if (json && json.GenericType) {
        action = safeGetDisplayName(json.GenericType);
      } else {
        action = 'Hoạt động chung';
      }

      let content = {
        type: 'link',
        display: 'Xem chi tiết...'
      };

      try {
        if ((!json.GenericType || json.GenericType == 'General_Activity_Created') && json.Content) {
          let parsedContent;
          try {
            parsedContent = JSON.parse(json.Content);
          } catch (e) {
            parsedContent = {};
          }

          try {
            if (parsedContent.Content) {
              let nestedJson = JSON.parse(parsedContent.Content);
              if (nestedJson)
                parsedContent = nestedJson;
            }
          } catch (e) {
          }

          if (parsedContent.question && parsedContent.answer) {
            action = TRACKED_EVENTS.QuestionOfTheDay_Answered?.displayName || 'Trả lời câu hỏi ngày';
            content = {
              type: 'text',
              display: parsedContent.question
            };
          }
          else if (parsedContent.action == TRACKED_EVENTS.Mood_Updated?.label) {
            action = TRACKED_EVENTS.DiaryNote_Created?.displayName || 'Tạo nhật ký';
          }
          else if (parsedContent.event == TRACKED_EVENTS.Media_Viewed?.label) {
            action = TRACKED_EVENTS.Media_Viewed?.displayName || 'Xem phương tiện';
          }
        }
      } catch (e) {
      }

      return {
        creationTime: formatISODateWithHMS(log.creationTime),
        action: action,
        content: content
      }
    }).slice(0, 20);

    if (!sentimentData || typeof sentimentData !== 'object') {
      return;
    }

    let labels = [];
    let scores = {};
    let activities = {};

    for (let date in sentimentData) {
      if (sentimentData[date] && typeof sentimentData[date].score === 'number') {
        labels.push(formatISODateWithDDMM(date, 'DD/MM'));
        scores[date] = sentimentData[date].score * -1;
      }
    }

    for (let date of labels) {
      activities[date] = [];
    }

    for (let logItem of activityLogs) {
      let date = formatISODateWithDDMM(logItem.creationTime, 'DD/MM');
      if (activities[date]) {
        activities[date].push(logItem);
      }
    }

    sentimentChartData.value = {
      labels: labels,
      datasets: [
        {
          label: 'Điểm số cảm xúc',
          data: Object.values(scores),
          borderColor: "#4CAF50",
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.3,
          yAxisID: "y-mood",
        },
        {
          label: "Số lượng hoạt động",
          data: Object.values(activities).map(arr => arr.length),
          borderColor: "#FFA726",
          backgroundColor: "rgba(255, 167, 38, 0.2)",
          tension: 0.3,
          yAxisID: "y-activity",
          fill: true,
        }
      ],
    };
  } catch (error) {
  }
});
</script>

<style scoped>
h2 {
  color: #343a40;
  font-weight: 600;
}

.card {
  border-radius: 10px;
  overflow: hidden;
  border: none;
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.table-container {
  height: 380px;
  overflow-y: auto;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1;
}

.table th {
  font-weight: 600;
  color: #495057;
}

.table td {
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.04);
}

.chart-container {
  height: 450px;
  position: relative;
}

a {
  color: #007bff;
}

a:hover {
  color: #0056b3;
}
</style>