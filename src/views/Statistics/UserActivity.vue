<template>
  <div class="container">
    <h1 id="title" style="text-align: center">Activity Statistics</h1>

    <!-- Recent Notable Activities -->
    <div class="section">
      <h2>📌 Recent Notable Activities</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Action</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(activity, index) in recentActivities" :key="index">
            <td>{{ activity.time }}</td>
            <td>{{ activity.action }}</td>
            <td
              :class="
                activity.result.includes('negative') ? 'alert' : 'highlight'
              "
            >
              {{ activity.result }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mood & Activity Trend Chart -->
    <div class="section">
      <h2>📈 Mood & Activity Trends</h2>
      <canvas ref="moodChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const recentActivities = ref([
  {
    time: "2024-03-02 08:30",
    action: "Answered Question of the Day",
    result: "✅ Positive response",
  },
  {
    time: "2024-03-03 14:00",
    action: "Updated Mood",
    result: "😔 Slightly negative mood ⚠️",
  },
  {
    time: "2024-03-04 20:00",
    action: "Joined a chat group",
    result: "💬 Sent 5 messages",
  },
  {
    time: "2024-03-05 16:45",
    action: "Completed stress management exercise",
    result: "✅ Success!",
  },
  {
    time: "2024-03-06 10:00",
    action: "Completed 10 minutes of meditation",
    result: "🧘‍♂️ Done",
  },
  {
    time: "2024-03-07 09:00",
    action: "Filled out a survey",
    result: "📝 Submitted feedback",
  },
  {
    time: "2024-03-07 17:00",
    action: "Completed a course",
    result: "🎓 Finished 'Stress Control' course",
  },
]);

const moodChart = ref(null);

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
