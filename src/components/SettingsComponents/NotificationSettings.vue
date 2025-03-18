<template>
  <div class="notification-settings">
    <h3 class="section-title">Notification Settings</h3>
    <p class="section-desc">By default, you will be notified based on your preferences.</p>
    <div class="notification-group" v-for="notification in notifications" :key="notification.key">
      <div class="notification-info">
        <h4>{{ notification.name }}</h4>
        <p>Control how you receive these notifications</p>
      </div>
      <v-switch v-model="notification.isEnabled" @change="saveNotificationSettings(notification)" color="info" />
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
  { name: 'New post notifications', isEnabled: true, key: 'newPost' },
  { name: 'Comment notifications', isEnabled: true, key: 'comment' },
  { name: 'Message notifications', isEnabled: true, key: 'message' },
  { name: 'Course update notifications', isEnabled: false, key: 'courseUpdate' }
])
const saveNotificationSettings = (notification: Notification) => {
  localStorage.setItem(`notification_${notification.key}`, notification.isEnabled.toString())
}
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
.notification-settings {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.section-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.notification-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
}

.notification-info {
  display: flex;
  flex-direction: column;
}

.notification-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.notification-info p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #999;
}
</style>