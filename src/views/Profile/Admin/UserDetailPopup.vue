<template>
  <div v-if="show" class="popup-overlay">
    <div class="popup-content">
      <div class="popup-header">
        <h2>User Information</h2>
        <button class="close-button" @click="close">×</button>
      </div>
      <div class="user-info">
        <div class="user-avatar">
          <img :src="user.avatar || 'https://via.placeholder.com/150'" alt="User avatar">
        </div>
        <div class="user-details">
          <div class="info-row">
            <label>Email:</label>
            <span>{{ user.email }}</span>
          </div>
          <div class="info-row">
            <label>Last visited:</label>
            <span>Apr 15, 2023 18:09:19</span>
          </div>
          <div class="info-row">
            <label>Roles:</label>
            <span class="role-badge">{{ user.role }}</span>
          </div>
          <div class="info-row">
            <label>Status:</label>
            <span class="status-badge active">Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDetailPopup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.popup-content {
  width: 400px;
  height: 100%;
  background-color: white;
  padding: 20px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.user-info {
  padding: 20px;
}

.user-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.user-avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-row label {
  font-weight: bold;
  color: #666;
}

.role-badge {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style> 