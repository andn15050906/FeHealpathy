<template>
  <canvas ref="pieChart"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  moodData: {
    type: Object,
    required: true
  }
});

const pieChart = ref(null);

onMounted(() => {
  const ctx = pieChart.value.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(props.moodData),
      datasets: [{
        data: Object.values(props.moodData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Mood Distribution'
        }
      }
    }
  });
});
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style> 