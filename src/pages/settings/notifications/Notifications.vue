<template>
  <div class="flex flex-col p-4 bg-backgroundSecondary rounded-lg">
    <h3 class="h3 mb-6">Notifications you receive</h3>
    <div v-for="notification in notifications" :key="notification.name" class="group">
      <div class="flex items-center justify-between overflow-x-hidden">
        <p class="text-regularLarge">
          {{ notification.name }}
        </p>
        <VaSwitch v-model="notification.isEnabled" size="small" />
      </div>
      <VaDivider class="py-4 group-last:hidden" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const notifications = ref([
  {
    name: 'Thông báo bài viết mới',
    isEnabled: true
  },
  {
    name: 'Thông báo bình luận',
    isEnabled: true
  },
  {
    name: 'Thông báo tin nhắn',
    isEnabled: true
  },
  {
    name: 'Thông báo cập nhật khóa học',
    isEnabled: false
  }
])
</script>
