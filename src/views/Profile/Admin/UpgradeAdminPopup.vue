<template>
  <div v-if="show" class="popup-overlay">
    <div class="popup-content">
      <div class="popup-header">
        <h2>Upgrade to Admin</h2>
        <button class="close-button" @click="close">×</button>
      </div>
      <div class="upgrade-form">
        <div class="user-info">
          <img :src="user.avatar || 'https://via.placeholder.com/50'" alt="User avatar" class="small-avatar">
          <div>
            <div class="user-name">{{ user.name }}</div>
            <div class="user-email">{{ user.email }}</div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Reason for upgrade:</label>
          <textarea v-model="reason" placeholder="Enter reason for upgrading to Admin role"></textarea>
        </div>

        <div class="form-group">
          <label>Admin privileges:</label>
          <div class="checkbox-group">
            <label class="checkbox">
              <input type="checkbox" v-model="privileges.userManagement">
              User Management
            </label>
            <label class="checkbox">
              <input type="checkbox" v-model="privileges.contentManagement">
              Content Management
            </label>
            <label class="checkbox">
              <input type="checkbox" v-model="privileges.systemSettings">
              System Settings
            </label>
          </div>
        </div>

        <div class="actions">
          <button class="cancel-button" @click="close">Cancel</button>
          <button class="confirm-button" @click="confirmUpgrade">Confirm Upgrade</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpgradeAdminPopup',
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
  data() {
    return {
      reason: '',
      privileges: {
        userManagement: false,
        contentManagement: false,
        systemSettings: false
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirmUpgrade() {
      if (!this.reason.trim()) {
        alert('Please provide a reason for the upgrade');
        return;
      }
      this.$emit('confirm', {
        userId: this.user.id,
        reason: this.reason,
        privileges: this.privileges
      });
      this.close();
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

.upgrade-form {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.small-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.user-email {
  color: #666;
  font-size: 0.9em;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.cancel-button, .confirm-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-button {
  background-color: #007bff;
  color: white;
}

.confirm-button:hover {
  background-color: #0056b3;
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