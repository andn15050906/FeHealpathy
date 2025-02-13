<template>
  <div class="change-password-container">
    <h2 style="font-size: 30px;font-weight: bold;">Change Password</h2>
    <form @submit.prevent="handleChangePassword">
      <div class="form-group">
        <label>Current Password</label>
        <div class="password-input">
          <input :type="showCurrentPassword ? 'text' : 'password'" v-model="currentPassword" required placeholder="Enter current password"/>
          <span @click="toggleShowCurrentPassword" class="toggle-icon">{{ showCurrentPassword ? '🙈' : '👁️' }}</span>
        </div>
      </div>
      <div class="form-group">
        <label>New Password</label>
        <div class="password-input">
          <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" required placeholder="Enter new password"/>
          <span @click="toggleShowNewPassword" class="toggle-icon">{{ showNewPassword ? '🙈' : '👁️' }}</span>
        </div>
      </div>
      <div class="form-group">
        <label>Confirm New Password</label>
        <div class="password-input">
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" required placeholder="Confirm new password"/>
          <span @click="toggleShowConfirmPassword" class="toggle-icon">{{ showConfirmPassword ? '🙈' : '👁️' }}</span>
        </div>
      </div>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? "Updating..." : "Change Password" }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { changePassword } from "@/scripts/api/services/userService";

export default {
  setup() {
    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);

    const toggleShowCurrentPassword = () => {
      showCurrentPassword.value = !showCurrentPassword.value;
    };
    const toggleShowNewPassword = () => {
      showNewPassword.value = !showNewPassword.value;
    };
    const toggleShowConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    const validatePassword = (password) => {
      const conditions = [];

        if (!/.{6,}/.test(password)) conditions.push("at least 6 characters");
        if (!/[A-Z]/.test(password)) conditions.push("at least one uppercase letter");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) conditions.push("one special character");

        return conditions.length > 0 
          ? `Password must contain ${conditions.join(", ")}.` 
          : "";
      };


    const handleChangePassword = async () => {
      errorMessage.value = "";
      successMessage.value = "";

      if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = "New password not match";
        return;
      }

      const passwordError = validatePassword(newPassword.value);
      if (passwordError) {
        errorMessage.value = passwordError;
        return;
      }

      loading.value = true;

      try {
        await changePassword(currentPassword.value, newPassword.value);
        successMessage.value = "Change passwood successful!";
      } catch (error) {
        errorMessage.value = "Current password is wrong";
      } finally {
        loading.value = false;
      }
    };

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      handleChangePassword,
      loading,
      errorMessage,
      successMessage,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      toggleShowCurrentPassword,
      toggleShowNewPassword,
      toggleShowConfirmPassword,
    };
  },
};
</script>

<style scoped>
.change-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}
.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
}
.success-message {
  background: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
}
.form-group {
  margin-bottom: 20px;
  text-align: left;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.password-input {
  display: flex;
  align-items: center;
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 10px;
}
.password-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
}
.toggle-icon {
  cursor: pointer;
  margin-left: 10px;
}
.submit-btn {
  width: 100%;
  padding: 12px;
  background: #ff8c00;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
}
.submit-btn:hover {
  background: #e07b00;
}
.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
