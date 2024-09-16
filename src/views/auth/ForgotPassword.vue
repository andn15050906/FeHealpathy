<template>
  <div class="forgot-password-container">
    <h1>Forgot Password</h1>
    <form @submit.prevent="handleForgotPassword">
      <label for="email">Email:</label>
      <input v-model="email" type="email" id="email" required />
      <button type="submit">Send Reset Link</button>
      <div v-if="message" :class="{'error-message': !isSuccess, 'success-message': isSuccess}">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { forgotPassword } from '@/services/authService.js';

const email = ref('');
const message = ref('');
const isSuccess = ref(false);
const router = useRouter();

const handleForgotPassword = async () => {
  try {
    await forgotPassword(email.value);
    message.value = 'Password reset email sent!';
    isSuccess.value = true;
    setTimeout(() => router.push('/sign-in'), 2000); // Redirect after 2 seconds
  } catch (error) {
    message.value = 'Failed to send password reset email. Please try again.';
    isSuccess.value = false;
  }
};
</script>
