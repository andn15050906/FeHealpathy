<template>
  <StatisticsTabs :initial-tab="0" tab-color="blue" tab-direction="horizontal" :grow="true"
    :centered="true"></StatisticsTabs>

  <div class="container">
    <h1 id="title" style="text-align: center">Activity Statistics</h1>

    <div class="section">
      <h2>📌 Recent Notable Activities</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Action</th>
            <th>Content</th>
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
      <h2>📈 Mood & Activity Trends</h2>
      <canvas ref="moodChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import Chart from "chart.js/auto";
import { getActivityLogs, getDisplayName, TRACKED_EVENTS } from '@/scripts/api/services/activityLogService';
import { formatISODateWithHMS, formatISODate } from '@/scripts/logic/common';
import { calcSurveyResult } from '@/scripts/logic/utils';
import { getUserProfile } from '@/scripts/api/services/authService';
import { getPagedSubmissions } from '@/scripts/api/services/submissionsService';
import { getPagedSurveys } from '@/scripts/api/services/surveysService';
import StatisticsTabs from '@/components/StatisticsComponents/StatisticsTabs.vue';

const recentActivities = ref([
  /*{
    creationTime: "2024-03-02 08:30",
    action: "Answered Question of the Day",
    content: "✅ Positive response",
  },
  {
    creationTime: "2024-03-03 14:00",
    action: "Updated Mood",
    content: "😔 Slightly negative mood ⚠️",
  },
  {
    creationTime: "2024-03-04 20:00",
    action: "Joined a chat group",
    content: "💬 Sent 5 messages",
  },
  {
    creationTime: "2024-03-05 16:45",
    action: "Completed stress management exercise",
    content: "✅ Success!",
  },
  {
    creationTime: "2024-03-06 10:00",
    action: "Completed 10 minutes of meditation",
    content: "🧘‍♂️ Done",
  },
  {
    creationTime: "2024-03-07 09:00",
    action: "Filled out a survey",
    content: "📝 Submitted feedback",
  },
  {
    creationTime: "2024-03-07 17:00",
    action: "Completed a course",
    content: "🎓 Finished 'Stress Control' course",
  },*/
]);

const moodChart = ref(null);

onBeforeMount(async () => {
  let userId = (await getUserProfile()).id;
  var activityLogs = (await getActivityLogs()).filter(_ => _.creatorId == userId);
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
      
      console.log(parsedContent);
      if (parsedContent.question && parsedContent.answer) {
        action = TRACKED_EVENTS.QuestionOfTheDay_Answered.displayName;
        content =  {
          type: 'text',
          display: parsedContent.question
        };
      }
      else if (parsedContent.action == TRACKED_EVENTS.Mood_Updated.label) {
        console.log(1);
        action = TRACKED_EVENTS.Mood_Updated.displayName;
        content =  {
          type: 'text',
          display: parsedContent.content
        };
      }
    }

    return {
      creationTime: formatISODateWithHMS(log.creationTime),
      action: action,
      content: content
    }
  })
})

onMounted(() => {
  const ctx = moodChart.value.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "2024-02-25",
        "2024-02-26",
        "2024-02-27",
        "2024-02-28",
        "2024-03-01",
        "2024-03-02",
        "2024-03-03",
        "2024-03-04",
        "2024-03-05",
      ],
      datasets: [
        {
          label: "Mood Score (%)",
          data: [75, 80, 85, 78, 82, 60, 55, 65, 70],
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          tension: 0.3,
          yAxisID: "y-mood",
          fill: true,
        },
        {
          label: "Activity Count",
          data: [3, 4, 6, 5, 7, 2, 1, 5, 8],
          borderColor: "#FFA726",
          backgroundColor: "rgba(255, 167, 38, 0.2)",
          tension: 0.3,
          yAxisID: "y-activity",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        "y-mood": {
          type: "linear",
          position: "left",
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Mood Score (%)",
          },
          ticks: { callback: (value) => value + "%" },
        },
        "y-activity": {
          type: "linear",
          position: "right",
          beginAtZero: true,
          title: {
            display: true,
            text: "Activity Count",
          },
        },
      },
    },
  });
});
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