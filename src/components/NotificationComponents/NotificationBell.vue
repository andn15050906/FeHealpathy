<template>
  <div v-if="isAuthenticated" class="notification-bell-container">
    <div class="bell-icon" @click="toggleDropdown">
      <i class="fas fa-bell"></i>
      <span v-if="unreadCount > 0" class="notification-count">{{
        unreadCount
      }}</span>
    </div>
    <transition name="fade">
      <div v-if="isDropdownVisible" class="notification-dropdown">
        <div v-if="notifications.length === 0" class="no-notifications">
          No notifications
        </div>
        <div v-else>
          <div
            class="notification-item"
            v-for="(notification, index) in notifications"
            :key="index"
            :class="{ unread: !notification.read }"
          >
            <p class="notification-content">{{ notification.content }}</p>
            <button
              class="mark-read-button"
              v-if="!notification.read"
              @click="markAsRead(index)"
            >
              Mark as read
            </button>
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
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      notifications: [],
      isDropdownVisible: false,
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.filter((notification) => !notification.read)
        .length;
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    markAsRead(index) {
      const notification = this.notifications[index];
      notification.read = true;

      const readIds = JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );
      readIds.push(notification.id);
      localStorage.setItem(
        "readNotifications",
        JSON.stringify([...new Set(readIds)])
      );
    },

    async fetchNotifications() {
      try {
        const response = await getNotifications({ ReceiverId: this.userId });
        const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]");

        const notifications = response.items || response;

        this.notifications = notifications.map((notification) => {
          let content = "";
          try {
            const parsed = JSON.parse(notification.message);
            content = parsed.Message || "No message";
          } catch (e) {
            content = notification.message;
          }

          return {
            id: notification.id,
            content,
            read: readIds.includes(notification.id),
          };
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
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
  position: relative;
  font-size: 1.8rem;
  cursor: pointer;
  color: #333;
  transition: transform 0.2s ease;
}

.bell-icon:hover {
  transform: scale(1.1);
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4040;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.notification-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 200px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.no-notifications {
  padding: 15px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;
}

.notification-item.unread {
  background: #f9f9f9;
  font-weight: bold;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-content {
  margin-bottom: -5px;
  font-size: 0.9rem;
  color: #333;
  flex: 1;
}

.mark-read-button {
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 10px;
  transition: color 0.2s ease;
}

.mark-read-button:hover {
  color: #0056b3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
