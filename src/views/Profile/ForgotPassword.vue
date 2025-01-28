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

          <button type="submit" class="forgot-password-button">Send Password Reset Email.</button>
          <div v-if="message" :class="{ 'error-message': !isSuccess, 'success-message': isSuccess }">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { forgotPassword } from '@/scripts/api/services/userService.js';

const email = ref('');
const message = ref('');
const isSuccess = ref(false);
const router = useRouter();

const handleForgotPassword = async () => {
  try {
    await forgotPassword(email.value);
    message.value = 'Password reset email sent!';
    isSuccess.value = true;
    setTimeout(() => router.push({ name: 'signIn' }), 2000);
  } catch (error) {
    message.value = 'Failed to send password reset email. Please try again.';
    isSuccess.value = false;
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

.forgot-password-button:hover {
  background-color: #e65c00;
}
</style>