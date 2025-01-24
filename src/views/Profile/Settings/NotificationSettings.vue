<template>
  <div class="flex flex-col p-4 bg-backgroundSecondary rounded-lg notifications-container">
    <h3 class="h3 mb-6">Notifications you receive</h3>
    <div v-for="notification in notifications" :key="notification.name" class="group notification-item">
      <div class="flex items-center justify-between overflow-x-hidden">
        <p class="text-regularLarge">
          {{ notification.name }}
        </p>
        <v-switch v-model="notification.isEnabled" @change="saveNotificationSettings(notification)" color="info" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface Notification {
  key: string
  isEnabled: boolean
  name: string
}

const notifications = ref<Notification[]>([
  {
    name: 'New post notifications',
    isEnabled: true,
    key: 'newPost'
  },
  {
    name: 'Comment notifications',
    isEnabled: true,
    key: 'comment'
  },
  {
    name: 'Message notifications',
    isEnabled: true,
    key: 'message'
  },
  {
    name: 'Course update notifications',
    isEnabled: false,
    key: 'courseUpdate'
  }
])

const saveNotificationSettings = (notification: Notification) => {
  localStorage.setItem(`notification_${notification.key}`, notification.isEnabled.toString());
}

// Load saved settings
onMounted(() => {
  notifications.value.forEach(notification => {
    const saved = localStorage.getItem(`notification_${notification.key}`)
    if (saved !== null) {
      notification.isEnabled = saved === 'true'
    }
  })
})
</script>

<style scoped>
.notifications-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-item {
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}
</style>
