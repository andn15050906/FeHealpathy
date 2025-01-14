<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-secondary font-bold uppercase">User Statistics</h1>
    </VaCardTitle>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-1/2">
          <div class="text-xl font-bold mb-4">User Growth</div>
          <VaChart
            :data="chartData"
            type="line"
            :options="options"
            class="h-64"
          />
        </div>
        <div class="w-full md:w-1/2">
          <div class="text-xl font-bold mb-4">User Demographics</div>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span>Age 18-24</span>
                <span>35%</span>
              </div>
              <VaProgressBar value="35" color="primary"/>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span>Age 25-34</span>
                <span>45%</span>
              </div>
              <VaProgressBar value="45" color="info"/>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span>Age 35+</span>
                <span>20%</span>
              </div>
              <VaProgressBar value="20" color="warning"/>
            </div>
          </div>
        </div>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const chartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Users',
      data: [1200, 1900, 3000, 5000, 8000, 12000],
      borderColor: '#7367F0',
      tension: 0.4,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}
</script> 