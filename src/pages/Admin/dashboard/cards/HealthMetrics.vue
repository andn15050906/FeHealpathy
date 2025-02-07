<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-secondary font-bold uppercase">Health Metrics</h1>
    </VaCardTitle>
    <VaCardContent>
      <div class="flex flex-col gap-4">
        <div class="metric-item">
          <div class="text-lg font-bold">Mental Health</div>
          <VaProgressBar value="75" color="success" />
        </div>
        <div class="metric-item">
          <div class="text-lg font-bold">Physical Health</div>
          <VaProgressBar value="82" color="info" />
        </div>
        <div class="metric-item">
          <div class="text-lg font-bold">Nutrition</div>
          <VaProgressBar value="68" color="warning" />
        </div>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { VaCard, VaProgressBar } from 'vuestic-ui'
</script> 