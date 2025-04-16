<template>
  <div class="forgot-password-page">
    <div class="overlay">
      <div class="forgot-password-container">
        <h2>Forgot Your Password ?</h2>
        <form @submit.prevent="handleForgotPassword">
          <p v-if="generalError" class="error">{{ generalError }}</p>

          <div class="input-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="email" placeholder="Enter your email address" required />
          </div>

          <button type="submit" class="forgot-password-button" :disabled="loading">
            {{ loading ? 'Sending...' : 'Send Password Reset Email' }}
          </button>
          <div v-if="message" :class="{ 'error-message': !isSuccess, 'success-message': isSuccess }">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { forgotPassword, checkEmailExists } from '@/scripts/api/services/userService.js';

const email = ref('');
const message = ref('');
const generalError = ref('');
const isSuccess = ref(false);
const loading = ref(false);
const router = useRouter();
const loadingSpinner = inject('loadingSpinner');
const sweetAlert = inject('sweetAlert');

// Hàm kiểm tra định dạng email
const validateEmail = (email) => {
  const gmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return gmailRegex.test(email);
};

const handleForgotPassword = async () => {
  try {
    // Reset error messages
    message.value = '';
    generalError.value = '';

    // Kiểm tra định dạng email
    if (!validateEmail(email.value)) {
      generalError.value = 'Please enter a valid Email address (e.g., example@gmail.com)';
      return;
    }

    loading.value = true;
    if (loadingSpinner) loadingSpinner.showSpinner();

    // Kiểm tra email có tồn tại trong hệ thống không
    const emailExists = await checkEmailExists(email.value);
    
    if (!emailExists) {
      generalError.value = 'This email is not registered in our system.';
      return;
    }
    
    // Gửi yêu cầu reset password
    await forgotPassword(email.value);
    
    // Hiển thị thông báo thành công
    await sweetAlert.showSuccess('Password reset email has been sent to your email!');
    setTimeout(() => router.push({ name: 'signIn' }), 2000);
  } catch (error) {
    console.error('Error in forgot password:', error);
    if (error.response?.status === 404) {
      generalError.value = 'This email is not registered in our system.';
    } else if (error.response?.data?.message) {
      generalError.value = error.response.data.message;
    } else {
      generalError.value = 'Failed to process your request. Please try again.';
    }
  } finally {
    loading.value = false;
    if (loadingSpinner) loadingSpinner.hideSpinner();
  }
};
</script>


<style>
.page-container:has(.forgot-password-page) {
  background-color: unset !important;
}
</style>

<style scoped>
.forgot-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forgot-password-container {
  width: 600px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.logo {
  width: 150px;
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem 1.25rem;
  margin-top: 1rem;
}

.success-message {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 0.75rem 1.25rem;
  margin-top: 1rem;
}

.forgot-password-button {
  width: 100%;
  padding: 0.7rem;
  background-color: #ff6600;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.forgot-password-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.forgot-password-button:not(:disabled):hover {
  background-color: #e65c00;
}
</style>