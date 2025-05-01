<template>
  <div class="sleep-chart">
    <h3>Dữ liệu ngủ</h3>
    <canvas id="sleepChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  sleepData: {
    type: Object,
    required: true
  }
});

const sleepChart = ref(null);

onMounted(() => {
  const ctx = document.getElementById('sleepChart').getContext('2d');
  sleepChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: props.sleepData.hours.length }, (_, i) => `Day ${i + 1}`),
      datasets: [{
        label: 'Giờ ngủ',
        data: props.sleepData.hours,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 24
        }
      }
    }
  });
});
</script>

<style scoped>
.sleep-chart {
  margin-top: 20px;
}
</style> 