<template>
  <div class="ChangePassword_pageWrapper">
    <section class="index-module_row">
      <section class="index-module_col">
        <div class="ChangePassword_wrapper">
          <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <h2 class="ChangePassword_heading">{{ text.updateUserProfile }}</h2>

            <!-- Current Password Field -->
            <div class="FieldWrapper">
              <div class="InputField">
                <h3 class="InputField_label">{{ text.CurrentPassword }}</h3>
                <input v-model="form.currentPassword" type="password" class="InputField_input" placeholder="Current Password" />
              </div>
            </div>

            <!-- New Password Field -->
            <div class="FieldWrapper">
              <div class="InputField">
                <h3 class="InputField_label">{{ text.NewPassword }}</h3>
                <input v-model="form.newPassword" type="password" class="InputField_input" placeholder="New Password" />
              </div>
            </div>

            <!-- Retype New Password Field -->
            <div class="FieldWrapper">
              <div class="InputField">
                <h3 class="InputField_label">{{ text.ReTypeNewPassword }}</h3>
                <input v-model="form.retypeNewPassword" type="password" class="InputField_input" placeholder="Retype New Password" />
              </div>
            </div>

            <div class="row">
              <div @click="openConfirmModal" class="Button_fieldButton">
                {{ text.SaveChanges }}
              </div>
            </div>
          </form>
        </div>
      </section>
    </section>

    <!-- Confirmation Modal -->
    <div class="modal fade" id="app-confirm-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">{{ text.Confirm }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-primary">{{ text.ConfirmQuestion }}</p>
          </div>
          <div class="modal-footer">
            <button @click="confirmChanges" type="button" class="btn btn-outline-danger">Yes</button>
            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">No</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { updateUserProfile } from '@/services/userService.js';

export default {
  setup() {
    const form = ref({
      currentPassword: '',
      newPassword: '',
      retypeNewPassword: '',
    });

    const text = {
      ChangePassword: 'Change Password',
      CurrentPassword: 'Current Password',
      NewPassword: 'New Password',
      ReTypeNewPassword: 'Retype New Password',
      SaveChanges: 'Save Changes',
      Confirm: 'Confirm',
      ConfirmQuestion: 'Are you sure you want to change your password?',
    };

    const validateForm = () => {
      const errors = {};
      if (!form.value.currentPassword) errors.currentPassword = 'Current Password is required';
      if (!form.value.newPassword) errors.newPassword = 'New Password is required';
      if (form.value.newPassword !== form.value.retypeNewPassword) errors.retypeNewPassword = 'Passwords do not match';
      if (form.value.currentPassword === form.value.newPassword) errors.newPassword = 'New Password must be different from Current Password';
      return errors;
    };

    const openConfirmModal = () => {
      new bootstrap.Modal(document.getElementById('app-confirm-modal')).show();
    };

    const confirmChanges = async () => {
      const errors = validateForm();
      if (Object.keys(errors).length) {
        alert('Please correct the errors in the form.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('CurrentPassword', form.value.currentPassword);
        formData.append('NewPassword', form.value.newPassword);

        await updateUserProfile(formData);
        alert('Password updated successfully!');
        form.value.currentPassword = '';
        form.value.newPassword = '';
        form.value.retypeNewPassword = '';
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Error updating password.');
      }
    };

    const handleSubmit = event => {
      event.preventDefault();
      openConfirmModal();
    };

    return {
      form,
      text,
      handleSubmit,
      openConfirmModal,
      confirmChanges
    };
  }
};
</script>

<style scoped>
/* Add your component styles here */
</style>
