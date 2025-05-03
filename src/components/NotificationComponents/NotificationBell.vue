<template>
  <div v-if="isAuthenticated" class="notification-bell-container">
    <div class="bell-icon" @click="toggleDropdown">
      <i class="fas fa-bell"></i>
      <span v-if="unreadCount > 0" class="notification-count">
        {{ unreadCount }}
      </span>
    </div>

    <transition name="fade">
      <div v-if="isDropdownVisible" class="notification-dropdown">
        <div class="header">
          <span>Thông báo</span>
          <button class="mark-all-button" v-if="unreadCount > 0" @click="markAllAsRead">
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        <div v-if="notifications.length === 0" class="no-notifications">
          Không có thông báo
        </div>

        <div v-else>
          <div class="notification-item" v-for="(notification, index) in notifications" :key="notification.id"
            :class="{ unread: !notification.read }">
            <div class="notification-text">
              <p class="sender-name">{{ notification.senderName }}</p>
              <p class="notification-content">{{ notification.content }}</p>
              <p class="time">{{ getTimeAgo(notification.timestamp) }}</p>
            </div>

            <div class="actions">
              <i v-if="!notification.read" class="fas fa-circle unread-dot" title="Chưa đọc"></i>
              <button v-if="!notification.read" class="mark-read" @click="markAsRead(notification.id)">
                Đã đọc
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getNotifications } from "@/scripts/api/services/notificationService";

export default {
  props: {
    isAuthenticated: Boolean,
    userId: String,
  },
  data() {
    return {
      notifications: [],
      isDropdownVisible: false,
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.filter((n) => !n.read).length;
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    getTimeAgo(timestamp) {
      const time = new Date(timestamp);
      const now = new Date();
      const diff = Math.floor((now - time) / 1000);
      if (diff < 60) return `${diff} giây trước`;
      if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
      return `${Math.floor(diff / 86400)} ngày trước`;
    },
    markAsRead(id) {
      const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]");
      if (!readIds.includes(id)) {
        readIds.push(id);
        localStorage.setItem("readNotifications", JSON.stringify(readIds));
      }

      const index = this.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        this.notifications[index].read = true;
      }
    },
    markAllAsRead() {
      const allIds = this.notifications.map((n) => n.id);
      localStorage.setItem("readNotifications", JSON.stringify(allIds));
      this.notifications = this.notifications.map((n) => ({
        ...n,
        read: true,
      }));
    },
    async fetchNotifications() {
      try {
        const response = await getNotifications({ ReceiverId: this.userId });
        const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]");
        const notifications = response.items || response;

        this.notifications = notifications.map((notification) => {
          let content = "";
          let senderName = "Hệ thống";
          let timestamp = notification.createdTime || new Date().toISOString();

          try {
            const parsed = JSON.parse(notification.message);
            content = parsed.Message || "Không có nội dung";
            senderName = parsed.Sender || "Hệ thống";
          } catch {
            content = notification.message;
          }

          return {
            id: notification.id,
            content,
            senderName,
            timestamp,
            read: readIds.includes(notification.id),
          };
        });
      } catch (err) {
        console.error("Lỗi khi lấy thông báo:", err);
      }
    },
  },
  mounted() {
    if (this.isAuthenticated) {
      this.fetchNotifications();
    }
  },
};
</script>

<style scoped>
.notification-bell-container {
  position: relative;
  display: inline-block;
}

.bell-icon {
  font-size: 1.8rem;
  cursor: pointer;
  color: #333;
  position: relative;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
}

.notification-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  width: 300px;
  max-height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
}

.mark-all-button {
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.8rem;
  cursor: pointer;
}

.no-notifications {
  padding: 15px;
  text-align: center;
  color: #666;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  background: white;
}

.notification-item.unread {
  background: #f0f7ff;
}

.notification-text {
  flex: 1;
}

.sender-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.notification-content {
  margin: 2px 0;
  font-size: 0.9rem;
}

.time {
  font-size: 0.75rem;
  color: #888;
}

.actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.unread-dot {
  font-size: 0.6rem;
  color: #007bff;
}

.mark-read {
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #007bff;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>