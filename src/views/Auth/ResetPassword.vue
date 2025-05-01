<template>
  <div class="reset-password-container">
    <h1>Reset Password</h1>
    <form @submit.prevent="handleResetPassword">
      <label for="newPassword">Mật khẩu mới:</label>
      <input v-model="newPassword" type="password" id="newPassword" required />
      <label for="confirmPassword">Xác nhận mật khẩu:</label>
      <input v-model="confirmPassword" type="password" id="confirmPassword" required />
      <button type="submit">Khôi phục mật khẩu</button>
      <div v-if="message" :class="{ 'error-message': !isSuccess, 'success-message': isSuccess }">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { resetPassword } from '@/scripts/api/services/userService.js';

const route = useRoute();
const router = useRouter();

const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const isSuccess = ref(false);

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Mật khẩu không khớp!';
    isSuccess.value = false;
    return;
  }

  let email = route.params.email;
  let token = route.params.resetToken;

  try {
    await resetPassword(email, token, newPassword.value);
    message.value = 'Khôi phục mật khẩu thành công!';
    isSuccess.value = true;
    setTimeout(() => router.push({ name: 'signIn' }), 2000);
  } catch (error) {
    message.value = 'Khôi phục mật khẩu thất bại. Vui lòng thử lại.';
    isSuccess.value = false;
  }
};
</script>