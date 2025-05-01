<template>
  <StatisticsTabs :initial-tab="0" tab-color="blue" tab-direction="horizontal" :grow="true"
    :centered="true"></StatisticsTabs>

  <div class="container">
    <h1 id="title" style="text-align: center">Thống kê hoạt động</h1>

    <div class="section">
      <h2>📌 Các hoạt động gần đây</h2>
      <table>
        <thead>
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
            <!--<td :class="activity.content.includes('negative') ? 'alert' : 'highlight'">
              {{ activity.content }}
            </td>-->
            <td>
              <a href="/" v-if="activity.content.type == 'link'">{{ activity.content.display }}</a>
              <span v-else>{{ activity.content.display }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>📈 Xu hướng cảm xúc và hoạt động</h2>
      <Line :data="sentimentChartData" :options="sentimentChartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
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
  scales: {
    "y-mood": {
      type: "linear",
      position: "left",
      //beginAtZero: true,
      //max: 100,
      title: { display: true, text: "Điểm số cảm xúc" },
      //ticks: { callback: (value) => value + "%" },
    },
    "y-activity": {
      type: "linear",
      position: "right",
      beginAtZero: true,
      title: { display: true, text: "Hoạt động" },
    },
  }
});

onBeforeMount(async () => {
  let userId = (await getUserProfile()).id;
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

  var sentimentDataTask = getSentimentAnalysis();
  var activityLogsTask = getActivityLogs({ pageSize: 128, CreatorId: userId });

  await Promise.all([sentimentDataTask, activityLogsTask]);
  const sentimentData = await sentimentDataTask;
  const activityLogs = await activityLogsTask;
  console.log(sentimentData);
  console.log(activityLogs);

  recentActivities.value = activityLogs.map(log => {
    let json = undefined;
    try {
      json = JSON.parse(log.content);
    } catch (e) { }

    let action = '';
    if (json && json.GenericType) {
      action = getDisplayName(json.GenericType);
    }

    let content =  {
      type: 'link',
      display: 'Xem chi tiết...'
    };

    //...
    if ((!json.GenericType || json.GenericType == 'General_Activity_Created') && json.Content) {
      let parsedContent = JSON.parse(json.Content);
      try {
        let nestedJson = JSON.parse(parsedContent.Content);
        if (nestedJson)
          parsedContent = nestedJson;
      } catch (e) { }
      
      if (parsedContent.question && parsedContent.answer) {
        action = TRACKED_EVENTS.QuestionOfTheDay_Answered.displayName;
        content =  {
          type: 'text',
          display: parsedContent.question
        };
      }
      else if (parsedContent.action == TRACKED_EVENTS.Mood_Updated.label) {
        action = TRACKED_EVENTS.DiaryNote_Created.displayName;
        /*action = TRACKED_EVENTS.Mood_Updated.displayName;
        content =  {
          type: 'text',
          display: parsedContent.content
        };*/''
      }
      else if (parsedContent.event == TRACKED_EVENTS.Media_Viewed.label) {
        action = TRACKED_EVENTS.Media_Viewed.displayName;
      }
    }

    return {
      creationTime: formatISODateWithHMS(log.creationTime),
      action: action,
      content: content
    }
  }).slice(0, 20);

  let labels = [];
  let scores = {};
  let activities = {};

  for (let date in sentimentData) {
    labels.push(formatISODateWithDDMM(date, 'DD/MM'));
    scores[date] = sentimentData[date].score * -1;
  }

  for (let date of labels) {
    if (!activities[date])
      activities[date] = [];
  }
  for (let logItem of activityLogs) {
    let date = formatISODateWithDDMM(logItem.creationTime, 'DD/MM');
    if (!activities[date])
      continue;
    activities[date].push(logItem);
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
        data: Object.values(activities).map(_ => _.length),
        borderColor: "#FFA726",
        backgroundColor: "rgba(255, 167, 38, 0.2)",
        tension: 0.3,
        yAxisID: "y-activity",
        fill: true,
      }
    ],
  };
})
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
  background: #f5f5f5;
}

#title {
  margin-bottom: 20px;
}

.container {
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 20px;
}

.highlight {
  font-weight: bold;
  color: #4caf50;
}

.alert {
  color: red;
  font-weight: bold;
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

canvas {
  max-width: 100%;
  margin-top: 20px;
}
</style>