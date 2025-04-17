<template>
  <div class="notification-settings">
    <h3 class="section-title">Cài đặt thông báo</h3>
    <p class="section-desc">Mặc định, bạn sẽ nhận thông báo dựa trên tùy chọn của bạn.</p>
    <div class="notification-group" v-for="notification in notifications" :key="notification.key">
      <div class="notification-info">
        <h4>{{ notification.name }}</h4>
        <p>Kiểm soát cách bạn nhận những thông báo này</p>
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
  { name: 'Thông báo bài viết mới', isEnabled: true, key: 'newPost' },
  { name: 'Thông báo bình luận', isEnabled: true, key: 'comment' },
  { name: 'Thông báo tin nhắn', isEnabled: true, key: 'message' },
  { name: 'Thông báo cập nhật khóa học', isEnabled: false, key: 'courseUpdate' }
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