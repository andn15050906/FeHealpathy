<script lang="ts" setup>
import DataSection from './DataSection.vue'
import UserStatistics from './cards/UserStatistics.vue'
import HealthMetrics from './cards/HealthMetrics.vue'
import CommunityActivities from './cards/CommunityActivities.vue'
import Timeline from './cards/Timeline.vue'
</script>

<template>
  <h1 class="page-title font-bold">Dashboard</h1>
  <section class="flex flex-col gap-4">
    <DataSection />
    <div class="flex flex-col sm:flex-row gap-4">
      <UserStatistics class="w-full sm:w-[70%]" />
      <HealthMetrics class="w-full sm:w-[30%]" />
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <CommunityActivities class="w-full md:w-1/2" />
      <Timeline class="w-full md:w-1/2" />
    </div>
  </section>
</template>
