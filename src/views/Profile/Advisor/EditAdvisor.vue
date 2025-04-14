<template>
  <div class="content">
    <SweetAlert ref="sweetAlert" />
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-form-section">
          <form @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="creationTime">Join Date</label>
                <span class="form-control readonly-field" style="cursor: not-allowed;" title="This field cannot be edited">{{ form.creationTime }}</span>
              </div>
              <div class="form-group">
                <label for="balance">Balance</label>
                <span class="form-control readonly-field" style="cursor: not-allowed;" title="This field cannot be edited">{{ form.balance }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="courseCount">Course Count</label>
                <span class="form-control readonly-field" style="cursor: not-allowed;" title="This field cannot be edited">{{ form.courseCount }}</span>
              </div>
              <div class="form-group">
                <label for="experience">Experience</label>
                <input type="text" id="experience" v-model="form.experience" class="form-control" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group full-width">
                <label for="intro">Introduction</label>
                <textarea id="intro" v-model="form.intro" maxlength="1000" class="form-control"></textarea>
              </div>
            </div>
            <div class="form-buttons">
              <button type="submit" class="btn btn-save">SAVE</button>
              <button type="button" class="btn btn-cancel" @click="openCancelPopup">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="password-change-btn">
        <RouterLink class="btn btn-warning white-text" to="/change-password">
          Change Password
        </RouterLink>
      </div>
    </div>
    <UpdateConfirmPopup :isVisible="confirmDialogVisible" message="Are you sure you want to update your advisor profile?"
      url="dummyUrl" @confirmUpdate="handleConfirmUpdate" @update:isVisible="confirmDialogVisible = $event" />
    <CancelConfirmPopup :isVisible="cancelDialogVisible" message="Are you sure to cancel your changes?"
      @confirmCancel="handleConfirmCancel" @update:isVisible="cancelDialogVisible = $event" />
  </div>
</template>

<script>
import { ref, onBeforeMount, inject } from 'vue';
import dict from '@/scripts/data/dictionary.json';
import { getAdvisorProfile, updateAdvisorProfile } from '@/scripts/api/services/advisorService';
import SweetAlert from '../../../components/Common/Popup/SweetAlert.vue';
import UpdateConfirmPopup from '../../../components/Common/Popup/UpdateConfirmPopup.vue';
import CancelConfirmPopup from '../../../components/Common/Popup/CancelConfirmPopup.vue';

export default {
  components: {
    SweetAlert,
    UpdateConfirmPopup, 
    CancelConfirmPopup
  },
  setup() {
    const form = ref({
      id:'',
      creationTime: '',
      balance: 0,
      courseCount: 0,
      experience: '',
      intro: ''
    });

    const originalForm = ref({});
    const confirmDialogVisible = ref(false);
    const cancelDialogVisible = ref(false);
    const loadingSpinner = inject('loadingSpinner');
    const sweetAlert = inject('sweetAlert');
    const text = dict['en']

    const fetchProfile = async () => {
  try {
    loadingSpinner?.showSpinner();

    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const userId = userProfile?.id;
    const advisorData = await getAdvisorProfile(userId);

    const advisor = advisorData.items ? advisorData.items[0] : advisorData;
    console.log(advisorData);
    advisor.creationTime = formatDate(advisor.creationTime);
    advisor.intro = advisor.intro;

    Object.assign(form.value, advisor);
    originalForm.value = { ...form.value };
  } catch (error) {
    console.error(error);
    await sweetAlert.showError('Failed to retrieve advisor profile');
  } finally {
    loadingSpinner?.hideSpinner();
  }
};

const confirmChanges = async () => {
  try {
    loadingSpinner?.showSpinner();

    const formData = new FormData();

    formData.append("Id", form.value.id);
    formData.append("Experience", form.value.experience);
    formData.append("intro", form.value.intro); 

    const response = await updateAdvisorProfile(formData);
    console.log(response);
    console.log('API Response:', response);

    if (response !== false) {
      loadingSpinner.hideSpinner();
      await sweetAlert.showAlert({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your advisor profile has been successfully updated!'
      });

    } else {
      throw new Error(response?.message || 'Update failed.');
    }
  } catch (error) {
    console.error(error);
    sweetAlert.showError('Error updating advisor profile.');
  } finally {
    loadingSpinner?.hideSpinner();
  }
};

const validateExperience = () => {
  const wordCount = form.value.experience.trim().split(/\s+/).length;
  console.log('Experience word count:', wordCount);
  if (wordCount < 5) {
    sweetAlert.showError('Experience must be at least 5 words.');
    return false;
  }
  return true;
};

const validateIntroduction = () => {
  const wordCount = form.value.intro.trim().split(/\s+/).length;
  console.log('Introduction word count:', wordCount);
  if (wordCount < 10) {
    sweetAlert.showError('Introduction must be at least 10 words.');
    return false;
  }
  return true;
};

const handleSubmit = () => {
  if (validateExperience() && validateIntroduction()) {
    confirmDialogVisible.value = true;
  }
};

    const handleConfirmUpdate = (confirm) => {
      if (confirm) {
        confirmChanges();
      }
    };

    const openCancelPopup = () => {
      cancelDialogVisible.value = true;
    };

    const handleConfirmCancel = (confirm) => {
      if (confirm) {
        form.value = { ...originalForm.value };
      }
    };

    const formatDate = (date) => {
      if (!date || typeof date !== 'string') return '';
      return date.split('T')[0];
    };

    onBeforeMount(() => {
      fetchProfile();
    });

    return { form,
      text,
      handleSubmit,
      openCancelPopup,
      confirmDialogVisible,
      cancelDialogVisible,
      handleConfirmUpdate,
      handleConfirmCancel };
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  font-family: 'Roboto', sans-serif;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  display: flex;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-image-section {
  flex: 0 0 350px;
  padding: 30px;
  background-color: #f7f7fc;
  display: flex;
  flex-direction: column;
}

.avatar-container {
  width: 150px;
  height: 150px;
  position: relative;
  margin: 0 auto 30px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info {
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
}

.info-label {
  width: 120px;
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.profile-form-section {
  flex: 1;
  padding: 30px;
}

.form-row {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
}

.form-group {
  flex: 1;
}

.form-group.full-width {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #6c757d;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
}

textarea.form-control {
  height: 100px;
  resize: vertical;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-save {
  background-color: #5e72e4;
  color: white;
}

.btn-cancel {
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #6c757d;
}

.btn-warning {
  background-color: #ff9800;
  color: white;
  margin-top: 20px;
}

.password-change-btn {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.white-text {
  color: #fff;
}

.white-text a {
  color: whitesmoke;
}
</style>
