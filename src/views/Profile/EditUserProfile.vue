<template>
  <div class="content">
    <SweetAlert ref="sweetAlert" />
    <v-container id="user-profile" fluid tag="section">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="v-card--material pa-3 v-card v-sheet theme--light v-card--material--has-heading">
            <div class="v-application-custom">
              <div class="text-start v-card--material__heading mb-n6 v-sheet theme--dark elevation-6 success pa-7">
                <h4 class="white-text">Edit Profile</h4>
              </div>
            </div>
            <v-form @submit.prevent="handleSubmit" enctype="multipart/form-data">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field label="Full Name" v-model="form.fullName" maxlength="50" class="purple-input"
                      persistent-placeholder />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Email Address" v-model="form.email" type="email" maxlength="50"
                      class="purple-input" persistent-placeholder />
                  </v-col>
                </v-row>
                <v-row>
                  <!--Hidden if not current user-->
                  <v-col cols="12" md="6">
                    <v-text-field label="User Name" v-model="form.userName" maxlength="50" readonly
                      class="purple-input" persistent-placeholder />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Date of Birth" v-model="form.dateOfBirth" type="date" class="purple-input"
                      persistent-placeholder />
                  </v-col></v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field label="Join Date" v-model="form.creationTime" type="date"
                      class="purple-input" persistent-placeholder />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Enrollment Count" v-model="form.enrollmentCount" type="number"
                      class="purple-input" persistent-placeholder />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea label="About Me" v-model="form.bio" maxlength="1000" class="purple-input"
                      persistent-placeholder />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="text-right">
                    <v-btn @click="handleSubmit" color="success" class="mr-0">Update Profile</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="v-card-profile" :avatar="form.avatarUrl">
            <v-card-text class="text-center">
              <div>
                <div @click="triggerAvatarUpload" class="v-avatar">
                  <img :src="form.avatarUrl" alt="User Avatar" id="app-avatar-img" class="img">
                </div>
                <input @change="handleAvatarChange" ref="avatarInput" type="file" hidden accept=".jpg, .jpeg, .png" />
              </div>
              <h6 class="mb-1 grey--text">{{ form.role }}</h6>
              <h4 class="mb-3 black--text">{{ form.fullName }}</h4>
              <h6 class="font-weight-light grey--text">{{ form.bio }}</h6>
              <h6 class="font-weight-light grey--text">{{ form.creationTime }}</h6>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { inject, ref, onMounted } from 'vue';
import { ConvertTo_yyyy_mm_dd } from '../../scripts/logic/common';
import { updateUserProfile, getUserById } from '../../scripts/api/services/userService.js';
import { getUserAuthData, setUserAuthData } from '@/scripts/api/services/authService';
import { handleFormSubmit } from '@/scripts/logic/validation';
import GlobalState from '@/scripts/logic/globalState';
import dict from '@/scripts/data/dictionary.json';
import { computed } from 'vue';

export default {
  data() {
    var userProfile = GlobalState.getUserProfile();

    return {
      UserProfile: userProfile,
      UserProfile_UserInfo_DateOfBirth: ConvertTo_yyyy_mm_dd(new Date(userProfile.DateOfBirth)),
      UserProfile_UserInfo_JoinDate: ConvertTo_yyyy_mm_dd(new Date(userProfile.JoinDate))
    }
  },
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

    const loadingSpinner = inject('loadingSpinner');
    const sweetAlert = inject('sweetAlert');
    const text = dict['en'];

    const roleMapping = {
    0: 'User',
    1: 'Advisor',
    2: 'Admin'
    };

    const fetchProfile = async () => {
  try {
    loadingSpinner.showSpinner();

    // Lấy ID từ LocalStorage
    const userAuthData = getUserAuthData();
    const userId = userAuthData?.id;
    
    if (!userId) {
      console.warn("⚠️ Không tìm thấy ID trong LocalStorage!");
      return;
    }

    // Gọi API để lấy dữ liệu người dùng
    const userData = await getUserById(userId);

    // Chuyển đổi dữ liệu từ API
    userData.role = roleMapping[userData.role] || 'Unknown';
    userData.dateOfBirth = formatDate(userData.dateOfBirth);
    userData.creationTime = formatDate(userData.creationTime);
    userData.avatarUrl = getAvatarApiUrl(userData.avatarUrl);

    // Gán dữ liệu vào form
    Object.assign(form.value, userData);

    console.log("✅ Dữ liệu người dùng từ API:", userData);
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu người dùng:", error);
    await sweetAlert.showError('Không thể lấy thông tin người dùng.');
  } finally {
    loadingSpinner.hideSpinner();
  }
};

    const formatDate = (date) => {
      if (!date) return '';
      return date.split('T')[0];
    };

    const getAvatarApiUrl = (avatarUrl) => {
      if (avatarUrl && avatarUrl.startsWith('http')) {
      return avatarUrl;
    }
    return 'src/img/8f1ca2029e2efceebd22fa05cca423d7.jpg';
    };

    const handleAvatarChange = event => {
  const file = event.target.files[0];
  if (file) {
    form.value.avatar = file;
    form.value.avatarUrl = URL.createObjectURL(file);
    console.log("🔍 File selected:", file);
  }
    };


    const triggerAvatarUpload = () => {
      const avatarInput = document.querySelector('input[type="file"]');
      avatarInput.click();
    };

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

    const response = await updateUserProfile(formData);

    if (response) {
      form.value.avatarUrl = response.avatarUrl || form.value.avatarUrl;

      let updatedUser = getUserAuthData();

      updatedUser.fullName = form.value.fullName;
      updatedUser.bio = form.value.bio;
      updatedUser.dateOfBirth = form.value.dateOfBirth;
      updatedUser.avatarUrl = response.avatarUrl;

      setUserAuthData(updatedUser);
      console.log(updatedUser);

      await fetchProfile();
    } else {
      console.log("API Response:", response);
      console.warn("⚠️ API did not return avatarUrl, keeping old value.");
    }

    loadingSpinner.hideSpinner();

    await sweetAlert.showAlert({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your profile has been successfully updated!'
    });

  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    sweetAlert.showError('Error updating profile.');
  }
};

    const handleSubmit = () => handleFormSubmit(confirmChanges, sweetAlert);

    onMounted(() => {
      fetchProfile();
    });


    return {
      form,
      text,
      handleAvatarChange,
      triggerAvatarUpload,
      handleSubmit
    };
  }
};
</script>

<style scoped>
@import '../../assets/css/vuetify-custom/v-application.css';
@import '../../assets/css/vuetify-custom/v-app.css';
@import '../../assets/css/vuetify-custom/v-app-vendor.css';
@import '../../assets/css/vuetify-custom/chunk-7e72fb0e.a9a7c615.css';

.white-text {
  color: #fff;
}

.v-card--material {
  overflow: visible;
}

.v-avatar {
  height: 128px;
  width: 128px;
}

.v-avatar:hover {
  cursor: pointer;
  opacity: 0.5;
}

.sub-footer {
  position: relative;
  top: -20px;
}
</style>