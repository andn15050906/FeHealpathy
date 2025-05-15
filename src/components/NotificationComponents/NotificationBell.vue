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
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  position: relative;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #3db83b, #2e8b57);
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(61, 184, 59, 0.2);
}

.bell-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 184, 59, 0.3);
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}

.notification-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  width: 350px;
  max-height: 500px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
  z-index: 1000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e8f5e8;
  background: linear-gradient(135deg, #3db83b, #2e8b57);
  color: white;
  border-radius: 16px 16px 0 0;
}

.header span {
  font-weight: 600;
  font-size: 1.1rem;
}

.mark-all-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.mark-all-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.no-notifications {
  padding: 30px 15px;
  text-align: center;
  color: #666;
  font-size: 0.95rem;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #e8f5e8;
  background: white;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #f0f7f0;
}

.notification-item.unread {
  background: #f0f7f0;
}

.notification-text {
  flex: 1;
  padding-right: 15px;
}

.sender-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #2c3e50;
  margin-bottom: 4px;
}

.notification-content {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #34495e;
  line-height: 1.4;
}

.time {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 4px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unread-dot {
  font-size: 0.6rem;
  color: #3db83b;
}

.mark-read {
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #3db83b;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.mark-read:hover {
  background: rgba(61, 184, 59, 0.1);
}

/* Custom scrollbar */
.notification-dropdown::-webkit-scrollbar {
  width: 6px;
}

.notification-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.notification-dropdown::-webkit-scrollbar-thumb {
  background: #3db83b;
  border-radius: 3px;
}

.notification-dropdown::-webkit-scrollbar-thumb:hover {
  background: #2e8b57;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Animation for notification count */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.notification-count {
  animation: pulse 2s infinite;
}
</style>