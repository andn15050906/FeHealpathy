<template>
  <div class="change-password">
    <h2>{{ texts.changePassword }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="currentPassword">{{ texts.currentPassword }}</label>
        <input 
          id="currentPassword" 
          v-model="form.currentPassword" 
          type="password" 
          maxlength="50" 
          required
        />
        <span class="text-danger">{{ errors.currentPassword }}</span>
      </div>

      <div class="form-group">
        <label for="newPassword">{{ texts.newPassword }}</label>
        <input 
          id="newPassword" 
          v-model="form.newPassword" 
          type="password" 
          maxlength="50" 
          required
        />
        <span class="text-danger">{{ errors.newPassword }}</span>
      </div>

      <div class="form-group">
        <label for="rePassword">{{ texts.rePassword }}</label>
        <input 
          id="rePassword" 
          v-model="form.rePassword" 
          type="password" 
          maxlength="50" 
          required
        />
        <span class="text-danger">{{ errors.rePassword }}</span>
      </div>

      <button type="submit">{{ texts.changePassword }}</button>
    </form>
    <div v-if="alertMessage" :class="alertStatus ? 'alert-success' : 'alert-danger'">
      {{ alertMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { changePassword } from '@/services/authService.js';

const texts = {
  changePassword: 'Change Password',
  currentPassword: 'Current Password',
  newPassword: 'New Password',
  rePassword: 'Retype Password'
};

const form = ref({
  currentPassword: '',
  newPassword: '',
  rePassword: ''
});

const errors = ref({});
const alertMessage = ref('');
const alertStatus = ref(true);

const handleSubmit = async () => {
  errors.value = {}; 
  if (form.value.newPassword !== form.value.rePassword) {
    errors.value.rePassword = 'Passwords do not match';
    return;
  }

  if (form.value.newPassword === form.value.currentPassword) {
    errors.value.newPassword = 'New Password must be different from Current Password';
    return;
  }

  try {

    const response = await changePassword(form.value.currentPassword, form.value.newPassword);
    alertMessage.value = 'Updated successfully.';
    alertStatus.value = true;
  } catch (error) {
    alertMessage.value = 'Invalid password!';
    alertStatus.value = false;
  }
};
</script>
<style>
</style>
