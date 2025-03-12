<template>
    <Pie :data="data" :options="options" />
</template>
  
<script>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
    name: 'PieChart',
    components: { Pie },
    props: ['data'],
    data() {
        return {
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
        };
    }
};
</script>

<!--<template>
    <canvas ref="pieChart" class="pie-chart"></canvas>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  const props = defineProps({
    habits: {
      type: Array,
      required: true
    }
  });
  
  const pieChart = ref(null);
  
  onMounted(() => {
    const completedDays = props.habits.map(habit => habit.completedDates.length);
    const totalDays = props.habits.map(habit => habit.goal);
    
    const data = completedDays.map((completed, index) => {
      return (completed / totalDays[index]) * 100;
    });
  
    new Chart(pieChart.value.getContext('2d'), {
      type: 'pie',
      data: {
        labels: props.habits.map(habit => habit.name),
        datasets: [{
          data: data,
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Habit Compliance Percentage'
          }
        }
      }
    });
  });
  </script>
  
  <style scoped>
  .pie-chart {
    width: 600px;
    height: 600px;
    margin: 20px auto;
  }
  </style>-->