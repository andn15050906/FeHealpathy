<template>
  <div class="content">
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-image-section">
          <div class="avatar-container" @click="triggerAvatarUpload">
            <img :src="form.avatarUrl" alt="User Avatar" class="avatar-image" />
            <div class="camera-icon">
              <i class="fas fa-camera"></i>
            </div>
          </div>
          <input @change="handleAvatarChange" ref="avatarInput" type="file" hidden accept=".jpg, .jpeg, .png" />
          <div class="profile-info">
            <div class="info-item">
              <div class="info-label">Name:</div>
              <div class="info-value">{{ form.fullName }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">User name:</div>
              <div class="info-value username-container">
                {{ form.userName }}
                <i class="fas fa-info-circle info-icon" title="Username cannot be changed"></i>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Email:</div>
              <div class="info-value">{{ form.email }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Join Date:</div>
              <div class="info-value">{{ form.creationTime }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Courses enrolled:</div>
              <div class="info-value">{{ form.enrollmentCount }}</div>
            </div>
          </div>
        </div>
        <div class="profile-form-section">
          <form @submit.prevent="handleSubmit" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="fullName">Full Name <span class="required">*</span></label>
                <input 
                  type="text" 
                  id="fullName" 
                  v-model="form.fullName" 
                  maxlength="50" 
                  class="form-control"
                  :class="{ 'error': errors.fullName }"
                  @blur="validateFullName"
                />
                <span class="error-message" v-if="errors.fullName">{{ errors.fullName }}</span>
              </div>
              <div class="form-group">
                <label for="userName">User Name</label>
                <input type="text" id="userName" v-model="form.userName" maxlength="50" readonly class="form-control" />
                <span class="info-text">Username cannot be changed</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  maxlength="50" 
                  class="form-control"
                  :class="{ 'error': errors.email }"
                  @blur="validateEmail"
                />
                <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
              </div>
              <div class="form-group">
                <label for="dateOfBirth">Date of Birth <span class="required">*</span></label>
                <input 
                  type="date" 
                  id="dateOfBirth" 
                  v-model="form.dateOfBirth" 
                  class="form-control"
                  :class="{ 'error': errors.dateOfBirth }"
                  @blur="validateDateOfBirth"
                  :max="maxDate"
                />
                <span class="error-message" v-if="errors.dateOfBirth">{{ errors.dateOfBirth }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group full-width">
                <label for="bio">About Me <span class="optional">(optional)</span></label>
                <textarea 
                  id="bio" 
                  v-model="form.bio" 
                  maxlength="1000" 
                  class="form-control"
                  placeholder="Tell us about yourself..."
                ></textarea>
                <span class="char-count">{{ form.bio ? form.bio.length : 0 }}/1000</span>
              </div>
            </div>
            <div class="form-buttons">
              <button type="submit" class="btn btn-save" :disabled="!isFormValid">SAVE</button>
              <button type="button" class="btn btn-cancel" @click="openCancelPopup">CANCEL</button>
            </div>
          </form>
        </div>
      </div>
      <div class="password-change-btn">
        <button class="btn btn-warning white-text">
          <RouterLink :to="'change-password'">Change Password</RouterLink>
        </button>
      </div>
      <div class="premium-upgrade">
        <AccountUpgrade></AccountUpgrade>
      </div>
    </div>
    <UpdateConfirmPopup 
      :isVisible="confirmDialogVisible" 
      message="Are you sure you want to update your profile?"
      url="dummyUrl" 
      @confirmUpdate="handleConfirmUpdate" 
      @update:isVisible="confirmDialogVisible = $event" 
    />
    <CancelConfirmPopup 
      :isVisible="cancelDialogVisible" 
      message="Are you sure to cancel your changes?"
      @confirmCancel="handleConfirmCancel" 
      @update:isVisible="cancelDialogVisible = $event" 
    />
  </div>
</template>

<script>
import { inject, ref, onBeforeMount, computed } from 'vue';
import dict from '@/scripts/data/dictionary.json';
import { updateUserProfile, getUserById } from '@/scripts/api/services/userService.js';
import { getUserProfile, setUserProfile } from '@/scripts/api/services/authService';
import UpdateConfirmPopup from '@/components/Common/Popup/UpdateConfirmPopup.vue';
import CancelConfirmPopup from '@/components/Common/Popup/CancelConfirmPopup.vue';
import AccountUpgrade from '@/components/PaymentComponents/AccountUpgrade.vue';

export default {
  components: { UpdateConfirmPopup, CancelConfirmPopup, AccountUpgrade },
  setup() {
    const form = ref({
      fullName: '',
      bio: '',
      avatar: null,
      avatarUrl: '',
      email: '',
      userName: '',
      dateOfBirth: '',
      enrollmentCount: '',
      role: '',
      creationTime: ''
    });

    const errors = ref({
      fullName: '',
      email: '',
      dateOfBirth: ''
    });

    // Tính toán ngày tối đa cho date of birth (12 tuổi trở lên)
    const maxDate = computed(() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 12);
      return date.toISOString().split('T')[0];
    });

    // Validate fullname
    const validateFullName = () => {
      if (!form.value.fullName.trim()) {
        errors.value.fullName = 'Full name is required';
        return false;
      }
      errors.value.fullName = '';
      return true;
    };

    // Validate email
    const validateEmail = () => {
      if (!form.value.email) return true; // Email is optional in edit
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(form.value.email)) {
        errors.value.email = 'Please enter a valid Gmail address';
        return false;
      }
      errors.value.email = '';
      return true;
    };

    // Validate date of birth
    const validateDateOfBirth = () => {
      if (!form.value.dateOfBirth) {
        errors.value.dateOfBirth = 'Date of birth is required';
        return false;
      }
      
      const birthDate = new Date(form.value.dateOfBirth);
      const today = new Date();
      const minAge = new Date();
      const maxAge = new Date();
      
      // Giới hạn tuổi tối thiểu 12 tuổi
      minAge.setFullYear(today.getFullYear() - 12);
      // Giới hạn tuổi tối đa 100 tuổi
      maxAge.setFullYear(today.getFullYear() - 100);

      if (birthDate > today) {
        errors.value.dateOfBirth = 'Date of birth cannot be in the future';
        return false;
      }

      if (birthDate > minAge) {
        errors.value.dateOfBirth = 'You must be at least 12 years old';
        return false;
      }

      if (birthDate < maxAge) {
        errors.value.dateOfBirth = 'Age cannot exceed 100 years';
        return false;
      }

      errors.value.dateOfBirth = '';
      return true;
    };

    // Kiểm tra form có hợp lệ không
    const isFormValid = computed(() => {
      return !errors.value.fullName && 
             !errors.value.email && 
             !errors.value.dateOfBirth &&
             form.value.fullName.trim() !== '' &&
             form.value.dateOfBirth !== '';
    });

    const originalForm = ref({});
    const confirmDialogVisible = ref(false);
    const cancelDialogVisible = ref(false);
    const loadingSpinner = inject('loadingSpinner');
    const sweetAlert = inject('sweetAlert');
    const text = dict['en'];
    const roleMapping = {
      0: 'Member',
      1: 'Advisor',
      2: 'Admin'
    };
    const fetchProfile = async () => {
      try {
        loadingSpinner.showSpinner();
        const userAuthData = getUserProfile();
        const userData = await getUserById(userAuthData?.id);
        userData.role = roleMapping[userData.role] || 'Unknown';
        userData.dateOfBirth = formatDate(userData.dateOfBirth);
        userData.creationTime = formatDate(userData.creationTime);
        userData.avatarUrl = getAvatarApiUrl(userData.avatarUrl);
        Object.assign(form.value, userData);
        originalForm.value = { ...form.value };
      } catch (error) {
        console.error(error);
        await sweetAlert.showError('Failed to retrieve profile');
      } finally {
        loadingSpinner.hideSpinner();
      }
    };
    const formatDate = (date) => {
      if (!date) return '';
      return date.split('T')[0];
    };
    //hàm xử lí url avt
    const getAvatarApiUrl = (avatarUrl) => {
      if (!avatarUrl) {
        return 'src/img/8f1ca2029e2efceebd22fa05cca423d7.jpg'; // Default avatar
      }
      
      if (avatarUrl.startsWith('http')) {
        return avatarUrl; // url bên ngoài
      }
      
      if (avatarUrl.startsWith('/')) {
        return avatarUrl; // đương dẫn nội bộ
      }
      return `/${avatarUrl}`; // thêm dấu / nếu là đường dẫn tương đối
    };
    //hàm xử lí khi user chọn ảnh mới
    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        form.value.avatar = file; // lưu file ảnh
        form.value.avatarUrl = URL.createObjectURL(file);
      }
    };
    const triggerAvatarUpload = () => {
      const avatarInput = document.querySelector('input[type="file"]');
      avatarInput.click();
    };
    //hàm xác nhận cập nhật thông tin user
    const confirmChanges = async () => {
      try {
        loadingSpinner.showSpinner();
        const formData = new FormData();
        formData.append('FullName', form.value.fullName);
        formData.append('Bio', form.value.bio);
        formData.append('DateOfBirth', form.value.dateOfBirth);
        if (form.value.avatar) {
          formData.append('Avatar.File', form.value.avatar);
          formData.append('Avatar.Title', 'User Profile Picture');
        }
        //gọi api cập nhật thông tin user
        const response = await updateUserProfile(formData);
        //cập nhật url avt mới
        if (response) {
          form.value.avatarUrl = response.avatarUrl || form.value.avatarUrl;
        }
        let updatedUser = getUserProfile();
        updatedUser.fullName = form.value.fullName;
        updatedUser.bio = form.value.bio;
        updatedUser.dateOfBirth = form.value.dateOfBirth;
        updatedUser.avatarUrl = form.value.avatarUrl;
        setUserProfile(updatedUser);
        await fetchProfile();
        loadingSpinner.hideSpinner();
        await sweetAlert.showAlert({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been successfully updated!'
        });
      } catch (error) {
        console.error(error);
        sweetAlert.showError('Error updating profile.');
      }
    };
    const handleSubmit = () => {
      // Validate all fields before submission
      const isFullNameValid = validateFullName();
      const isEmailValid = validateEmail();
      const isDateValid = validateDateOfBirth();

      if (!isFullNameValid || !isEmailValid || !isDateValid) {
        return;
      }

      confirmDialogVisible.value = true;
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
    onBeforeMount(() => {
      fetchProfile();
    });
    return {
      form,
      text,
      errors,
      maxDate,
      isFormValid,
      validateFullName,
      validateEmail,
      validateDateOfBirth,
      handleAvatarChange,
      triggerAvatarUpload,
      handleSubmit,
      openCancelPopup,
      confirmDialogVisible,
      cancelDialogVisible,
      handleConfirmUpdate,
      handleConfirmCancel
    };
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

.password-change-btn a {
  text-decoration: none;
}

.white-text {
  color: #fff;
}

.white-text a {
  color: whitesmoke;
}

.required {
  color: red;
  margin-left: 2px;
}

.optional {
  color: #666;
  font-size: 0.8em;
  margin-left: 4px;
}

.error {
  border-color: red !important;
}

.error-message {
  color: red;
  font-size: 0.8em;
  margin-top: 4px;
  display: block;
}

.info-text {
  color: #666;
  font-size: 0.8em;
  margin-top: 4px;
  display: block;
}

.char-count {
  color: #666;
  font-size: 0.8em;
  text-align: right;
  display: block;
  margin-top: 4px;
}

.username-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  color: #666;
  cursor: help;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  
.premium-upgrade {
  margin-top: 40px;
}
</style>