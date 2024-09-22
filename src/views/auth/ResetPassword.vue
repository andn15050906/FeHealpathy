<template>
    <div class="reset-password-container">
      <h1>Reset Password</h1>
      <form @submit.prevent="handleResetPassword">
        <label for="newPassword">New Password:</label>
        <input v-model="newPassword" type="password" id="newPassword" required />
        <label for="confirmPassword">Confirm Password:</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" required />
        <button type="submit">Reset Password</button>
        <div v-if="message" :class="{'error-message': !isSuccess, 'success-message': isSuccess}">
          {{ message }}
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { resetPassword } from '@/services/authService.js';
  
  const route = useRoute();
  const router = useRouter();
  
  const newPassword = ref('');
  const confirmPassword = ref('');
  const message = ref('');
  const isSuccess = ref(false);
  
  const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Passwords do not match!';
    isSuccess.value = false;
    return;
  }

  const { email, token } = route.query;

  try {
    await resetPassword(email, token, newPassword.value);
    message.value = 'Password reset successful!';
    isSuccess.value = true;
    setTimeout(() => router.push('/sign-in'), 2000); // Redirect after 2 seconds
  } catch (error) {
    message.value = 'Password reset failed. Please try again.';
    isSuccess.value = false;
  }
};
  </script>
  