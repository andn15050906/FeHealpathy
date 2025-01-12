<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <DataSectionItem
      v-for="metric in dashboardMetrics"
      :key="metric.id"
      :title="metric.title"
      :value="metric.value"
      :change-text="metric.changeText"
      :up="metric.changeDirection === 'up'"
      :icon-background="metric.iconBackground"
      :icon-color="metric.iconColor"
    >
      <template #icon>
        <VaIcon :name="metric.icon" size="large" />
      </template>
    </DataSectionItem>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useColors } from 'vuestic-ui'
import DataSectionItem from './DataSectionItem.vue'

const { getColor } = useColors()

const dashboardMetrics = computed(() => [
  {
    id: 'totalUsers',
    title: 'Total Users',
    value: '15,548',
    icon: 'mso-people',
    changeText: '+1,250',
    changeDirection: 'up',
    iconBackground: getColor('success'),
    iconColor: getColor('on-success'),
  },
  {
    id: 'activeGroups',
    title: 'Active Groups',
    value: '245',
    icon: 'mso-groups',
    changeText: '+25.36%',
    changeDirection: 'up',
    iconBackground: getColor('info'),
    iconColor: getColor('on-info'),
  },
  {
    id: 'healthPosts',
    title: 'Health Posts',
    value: '1,525',
    icon: 'mso-post_add',
    changeText: '+12.5%',
    changeDirection: 'up',
    iconBackground: getColor('danger'),
    iconColor: getColor('on-danger'),
  },
  {
    id: 'activeConsultations',
    title: 'Active Consultations',
    value: '127',
    icon: 'mso-medical_services',
    changeText: '+15%',
    changeDirection: 'up',
    iconBackground: getColor('warning'),
    iconColor: getColor('on-warning'),
  },
])
</script>
