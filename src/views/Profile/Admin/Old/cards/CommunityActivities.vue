<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-secondary font-bold uppercase">Community Activities</h1>
    </VaCardTitle>
    <VaCardContent>
      <div class="space-y-4">
        <div v-for="(activity, index) in activities" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded">
          <div class="flex items-center gap-3">
            <VaIcon :name="activity.icon" :color="activity.color" />
            <div>
              <div class="font-semibold">{{ activity.title }}</div>
              <div class="text-sm text-secondary">{{ activity.description }}</div>
            </div>
          </div>
          <div class="text-sm">{{ activity.count }}</div>
        </div>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
const activities = [
  {
    icon: 'forum',
    color: 'primary',
    title: 'Health Discussions',
    description: 'Active discussions today',
    count: '45'
  },
  {
    icon: 'groups',
    color: 'success',
    title: 'Group Sessions',
    description: 'Scheduled this week',
    count: '12'
  },
  {
    icon: 'medical_services',
    color: 'warning',
    title: 'Health Consultations',
    description: 'Pending requests',
    count: '28'
  },
  {
    icon: 'article',
    color: 'info',
    title: 'Health Articles',
    description: 'Published this week',
    count: '15'
  }
]
</script> 